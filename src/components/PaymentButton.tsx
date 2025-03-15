
import { ButtonStyle, YodlPaymentConfig } from "@/types";
import { useNavigate } from "react-router-dom";
import { Coffee, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentButtonProps {
  style: ButtonStyle;
  ensNameOrAddress: string;
  slug: string;
  className?: string;
  onClick?: () => void;
  yodlConfig?: YodlPaymentConfig;
}

const PaymentButton = ({
  style,
  ensNameOrAddress,
  slug,
  className = "",
  onClick,
  yodlConfig
}: PaymentButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleClick = () => {
    // Generate Yodl payment link
    const paymentLink = generateYodlPaymentLink(ensNameOrAddress, yodlConfig);
    
    if (paymentLink) {
      window.open(paymentLink, "_blank");
      toast({
        title: "Opening Yodl Payment",
        description: "You'll be redirected to complete your payment with Yodl",
      });
      return;
    }
    
    // Fallback - in case the link generation fails
    if (onClick) {
      onClick();
      return;
    }
    
    // Last resort fallback
    navigate(`/thank-you/${slug}`);
  };
  
  const generateYodlPaymentLink = (address: string, config?: YodlPaymentConfig): string => {
    if (!config) {
      return "";
    }

    // Base URL - format is https://yodl.me/{address}
    let url = `https://yodl.me/${address}`;
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (config.tokens && config.tokens.length > 0) {
      params.append("tokens", config.tokens.join(','));
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
      
      const chainPrefixes = config.chains
        .map(chain => chainMapping[chain] || chain)
        .filter(Boolean);
        
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
    } else {
      // Default redirect to thank you page
      params.append("redirectUrl", `${window.location.origin}/thank-you/${slug}`);
    }
    
    // Add button text
    params.append("buttonText", "Return to Site");
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return url;
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center transition-all-300 shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-1 ${className}`}
      style={{
        background: style.backgroundColor,
        color: style.textColor,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
        padding: style.padding,
      }}
      onClick={handleClick}
    >
      <div className="relative mr-2 w-5 h-5">
        <img 
          src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
          alt="Yodl"
          className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
        />
      </div>
      <span>{style.buttonText}</span>
      <ArrowRight className="ml-2 opacity-70" size={16} />
    </button>
  );
};

export default PaymentButton;
