
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ReceiptIcon, ClockIcon, CalendarIcon, WalletIcon, ArrowDownIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Payment {
  id: string;
  date: Date;
  amount: string;
  currency: string;
  sender: string;
  status: "completed" | "pending" | "failed";
  transactionHash?: string;
  token: string;
  chain: string;
}

const mockPayments: Payment[] = [
  {
    id: "1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    amount: "5.00",
    currency: "USD",
    sender: "0x1234...5678",
    status: "completed",
    transactionHash: "0xabcd1234",
    token: "USDC",
    chain: "base"
  },
  {
    id: "2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    amount: "10.00",
    currency: "USD",
    sender: "vitalik.eth",
    status: "completed",
    transactionHash: "0xdef5678",
    token: "USDT",
    chain: "oeth"
  },
  {
    id: "3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    amount: "3.00",
    currency: "USD",
    sender: "0x9876...4321",
    status: "completed",
    transactionHash: "0xghi9012",
    token: "USDC",
    chain: "arb1"
  }
];

const getChainName = (chainId: string): string => {
  const chains: Record<string, string> = {
    "eth": "Ethereum",
    "base": "Base",
    "oeth": "Optimism",
    "gno": "Gnosis",
    "pol": "Polygon",
    "arb1": "Arbitrum"
  };
  return chains[chainId] || chainId;
};

const getChainExplorerUrl = (chainId: string, txHash: string): string => {
  const explorers: Record<string, string> = {
    "eth": "https://etherscan.io/tx/",
    "base": "https://basescan.org/tx/",
    "oeth": "https://optimistic.etherscan.io/tx/",
    "gno": "https://gnosisscan.io/tx/",
    "pol": "https://polygonscan.com/tx/",
    "arb1": "https://arbiscan.io/tx/"
  };
  const baseUrl = explorers[chainId] || "https://etherscan.io/tx/";
  return `${baseUrl}${txHash}`;
};

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    // In a real app, we would fetch payment history from an API
    // For now, we'll use mock data
    const loadPayments = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setPayments(mockPayments);
      } catch (error) {
        console.error("Error loading payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" className="bg-green-600">
          <CheckIcon className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-600/20 text-yellow-300 border-yellow-700">
          <ClockIcon className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="md" variant="gradient" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptIcon className="w-5 h-5 text-indigo-400" />
          Payment History
        </CardTitle>
        <CardDescription>
          Recent payments received through your payment button
        </CardDescription>
      </CardHeader>

      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No payment history found
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <div key={payment.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10 bg-indigo-950 border border-indigo-700/50">
                      <ArrowDownIcon className="h-5 w-5 text-green-400" />
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {payment.amount} {payment.currency} ({payment.token})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        From: {payment.sender}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <WalletIcon className="h-3 w-3 mr-1" /> 
                        {getChainName(payment.chain)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(payment.date, { addSuffix: true })}
                    </div>
                    {payment.transactionHash && (
                      <a 
                        href={getChainExplorerUrl(payment.chain, payment.transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-end mt-1"
                      >
                        View Transaction 
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
                {index < payments.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
