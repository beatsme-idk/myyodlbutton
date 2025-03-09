
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createConfig, configureChains, WagmiConfig, useEnsName, useAccount, useSignMessage } from 'wagmi';
import { mainnet, optimism, polygon, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { SiweMessage } from 'siwe';
import { useToast } from '@/hooks/use-toast';

// Set up wagmi config - use a valid and working project ID
const projectId = "c6bcb444ed883de790bc73184b7fe1bc";

// Reown Project ID for SIWE
const REOWN_PROJECT_ID = "ca70dcf9165c21ca431481f45879e239";

// Configure chains & providers with more robust error handling
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, polygon, base],
  [publicProvider()]
);

// Set up connectors with better error handling and configuration
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
      appName: 'Tributee',
      headlessMode: false,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId,
      showQrModal: true,
      metadata: {
        name: 'Tributee',
        description: 'Support content creators with crypto donations',
        url: window.location.origin,
        icons: [`${window.location.origin}/favicon.ico`]
      }
    },
  }),
];

// Create wagmi config with explicit timeout settings
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create context
export const Web3Context = createContext<{
  walletAddress: string | undefined;
  ensNameOrAddress: string;
  isConnected: boolean;
  isAuthenticated: boolean;
  authenticateWithSiwe: () => Promise<boolean>;
  logout: () => void;
}>({
  walletAddress: undefined,
  ensNameOrAddress: '',
  isConnected: false,
  isAuthenticated: false,
  authenticateWithSiwe: async () => false,
  logout: () => {},
});

// Hook to use Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Web3 data provider component
const Web3DataProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { signMessageAsync } = useSignMessage();
  const [ensNameOrAddress, setEnsNameOrAddress] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && address) {
      // Use ENS name if available, otherwise use address
      setEnsNameOrAddress(ensName || address);
    } else {
      setEnsNameOrAddress('');
      setIsAuthenticated(false);
    }
  }, [isConnected, address, ensName]);

  const authenticateWithSiwe = async (): Promise<boolean> => {
    if (!address) {
      toast({
        title: "Authentication Error",
        description: "Wallet not connected. Please connect your wallet first.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Create SIWE message with Reown project ID
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = 'Sign in with Ethereum to Tributee';
      
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        nonce: generateNonce(),
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        resources: [`https://api.reown.xyz/api/siwe/${REOWN_PROJECT_ID}`],
      });
      
      const signature = await signMessageAsync({ message: message.prepareMessage() });
      
      // Call Reown API to verify the signature
      const verifyResponse = await fetch(`https://api.reown.xyz/api/siwe/${REOWN_PROJECT_ID}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.prepareMessage(),
          signature,
          address,
        }),
      });
      
      if (verifyResponse.ok) {
        setIsAuthenticated(true);
        toast({
          title: "Authentication Successful",
          description: "You've successfully authenticated with your Ethereum wallet",
        });
        return true;
      } else {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You've been successfully signed out",
    });
  };

  return (
    <Web3Context.Provider value={{ 
      walletAddress: address, 
      ensNameOrAddress, 
      isConnected,
      isAuthenticated,
      authenticateWithSiwe,
      logout
    }}>
      {children}
    </Web3Context.Provider>
  );
};

// Generate a random nonce for SIWE
const generateNonce = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
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
