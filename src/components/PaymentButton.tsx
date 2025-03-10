import { ButtonStyle, YodlPaymentConfig } from "@/types";
import { useNavigate } from "react-router-dom";
import { Coffee, ArrowRight, ExternalLink, DollarSign, Heart, HandCoins } from "lucide-react";
import { generateYodlPaymentLink } from "@/utils/yodl";
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
    // Always use Yodl payment if config exists
    if (yodlConfig && yodlConfig.enabled) {
      // Create a copy of the yodlConfig to avoid modifying the original
      const yodlConfigWithRedirect = { ...yodlConfig };
      
      // Set the redirect URL if it's not already set
      if (!yodlConfigWithRedirect.redirectUrl) {
        // Use the thank you page URL for this specific user's slug
        // Use un-encoded URL - the generateYodlPaymentLink function will handle encoding
        yodlConfigWithRedirect.redirectUrl = `${window.location.origin}/thank-you/${slug}`;
      }
      
      const yodlLink = generateYodlPaymentLink(ensNameOrAddress, yodlConfigWithRedirect);
      if (yodlLink) {
        window.open(yodlLink, "_blank");
        toast({
          title: "Opening Yodl Payment",
          description: "You'll be redirected to complete your payment with Yodl",
        });
        return;
      }
    }
    
    // Otherwise use the default behavior
    if (onClick) {
      onClick();
      return;
    }
    
    // In a real implementation, this would process the payment
    // For now, we'll just navigate to the thank you page
    navigate(`/thank-you/${slug}`);
  };
  
  // Get the appropriate icon based on button text type or explicit icon type
  const getButtonIcon = () => {
    // Use iconType if explicitly set
    if (style.iconType) {
      switch (style.iconType) {
        case "coffee":
          return <Coffee className="mr-2" size={20} />;
        case "heart":
          return <Heart className="mr-2" size={20} />;
        case "dollar-sign":
          return <DollarSign className="mr-2" size={20} />;
        case "hand-coins":
          return <HandCoins className="mr-2" size={20} />;
        case "none":
          return null;
        default:
          return <Coffee className="mr-2" size={20} />;
      }
    }
    
    // Fall back to buttonTextType if iconType not set
    switch (style.buttonTextType) {
      case "tip":
        return <HandCoins className="mr-2" size={20} />;
      case "donate":
        return <Heart className="mr-2" size={20} />;
      case "pay":
        return <DollarSign className="mr-2" size={20} />;
      case "custom":
      default:
        return <Coffee className="mr-2" size={20} />;
    }
  };
  
  const buttonIcon = getButtonIcon();
  
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
      {yodlConfig && yodlConfig.enabled ? (
        <>
          <div className="relative mr-2 w-5 h-5">
            <img 
              src="https://yodl.me/_next/static/media/new_logo.be0c2fdb.svg" 
              alt="Yodl"
              className="w-full h-full drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
            />
          </div>
          <span>{style.buttonText}</span>
        </>
      ) : (
        <>
          {buttonIcon}
          <span>{style.buttonText}</span>
        </>
      )}
      <ArrowRight className="ml-2 opacity-70" size={16} />
    </button>
  );
};

export default PaymentButton;
