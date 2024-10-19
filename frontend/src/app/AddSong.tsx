"use client";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { StoryClient, StoryConfig, PIL_TYPE } from "@story-protocol/core-sdk";
import { uploadJSONToIPFS } from "./utils/uploadToIpfs";
import { createHash } from "crypto";
import { custom, http } from "viem";

export default function AddSong() {
  const { address, isConnected } = useAccount();
  const { data: wallet } = useWalletClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [songArt, setSongArt] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<string | null>(null);
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isConnected) {
    return <p>Please connect your wallet to add a song.</p>;
  }

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet || !address) {
      alert("Wallet not connected");
      return;
    }

    setLoading(true);
    setMessage("Uploading metadata to IPFS...");

    try {
      console.log(wallet)
      if (wallet) {
        const config: StoryConfig = {
          wallet: wallet,
          transport: http('https://testnet.storyrpc.io'),
          chainId: "1513",
        }
        // @ts-ignore
        const client = StoryClient.newClientUseWallet(config);
      

      // Prepare IP Metadata
      const ipMetadata = client.ipAsset.generateIpMetadata({
        title: title,
        description: description,
        attributes: attributes.filter((attr) => attr.key && attr.value),
      });

      // Upload IP Metadata to IPFS
      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
      const ipHash = createHash("sha256")
        .update(JSON.stringify(ipMetadata))
        .digest("hex");

      // Prepare NFT Metadata
      const nftMetadata: any = {
        name: title,
        description: description,
        song_url: musicFile,
      };

      // Upload NFT Metadata to IPFS
      setMessage("Uploading NFT metadata to IPFS...");
      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
      const nftHash = createHash("sha256")
        .update(JSON.stringify(nftMetadata))
        .digest("hex");

      // Mint and Register IP Asset
      setMessage("Minting and registering IP asset...");
      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: "0x8Cd233A62e985b0FDF3C61332eA5390A76eaf8A5",
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata: {
          ipMetadataURI: `ipfs://${ipIpfsHash}`,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: `ipfs://${nftIpfsHash}`,
          nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
      });
      console.log(response)

      setMessage(`Asset created! Transaction hash: ${response.txHash}`);
    }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during the process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Add a New Song</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Song Title:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Song Art (Image):</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(e) => setSongArt(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Description:</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text">Song Music URL:</span>
          </label>
          <input
            type="url"
            className="input input-bordered w-full"
            value={musicFile || ""}
            onChange={(e) => setMusicFile(e.target.value)}
            placeholder="Enter the music file URL"
            required
          />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Attributes:</h3>
          {attributes.map((attribute, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Key"
                className="input input-bordered mr-2 w-1/2"
                value={attribute.key}
                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                className="input input-bordered w-1/2"
                value={attribute.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-error btn-sm ml-2"
                onClick={() => handleRemoveAttribute(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleAddAttribute}>
            Add Attribute
          </button>
        </div>

        <button type="submit" className="btn btn-success w-full" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-lg font-semibold">{message}</p>}
    </div>
  );
}
