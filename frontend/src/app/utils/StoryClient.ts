'use client'; 
import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";


const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
export const adminAccount: Account = privateKeyToAccount(privateKey);

export const config: StoryConfig = {
  transport: http(process.env.RPC_PROVIDER_URL),
  account: adminAccount, // the account object from above
  chainId: "iliad",
};
export const adminClient = StoryClient.newClient(config);