
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Button } from "./ui/button";
import { LogOut, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
  });
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const connectWallet = async (connector: MetaMaskConnector | WalletConnectConnector | CoinbaseWalletConnector) => {
    try {
      setIsConnecting(true);
      await connect({ connector });
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Ensure all connectors are properly initialized
  const metaMaskConnector = connectors.find(c => c.id === 'metaMask') || new MetaMaskConnector();
  const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet') || 
    new CoinbaseWalletConnector({
      options: { appName: 'Buy Me A Coffee' }
    });
  const walletConnectConnector = connectors.find(c => c.id === 'walletConnect') || 
    new WalletConnectConnector({
      options: { projectId: 'buymeacoffee-web3-app' }
    });

  if (isConnected && address) {
    return (
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
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Connection error display
  if (error) {
    console.error("Wallet connection error:", error);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isConnecting || isLoading}>
          {isConnecting || isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Connect Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => connectWallet(metaMaskConnector as MetaMaskConnector)}
          className="cursor-pointer"
        >
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => connectWallet(coinbaseConnector as CoinbaseWalletConnector)}
          className="cursor-pointer"
        >
          Coinbase Wallet
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => connectWallet(walletConnectConnector as WalletConnectConnector)}
          className="cursor-pointer"
        >
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect;
