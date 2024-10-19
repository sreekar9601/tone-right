"use client";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { StoryClient, StoryConfig, PIL_TYPE } from "@story-protocol/core-sdk";
import { uploadJSONToIPFS } from "./utils/uploadToIpfs";
import { createHash } from "crypto";
import { custom } from "viem";

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
      const config: StoryConfig = {
        account: wallet!.account,
        transport: custom(wallet!.transport),
        chainId: "iliad",
      };
      const client = StoryClient.newClient(config);

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
        song_url:musicFile,
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
        nftContract: "0xAceb5E631d743AF76aF69414eC8D356c13435E59",
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata: {
          ipMetadataURI: `ipfs://${ipIpfsHash}`,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: `ipfs://${nftIpfsHash}`,
          nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
      });

      setMessage(`Asset created! Transaction hash: ${response.txHash}`);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during the process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add a New Song</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Song Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Song Art (Image):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSongArt(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Song Music URL:</label>
          <input
            type="url"
            value= {musicFile || ""}
            onChange={(e) => setMusicFile(e.target.value)}
            placeholder="Enter the music file URL"
            required
          />
        </div>

        <div>
          <h3>Attributes:</h3>
          {attributes.map((attribute, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Key"
                value={attribute.key}
                onChange={(e) =>
                  handleAttributeChange(index, "key", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Value"
                value={attribute.value}
                onChange={(e) =>
                  handleAttributeChange(index, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveAttribute(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddAttribute}>
            Add Attribute
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
