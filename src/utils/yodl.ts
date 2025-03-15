
import { YodlPaymentConfig } from "@/types";

export const generateYodlPaymentLink = (address: string, config?: YodlPaymentConfig): string => {
  if (!config) {
    return "";
  }

  // Base URL - format is https://yodl.me/{address}
  let url = `https://yodl.me/${address}`;
  
  // Build query parameters
  const params = new URLSearchParams();
  
  if (config.tokens && config.tokens.length > 0) {
    if (config.tokens.includes('all')) {
      // Don't specify tokens to allow all
    } else {
      params.append("tokens", config.tokens.join(','));
    }
  }
  
  if (config.chains && config.chains.length > 0) {
    if (config.chains.includes('all')) {
      // Don't specify chains to allow all
    } else {
      params.append("chains", config.chains.join(','));
    }
  }
  
  if (config.currency) {
    params.append("currency", config.currency);
  }
  
  if (config.amount) {
    params.append("amount", config.amount);
  }
  
  if (config.memo) {
    params.append("memo", config.memo);
  }
  
  // Convert params to string first
  const queryString = params.toString();
  const separator = queryString ? '?' : '';
  
  // Add redirect URL parameter directly at the end without encoding
  if (config.redirectUrl) {
    // We'll manually add the redirectUrl to avoid encoding
    return `${url}${separator}${queryString}${queryString ? '&' : '?'}redirectUrl=${config.redirectUrl}&buttonText=Return+to+Site`;
  }
  
  // Add button text for return
  if (queryString) {
    return `${url}?${queryString}&buttonText=Return+to+Site`;
  }
  
  return `${url}?buttonText=Return+to+Site`;
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
