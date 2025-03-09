
import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiweAuthButtonProps {
  className?: string;
}

const SiweAuthButton: React.FC<SiweAuthButtonProps> = ({ className }) => {
  const { isConnected, isAuthenticated, authenticateWithSiwe, logout } = useWeb3();
  const { toast } = useToast();

  const handleAuth = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first before authenticating",
        variant: "destructive"
      });
      return;
    }

    if (isAuthenticated) {
      logout();
    } else {
      await authenticateWithSiwe();
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Button
      variant={isAuthenticated ? "default" : "outline"}
      size="sm"
      onClick={handleAuth}
      className={className}
    >
      {isAuthenticated ? (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Verify with Ethereum
        </>
      )}
    </Button>
  );
};

export default SiweAuthButton;
