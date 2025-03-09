
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Button } from "./ui/button";
import { Wallet, LogOut, CreditCard } from 'lucide-react';
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
  const { connect } = useConnect();
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

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Connect Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => connectWallet(new MetaMaskConnector())}
          className="cursor-pointer"
        >
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => connectWallet(new CoinbaseWalletConnector({
            options: { appName: 'Buy Me A Coffee' }
          }))}
          className="cursor-pointer"
        >
          Coinbase Wallet
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => connectWallet(new WalletConnectConnector({
            options: { projectId: 'buymeacoffee-web3-app' }
          }))}
          className="cursor-pointer"
        >
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnect;
