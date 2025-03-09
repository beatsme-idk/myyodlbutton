
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from "./ui/button";
import { LogOut, CreditCard, Wallet, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/contexts/Web3Context';

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isLoading: isWagmiLoading, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
  });
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { isAuthenticated, signInWithEthereum, signOut } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Effect to handle connection errors
  useEffect(() => {
    if (connectError && hasAttemptedConnect) {
      console.error("Wallet connection error:", connectError);
      toast({
        title: "Connection Failed",
        description: connectError.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
      reset();
    }
  }, [connectError, toast, hasAttemptedConnect, reset]);

  // Effect to handle successful connections
  useEffect(() => {
    if (isConnected && hasAttemptedConnect) {
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      });
      setIsConnecting(false);
      setHasAttemptedConnect(false);
    }
  }, [isConnected, hasAttemptedConnect, toast]);

  const connectWallet = async (connectorId: string) => {
    try {
      setIsConnecting(true);
      setHasAttemptedConnect(true);
      const connector = connectors.find(c => c.id === connectorId);
      
      if (!connector) {
        throw new Error(`Connector '${connectorId}' not found`);
      }
      
      console.log("Connecting with connector:", connector.id, connector);
      await connect({ connector });
      
      // Note: Success toast is handled by the useEffect above
    } catch (error) {
      console.error("Connection error caught in try/catch:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
      setHasAttemptedConnect(false);
    }
  };

  const handleAuthenticate = async () => {
    if (!isConnected) {
      toast({
        title: "Authentication Failed",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAuthenticating(true);
      const success = await signInWithEthereum();
      
      if (success) {
        toast({
          title: "Authentication Successful",
          description: "You have successfully authenticated with your wallet",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Failed to authenticate with your wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
  };

  // Debug connectors at component mount
  useEffect(() => {
    console.log("Available connectors:", connectors.map(c => ({ 
      id: c.id, 
      name: c.name,
      ready: c.ready,
      details: c
    })));
  }, [connectors]);

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 ${isAuthenticated ? 'border-green-500' : ''}`}
          >
            {isAuthenticated ? (
              <Shield className="h-4 w-4 text-green-500" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10H2M2 10V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V10M2 10L3.33333 5.2C3.58451 4.45045 4.29279 3.92221 5.1 3.9H18.9C19.7072 3.92221 20.4155 4.45045 20.6667 5.2L22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 15H9M15 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Balance: {balanceData?.formatted.slice(0, 6)} {balanceData?.symbol}</span>
          </DropdownMenuItem>
          
          {isAuthenticated ? (
            <DropdownMenuItem onClick={handleSignOut}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleAuthenticate} disabled={isAuthenticating}>
              <Shield className="mr-2 h-4 w-4" />
              <span>{isAuthenticating ? 'Authenticating...' : 'Authenticate'}</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isConnecting || isWagmiLoading}>
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting || isWagmiLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Connect Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {connectors.map((connector) => (
          <DropdownMenuItem
            key={connector.id}
            onClick={() => connectWallet(connector.id)}
            className="cursor-pointer"
            disabled={!connector.ready || isConnecting}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect;
