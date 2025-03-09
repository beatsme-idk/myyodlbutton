
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createConfig, configureChains, WagmiConfig, useEnsName, useAccount } from 'wagmi';
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

// WalletConnect requires a valid project ID
// This is a public ID that can safely be in the codebase
const WALLET_CONNECT_PROJECT_ID = "c6bcb444ed883de790bc73184b7fe1bc";

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
        projectId: WALLET_CONNECT_PROJECT_ID,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// Create context
export const Web3Context = createContext<{
  walletAddress: string | undefined;
  ensNameOrAddress: string;
  isConnected: boolean;
}>({
  walletAddress: undefined,
  ensNameOrAddress: '',
  isConnected: false,
});

// Hook to use Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Web3 data provider component
const Web3DataProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [ensNameOrAddress, setEnsNameOrAddress] = useState<string>('');

  useEffect(() => {
    if (isConnected && address) {
      // Use ENS name if available, otherwise use address
      setEnsNameOrAddress(ensName || address);
    } else {
      setEnsNameOrAddress('');
    }
  }, [isConnected, address, ensName]);

  return (
    <Web3Context.Provider value={{ walletAddress: address, ensNameOrAddress, isConnected }}>
      {children}
    </Web3Context.Provider>
  );
};

type Web3ProviderProps = {
  children: ReactNode;
};

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <Web3DataProvider>{children}</Web3DataProvider>
    </WagmiConfig>
  );
};
