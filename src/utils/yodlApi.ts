
import { Payment } from "@/types";

// Fetch payment details from the Yodl API
export const fetchPaymentDetails = async (txHash: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://tx.yodl.me/api/v1/payments/${txHash}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw error;
  }
};

// Convert Yodl API payment data to our internal Payment type
export const mapYodlPaymentToPayment = (paymentData: any): Payment => {
  return {
    id: paymentData.txHash,
    date: new Date(paymentData.blockTimestamp),
    amount: paymentData.invoiceAmount || paymentData.tokenOutAmountGross,
    currency: paymentData.invoiceCurrency || 'USD',
    sender: paymentData.senderEnsPrimaryName || paymentData.senderAddress,
    status: "completed",
    transactionHash: paymentData.txHash,
    token: paymentData.tokenOutSymbol,
    chain: getChainIdCode(paymentData.chainId),
    memo: ""
  };
};

// Get chain code from chain ID
const getChainIdCode = (chainId: number): string => {
  const chainMap: Record<number, string> = {
    1: "eth",
    10: "oeth",
    8453: "base",
    100: "gno",
    137: "pol", 
    42161: "arb1"
  };
  
  return chainMap[chainId] || "eth";
};

// Fetch user's payment history (in a real app, this would query a backend)
// This is a placeholder that simulates getting transaction hashes from your backend
export const fetchUserPaymentHistory = async (address: string): Promise<Payment[]> => {
  // In a real implementation, you would get these txHashes from your backend
  // For demo purposes, we'll use some hardcoded transaction hashes
  // Your backend would track these for your users
  const mockTxHashes = [
    "0x123c86bcf2a0aeadd269f30719a6ce7eef515a1a36600751a42ca77d42c802bc"
  ];
  
  try {
    // Fetch details for each transaction
    const paymentPromises = mockTxHashes.map(async (txHash) => {
      try {
        const paymentData = await fetchPaymentDetails(txHash);
        return mapYodlPaymentToPayment(paymentData);
      } catch (error) {
        console.error(`Error fetching details for tx ${txHash}:`, error);
        return null;
      }
    });
    
    const payments = await Promise.all(paymentPromises);
    return payments.filter((payment): payment is Payment => payment !== null);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};
