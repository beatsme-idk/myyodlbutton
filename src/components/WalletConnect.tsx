
import { useState, useEffect, useCallback } from 'react';
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
import SiweAuthButton from './SiweAuthButton';

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isLoading, status } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
  });
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const { isAuthenticated, authenticateWithSiwe, logout } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Error handling useEffect
  useEffect(() => {
    if (connectError) {
      console.error("Connection error:", connectError);
      toast({
        title: "Connection Failed",
        description: connectError?.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [connectError, toast]);

  // Monitor connection state
  useEffect(() => {
    console.log("Connection status:", status);
    if (status === 'success' && isConnected) {
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      });
      setIsConnecting(false);
    }
  }, [status, isConnected, toast]);

  // Memoize the connect wallet function to avoid recreation on every render
  const connectWallet = useCallback(async (connectorId: string) => {
    try {
      setIsConnecting(true);
      const connector = connectors.find(c => c.id === connectorId);
      
      if (!connector) {
        throw new Error(`Connector '${connectorId}' not found`);
      }
      
      console.log("Connecting with connector:", connector.id);
      
      // Add a timeout to prevent UI hanging if connection stalls
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timed out. Please try again.")), 30000);
      });
      
      // Race the connect promise against the timeout
      await Promise.race([
        connect({ connector }),
        timeoutPromise
      ]);
      
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [connect, connectors, toast]);

  // Debug connectors
  useEffect(() => {
    console.log("Available connectors:", connectors.map(c => ({ id: c.id, name: c.name })));
  }, [connectors]);
  
  if (connectError) {
    console.error("Wallet connection error:", connectError);
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <SiweAuthButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10H2M2 10V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V10M2 10L3.33333 5.2C3.58451 4.45045 4.29279 3.92221 5.1 3.9H18.9C19.7072 3.92221 20.4155 4.45045 20.6667 5.2L22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 15H9M15 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              <DropdownMenuItem onClick={logout}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Sign Out (SIWE)</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => authenticateWithSiwe()}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Verify with Ethereum</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isConnecting || isLoading}>
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting || isLoading ? "Connecting..." : "Connect Wallet"}
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
            disabled={!connector.ready}
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
