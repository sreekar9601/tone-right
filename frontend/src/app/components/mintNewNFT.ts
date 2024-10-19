import { Address, createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { contractABI } from "../ABI/SimpleNFT";
import { adminAccount } from "../utils/StoryClient";

const nftContractAddress = "0x9aa4bc352f2f285640065c2e6e57f0f0ca33e4ad"
// Function to mint a new NFT
export async function mintNFT(to: Address, uri: string) {
  console.log("Minting a new NFT...");

  // Create a wallet client for sending transactions
  const walletClient = createWalletClient({
    account: adminAccount,  // The admin account that owns the contract
    chain: sepolia,  // Using the Sepolia test network
    transport: http(process.env.RPC_PROVIDER_URL),  // HTTP provider for the blockchain RPC
  });

  // Create a public client for reading the blockchain
  const publicClient = createPublicClient({
    chain: sepolia,  // Using the Sepolia test network
    transport: http(process.env.RPC_PROVIDER_URL),
  });

  // Simulate the contract interaction to mint the NFT
  const { request } = await publicClient.simulateContract({
    address: nftContractAddress,  // The deployed contract address
    functionName: "mint",  // The mint function in your smart contract
    args: [to, uri],  // Arguments: recipient address and metadata URI
    abi: contractABI,  // ABI of the contract
  });

  // Send the transaction using the wallet client
  const hash = await walletClient.writeContract(request);
  console.log(`Minted NFT successfully with transaction hash: ${hash}`);

  // Wait for the transaction to be confirmed
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  // Extract the tokenId from the logs (topic[3] contains the token ID in an ERC721 Transfer event)
  const tokenId = Number(receipt.logs[0].topics[3]).toString();
  console.log(`Minted NFT with tokenId: ${tokenId}`);

  return tokenId;  // Return the minted token ID
}
