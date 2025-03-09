
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createConfig, configureChains, WagmiConfig, useEnsName, useAccount } from 'wagmi';
import { mainnet, optimism, polygon, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

// Polyfill Buffer for browser environment
// This resolves the "Buffer is not defined" error
import { Buffer } from 'buffer';
// Make Buffer available globally to fix dependency issues
window.Buffer = window.Buffer || Buffer;

// Set up wagmi config
const PROJECT_ID = "c6bcb444ed883de790bc73184b7fe1bc";

// Initialize WalletConnect core
const core = new Core({
  projectId: PROJECT_ID
});

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, polygon, base],
  [publicProvider()]
);

// Set up connectors with better error handling
const connectors = [
  new MetaMaskConnector({ 
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Buy Me A Coffee',
      headlessMode: false,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: 'Buy Me A Coffee',
        description: 'Support creators with crypto',
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.ico`]
      }
    },
  }),
];

// Create wagmi config with better connection management
const config = createConfig({
  autoConnect: false, // Changed to false to give more control
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create context with additional connection management states
export const Web3Context = createContext<{
  walletAddress: string | undefined;
  ensNameOrAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: Error | null;
}>({
  walletAddress: undefined,
  ensNameOrAddress: '',
  isConnected: false,
  isConnecting: false,
  connectionError: null
});

// Hook to use Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Web3 data provider component with improved state handling
const Web3DataProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [ensNameOrAddress, setEnsNameOrAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      // Use ENS name if available, otherwise use address
      setEnsNameOrAddress(ensName || address);
      setConnectionError(null);
    } else {
      setEnsNameOrAddress('');
    }
  }, [isConnected, address, ensName]);

  return (
    <Web3Context.Provider 
      value={{ 
        walletAddress: address, 
        ensNameOrAddress, 
        isConnected,
        isConnecting,
        connectionError 
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

type Web3ProviderProps = {
  children: ReactNode;
};

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // Initialize WalletKit with our WalletConnect core instance
  const walletKit = new WalletKit({
    projectId: PROJECT_ID,
    metadata: {
      name: 'Buy Me A Coffee',
      description: 'Support creators with crypto',
      url: window.location.origin,
      icons: [`${window.location.origin}/favicon.ico`]
    }
  });

  return (
    <WagmiConfig config={config}>
      <Web3DataProvider>{children}</Web3DataProvider>
    </WagmiConfig>
  );
};
