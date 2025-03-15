
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
    params.append("tokens", Array.isArray(config.tokens) ? config.tokens.join(',') : config.tokens);
  }
  
  if (config.chains && config.chains.length > 0) {
    // Map friendly chain names to their prefixes
    const chainMapping: Record<string, string> = {
      'Ethereum': 'eth',
      'mainnet': 'eth',
      'Arbitrum': 'arb1',
      'arbitrum': 'arb1',
      'Base': 'base',
      'base': 'base',
      'Polygon': 'pol',
      'polygon': 'pol',
      'Optimism': 'oeth',
      'optimism': 'oeth',
      'oeth': 'oeth'
    };
    
    const chainPrefixes = Array.isArray(config.chains) 
      ? config.chains.map(chain => chainMapping[chain] || chain).filter(Boolean)
      : [config.chains];
      
    if (chainPrefixes.length > 0) {
      params.append("chains", chainPrefixes.join(','));
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
  
  // Add redirect URL parameter
  if (config.redirectUrl) {
    params.append("redirectUrl", config.redirectUrl);
  }
  
  // Add button text for return
  params.append("buttonText", "Return to Site");
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
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
      tokens: ["USDC", "USDT", "ETH"],
      chains: ["mainnet", "base", "optimism"],
      currency: "USD",
      amount: "",
      memo: "Thanks for supporting my work!",
      redirectUrl: ""
    };
  }
  
  // For other ENS names, return null to indicate no Yodl config found
  return null;
};
