
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalTracker from "@/components/GoalTracker";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  ReceiptIcon, ClockIcon, CalendarIcon, WalletIcon, 
  ArrowDownIcon, CheckIcon, ExternalLinkIcon, 
  Hash, DollarSign, TrendingUp, InfoIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

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
  memo?: string;
}

// Extended mock payments with some additional data
const mockPayments: Payment[] = [
  {
    id: "1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    amount: "5.00",
    currency: "USD",
    sender: "0x1234...5678",
    status: "completed",
    transactionHash: "0xabcd1234efgh5678ijkl9101",
    token: "USDC",
    chain: "base",
    memo: "monthly_support_june"
  },
  {
    id: "2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    amount: "10.00",
    currency: "USD",
    sender: "vitalik.eth",
    status: "completed",
    transactionHash: "0xdef5678abcd1234efgh5678",
    token: "USDT",
    chain: "oeth",
    memo: "podcast_support"
  },
  {
    id: "3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    amount: "3.00",
    currency: "USD",
    sender: "0x9876...4321",
    status: "completed",
    transactionHash: "0xghi9012jkl3456mno7890",
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

// Calculate total amount received
const calculateTotalReceived = (payments: Payment[]): number => {
  return payments
    .filter(payment => payment.status === "completed")
    .reduce((total, payment) => total + parseFloat(payment.amount), 0);
};

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Goal tracking state
  const monthlyGoal = 100; // $100 monthly goal
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentMonthPayments = payments.filter(payment => {
    const paymentMonth = payment.date.toLocaleString('default', { month: 'long' });
    return paymentMonth === currentMonth && payment.status === "completed";
  });
  
  const monthlyTotal = calculateTotalReceived(currentMonthPayments);

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

  const viewTransactionDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="md" variant="gradient" />
      </div>
    );
  }

  const totalReceived = calculateTotalReceived(payments);

  return (
    <div className="space-y-6">
      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalTracker 
          title={`${currentMonth} Goal`}
          description="Monthly support goal tracking"
          currentAmount={monthlyTotal}
          targetAmount={monthlyGoal}
          currency="USD"
        />
        
        <Card className="bg-black/40 border-indigo-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-indigo-400" />
              Payment Overview
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-950/40 rounded-lg p-4 border border-indigo-500/20">
                <div className="text-sm text-slate-300">Total Received</div>
                <div className="text-2xl font-bold mt-1">${totalReceived.toFixed(2)}</div>
                <div className="text-xs text-indigo-300 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  All time
                </div>
              </div>
              
              <div className="bg-indigo-950/40 rounded-lg p-4 border border-indigo-500/20">
                <div className="text-sm text-slate-300">Transactions</div>
                <div className="text-2xl font-bold mt-1">{payments.length}</div>
                <div className="text-xs text-indigo-300 mt-1 flex items-center">
                  <ReceiptIcon className="w-3 h-3 mr-1" />
                  Total count
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="details">Transaction Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-1 h-auto text-indigo-400 hover:text-indigo-300 mt-1"
                            onClick={() => viewTransactionDetails(payment)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      {index < payments.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-400" />
                Transaction Details
              </CardTitle>
              <CardDescription>
                Detailed information about blockchain transactions
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!selectedPayment ? (
                <div className="text-center py-8 space-y-3">
                  <InfoIcon className="w-10 h-10 text-indigo-400 mx-auto" />
                  <p className="text-slate-300">
                    Select a transaction from the history tab to view its details
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-indigo-950/30 rounded-lg p-4 border border-indigo-500/20">
                    <h3 className="font-medium mb-4 flex items-center">
                      <Hash className="w-4 h-4 mr-2 text-indigo-400" />
                      Transaction Hash
                    </h3>
                    <div className="font-mono text-sm text-slate-300 break-all bg-black/30 p-3 rounded border border-slate-800">
                      {selectedPayment.transactionHash}
                    </div>
                    
                    {selectedPayment.transactionHash && (
                      <a 
                        href={getChainExplorerUrl(selectedPayment.chain, selectedPayment.transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-end mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        View on {getChainName(selectedPayment.chain)} Explorer 
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-950/30 rounded-lg p-4 border border-indigo-500/20">
                      <h3 className="font-medium mb-3">Transaction Details</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-400">Date:</dt>
                          <dd className="text-sm">{selectedPayment.date.toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-400">Amount:</dt>
                          <dd className="text-sm font-medium">
                            {selectedPayment.amount} {selectedPayment.currency}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-400">Token:</dt>
                          <dd className="text-sm">{selectedPayment.token}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-400">Network:</dt>
                          <dd className="text-sm">{getChainName(selectedPayment.chain)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-400">Status:</dt>
                          <dd className="text-sm">{getStatusBadge(selectedPayment.status)}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="bg-indigo-950/30 rounded-lg p-4 border border-indigo-500/20">
                      <h3 className="font-medium mb-3">Sender Information</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-slate-400">From:</dt>
                          <dd className="text-sm font-mono">{selectedPayment.sender}</dd>
                        </div>
                        {selectedPayment.memo && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-slate-400">Memo:</dt>
                            <dd className="text-sm">{selectedPayment.memo}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedPayment(null)}
                className="bg-indigo-950/30 border-indigo-500/30 hover:bg-indigo-900/50"
              >
                Clear
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentHistory;
