import { YodlPaymentConfig } from "@/types";

// Define available tokens
export const AVAILABLE_TOKENS = [
  { id: "eth", name: "ETH" },
  { id: "usdc", name: "USDC" },
  { id: "usdt", name: "USDT" },
  { id: "dai", name: "DAI" },
  { id: "usdm", name: "USDM" },
  { id: "usdglo", name: "USDGLO" }
];

// Define available chains
export const AVAILABLE_CHAINS = [
  { id: "ethereum", name: "Ethereum" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "base", name: "Base" },
  { id: "optimism", name: "Optimism" },
  { id: "polygon", name: "Polygon" }
];

export const generateYodlPaymentLink = (address: string, config?: YodlPaymentConfig): string => {
  if (!config) {
    return "";
  }

  // Base URL - format is https://yodl.me/{address}
  let url = `https://yodl.me/${address}`;
  
  // Build query parameters array to avoid URLSearchParams encoding
  const queryParams: string[] = [];
  
  // Only add tokens if not "all"
  if (config.tokens && config.tokens.length > 0 && !config.tokens.includes('all')) {
    queryParams.push(`tokens=${config.tokens.join(',')}`);
  }
  
  // Only add chains if not "all"
  if (config.chains && config.chains.length > 0 && !config.chains.includes('all')) {
    queryParams.push(`chains=${config.chains.join(',')}`);
  }
  
  if (config.currency) {
    queryParams.push(`currency=${config.currency}`);
  }
  
  if (config.amount) {
    queryParams.push(`amount=${config.amount}`);
  }
  
  if (config.memo) {
    queryParams.push(`memo=${config.memo}`);
  }
  
  // Add button text for return
  queryParams.push("buttonText=Return+to+Site");
  
  // Build the URL with query parameters
  let finalUrl = url;
  
  if (queryParams.length > 0) {
    finalUrl += `?${queryParams.join('&')}`;
  }
  
  // Add redirect URL parameter directly at the end without encoding
  if (config.redirectUrl) {
    const separator = queryParams.length > 0 ? '&' : '?';
    finalUrl += `${separator}redirectUrl=${config.redirectUrl}`;
  }
  
  return finalUrl;
};

// Helper function to parse ENS text records for Yodl configuration
export const parseYodlConfigFromENS = async (ensName: string): Promise<YodlPaymentConfig | null> => {
  // In a real implementation, this would fetch the ENS text record for 'me.yodl'
  // For now, we'll return a simulated result
  
  // This is a placeholder. In production, you would:
  // 1. Use ethers.js or similar to query the ENS resolver
  // 2. Get the text record for 'me.yodl'
  // 3. Parse the JSON content
  
  // For demo purposes, we'll just simulate a response for 'vitalik.eth'
  if (ensName === 'vitalik.eth') {
    return {
      tokens: ["all"],
      chains: ["all"],
      currency: "USD",
      amount: "",
      memo: "",
      redirectUrl: ""
    };
  }
  
  // For other ENS names, return null to indicate no Yodl config found
  return null;
};
