
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { WalletKit } from '@reown/walletkit';
import { SiweMessage } from 'siwe';

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
  connect: () => void;
  disconnect: () => void;
  walletKit: WalletKit | null;
}>({
  walletAddress: undefined,
  ensNameOrAddress: '',
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  isAuthenticated: false,
  signInWithEthereum: async () => false,
  signOut: () => {},
  connect: () => {},
  disconnect: () => {},
  walletKit: null,
});

// Hook to use Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Web3 data provider component with improved state handling
const Web3DataProvider = ({ children }: { children: ReactNode }) => {
  const [walletKit, setWalletKit] = useState<WalletKit | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [ensNameOrAddress, setEnsNameOrAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize walletKit
  useEffect(() => {
    const initWallet = async () => {
      try {
        // Project ID from your WalletConnect dashboard
        const projectId = "ca70dcf9165c21ca431481f45879e239";
        
        // Create WalletKit instance with correct options
        const kit = new WalletKit({
          name: "Buy Me A Coffee",
          description: "Support creators with crypto",
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon.ico`],
          projectId: projectId
        });
        
        setWalletKit(kit);
        
        // Set up event listeners
        kit.on("auth", (event) => {
          try {
            const validation = event.verified?.validation; // can be VALID, INVALID or UNKNOWN
            const isScam = event.verified?.isScam; // true if the domain is flagged as malicious
            
            // If the domain is flagged as malicious, warn the user
            if (isScam) {
              console.warn("WARNING: This domain is flagged as potentially malicious!");
            }
            
            if (validation) {
              switch (validation) {
                case "VALID":
                  // Proceed with the request
                  break;
                case "INVALID":
                  console.warn("WARNING: Domain verification failed - mismatched origin");
                  break;
                case "UNKNOWN":
                  console.warn("WARNING: Domain could not be verified");
                  break;
              }
            }
          } catch (error) {
            console.error("Error in auth event handler:", error);
          }
        });
        
        kit.on("connect", (event) => {
          try {
            if (event.address) {
              setWalletAddress(event.address);
              setEnsNameOrAddress(event.address);
              setIsConnected(true);
              setIsConnecting(false);
              setConnectionError(null);
            }
          } catch (error) {
            console.error("Error in connect event handler:", error);
          }
        });
        
        kit.on("disconnect", () => {
          setWalletAddress(undefined);
          setEnsNameOrAddress('');
          setIsConnected(false);
          setIsAuthenticated(false);
        });
        
        // Check if already connected
        if (kit.isConnected() && kit.getAddress()) {
          setWalletAddress(kit.getAddress());
          setEnsNameOrAddress(kit.getAddress() || '');
          setIsConnected(true);
        }
        
      } catch (error) {
        console.error("Failed to initialize WalletKit:", error);
        setConnectionError(error instanceof Error ? error : new Error('Failed to initialize wallet connection'));
      }
    };
    
    initWallet();
    
    return () => {
      // Clean up any listeners when component unmounts
      if (walletKit) {
        walletKit.removeAllListeners();
      }
    };
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuthState = localStorage.getItem('siwe_auth');
    if (storedAuthState) {
      try {
        const authData = JSON.parse(storedAuthState);
        // Check if the auth is still valid and for the current address
        if (authData.address === walletAddress && authData.expiration > Date.now()) {
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
  }, [walletAddress]);

  // Connect wallet function
  const connect = useCallback(async () => {
    if (!walletKit) {
      console.error("WalletKit not initialized");
      return;
    }
    
    try {
      setIsConnecting(true);
      await walletKit.connect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setConnectionError(error instanceof Error ? error : new Error('Failed to connect wallet'));
      setIsConnecting(false);
    }
  }, [walletKit]);

  // Disconnect wallet function
  const disconnect = useCallback(async () => {
    if (!walletKit) return;
    
    try {
      await walletKit.disconnect();
      setIsAuthenticated(false);
      localStorage.removeItem('siwe_auth');
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [walletKit]);

  // Sign in with Ethereum function
  const signInWithEthereum = useCallback(async () => {
    if (!walletAddress || !isConnected || !walletKit) {
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
        address: walletAddress,
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
      const signature = await walletKit.signMessage(messageString);
      
      // Store auth in localStorage (expires in 7 days)
      const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('siwe_auth', JSON.stringify({
        message: messageString,
        signature,
        address: walletAddress,
        expiration: expirationTime
      }));
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error during SIWE authentication:', error);
      setConnectionError(error instanceof Error ? error : new Error('Authentication failed'));
      return false;
    }
  }, [walletAddress, isConnected, walletKit]);

  // Sign out function
  const signOut = useCallback(() => {
    localStorage.removeItem('siwe_auth');
    setIsAuthenticated(false);
  }, []);

  return (
    <Web3Context.Provider 
      value={{ 
        walletAddress, 
        ensNameOrAddress, 
        isConnected,
        isConnecting,
        connectionError,
        isAuthenticated,
        signInWithEthereum,
        signOut,
        connect,
        disconnect,
        walletKit
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
    <Web3DataProvider>{children}</Web3DataProvider>
  );
};
