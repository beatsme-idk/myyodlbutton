
import { useState, useEffect } from 'react';
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
  const { 
    walletAddress, 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect, 
    isAuthenticated, 
    signInWithEthereum, 
    signOut 
  } = useWeb3();
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [balance, setBalance] = useState<{ formatted: string; symbol: string } | null>(null);

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Handle successful connections through useEffect
  useEffect(() => {
    if (isConnected && walletAddress) {
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      });
    }
  }, [isConnected, walletAddress, toast]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
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

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (isConnected && walletAddress) {
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
            {formatAddress(walletAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {balance && (
            <DropdownMenuItem disabled>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Balance: {balance.formatted.slice(0, 6)} {balance.symbol}</span>
            </DropdownMenuItem>
          )}
          
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
          
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant="outline" 
      disabled={isConnecting}
      onClick={handleConnect}
      className="flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnect;
