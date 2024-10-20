// app/Web3Providers.tsx
'use client';
import '@rainbow-me/rainbowkit/styles.css';
import {
  DynamicContextProvider,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
  createConfig,
  WagmiProvider,
  useAccount
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { PropsWithChildren } from 'react';
import { iliad } from '@story-protocol/core-sdk';

// Initialize the QueryClient
const queryClient = new QueryClient();

// Configure Wagmi
const config = createConfig({
  chains: [iliad],
  multiInjectedProviderDiscovery: false,
  transports: {
    [iliad.id]: http(),
  },
});

const evmNetworks = [{
  blockExplorerUrls: ["https://testnet.storyscan.xyz"],
  chainId: 1513,
  name: "Story Iliad",
  networkId: 1513,
  iconUrls: ["https://www.storyprotocol.xyz"],
  nativeCurrency: {
    decimals: 18,
    name: "Story Iliad IP",
    symbol: "IP"
  },
  rpcUrls: ["https://testnet.storyrpc.io"],
  vanityName: "Story Iliad",
}]

export default function Web3Providers({ children }: PropsWithChildren) {
  const environmentId = process.env.NEXT_PUBLIC_ENVIRONMENT_ID || 'default-environment-id';
  return (
    <DynamicContextProvider
      settings={{
        environmentId: environmentId,
        overrides: { evmNetworks },
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <DynamicWidget />
            <AccountInfo />
            {children} {/* Render children here */}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

function AccountInfo() {
  const { address, isConnected, chain } = useAccount();

  return (
    <div>
      <p>
        wagmi connected: {isConnected ? 'true' : 'false'}
      </p>
      <p>wagmi address: {address}</p>
      <p>wagmi network: {chain?.id}</p>
    </div>
  );
};
