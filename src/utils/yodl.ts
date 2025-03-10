
import { YodlPaymentConfig } from "@/types";

export const generateYodlPaymentLink = (address: string, config?: YodlPaymentConfig): string => {
  if (!config || !config.enabled) {
    return "";
  }

  // Base URL - format is https://yodl.me/{address}
  let url = `https://yodl.me/${address}`;
  
  // Build query parameters
  const params = new URLSearchParams();
  
  if (config.tokens) {
    params.append("tokens", config.tokens);
  }
  
  if (config.chains) {
    params.append("chains", config.chains);
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
  
  // Add redirect URL parameter - make sure it's not double-encoded
  if (config.redirectUrl) {
    // First check if the redirectUrl is already encoded
    let redirectUrl = config.redirectUrl;
    
    // If it looks encoded (contains % followed by hex digits), try to decode it once
    if (/%[0-9A-F]{2}/i.test(redirectUrl)) {
      try {
        redirectUrl = decodeURIComponent(redirectUrl);
      } catch (e) {
        console.error("Error decoding redirectUrl:", e);
        // If decoding fails, use the original value
      }
    }
    
    params.append("redirectUrl", redirectUrl);
  }
  
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
      enabled: true,
      tokens: "USDC,USDT",
      chains: "base,oeth",
      currency: "USD",
      webhooks: ["https://tgbot.yodl.me/v1/tx?id=demo"]
    };
  }
  
  // For other ENS names, return null to indicate no Yodl config found
  return null;
};
