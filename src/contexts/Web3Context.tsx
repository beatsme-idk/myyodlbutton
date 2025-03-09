
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createConfig, configureChains, WagmiConfig, useEnsName, useAccount, useSignMessage } from 'wagmi';
import { mainnet, optimism, polygon, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { SiweMessage } from 'siwe';

// Polyfill Buffer for browser environment
// This resolves the "Buffer is not defined" error
import { Buffer } from 'buffer';
// Make Buffer available globally to fix dependency issues
window.Buffer = window.Buffer || Buffer;

// Set up wagmi config
const PROJECT_ID = "c6bcb444ed883de790bc73184b7fe1bc";

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

// Create context with additional connection management states and SIWE auth
export const Web3Context = createContext<{
  walletAddress: string | undefined;
  ensNameOrAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: Error | null;
  isAuthenticated: boolean;
  signInWithEthereum: () => Promise<boolean>;
  signOut: () => void;
}>({
  walletAddress: undefined,
  ensNameOrAddress: '',
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  isAuthenticated: false,
  signInWithEthereum: async () => false,
  signOut: () => {},
});

// Hook to use Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Web3 data provider component with improved state handling
const Web3DataProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { signMessageAsync } = useSignMessage();
  const [ensNameOrAddress, setEnsNameOrAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuthState = localStorage.getItem('siwe_auth');
    if (storedAuthState) {
      try {
        const authData = JSON.parse(storedAuthState);
        // Check if the auth is still valid and for the current address
        if (authData.address === address && authData.expiration > Date.now()) {
          setIsAuthenticated(true);
        } else {
          // Clear invalid auth data
          localStorage.removeItem('siwe_auth');
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
        localStorage.removeItem('siwe_auth');
      }
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      // Use ENS name if available, otherwise use address
      setEnsNameOrAddress(ensName || address);
      setConnectionError(null);
    } else {
      setEnsNameOrAddress('');
      setIsAuthenticated(false); // Reset authentication when disconnected
    }
  }, [isConnected, address, ensName]);

  // Sign in with Ethereum function
  const signInWithEthereum = useCallback(async () => {
    if (!address || !isConnected) {
      console.error('No wallet connected');
      setConnectionError(new Error('No wallet connected'));
      return false;
    }

    try {
      // Create SIWE message
      const domain = window.location.host;
      const origin = window.location.origin;
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const currentChainId = 1; // Default to Ethereum mainnet
      
      const message = new SiweMessage({
        domain,
        address,
        statement: 'Sign in with Ethereum to authenticate with Buy Me A Coffee.',
        uri: origin,
        version: '1',
        chainId: currentChainId,
        nonce,
        // Add ReCap capabilities for authorized actions
        resources: [
          'urn:recap:eyJhdHQiOnsiaHR0cHM6Ly9hcGkudHJpYnV0ZWUuY29tIjp7IiovdGlwcyI6W3sicGF0aCI6Ii9zZW5kIn1dfX19',
        ],
      });
      
      // Generate the message string
      const messageString = message.prepareMessage();
      
      // Request user signature
      const signature = await signMessageAsync({ message: messageString });
      
      // Store auth in localStorage (expires in 7 days)
      const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('siwe_auth', JSON.stringify({
        message: messageString,
        signature,
        address,
        expiration: expirationTime
      }));
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error during SIWE authentication:', error);
      setConnectionError(error instanceof Error ? error : new Error('Authentication failed'));
      return false;
    }
  }, [address, isConnected, signMessageAsync]);

  // Sign out function
  const signOut = useCallback(() => {
    localStorage.removeItem('siwe_auth');
    setIsAuthenticated(false);
  }, []);

  return (
    <Web3Context.Provider 
      value={{ 
        walletAddress: address, 
        ensNameOrAddress, 
        isConnected,
        isConnecting,
        connectionError,
        isAuthenticated,
        signInWithEthereum,
        signOut
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
  return (
    <WagmiConfig config={config}>
      <Web3DataProvider>{children}</Web3DataProvider>
    </WagmiConfig>
  );
};
