
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createConfig, configureChains, WagmiConfig } from 'wagmi';
import { mainnet, optimism, polygon, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, polygon, base],
  [publicProvider()]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Buy Me A Coffee',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'buymeacoffee-web3-app',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

type Web3ProviderProps = {
  children: ReactNode;
};

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
