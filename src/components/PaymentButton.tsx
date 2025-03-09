import { ButtonStyle, YodlPaymentConfig } from "@/types";
import { useNavigate } from "react-router-dom";
import { Coffee, ArrowRight, ExternalLink } from "lucide-react";
import { generateYodlPaymentLink } from "@/utils/yodl";

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
  
  const handleClick = () => {
    // If Yodl is enabled, redirect to Yodl payment page
    if (yodlConfig?.enabled) {
      const yodlLink = generateYodlPaymentLink(ensNameOrAddress, yodlConfig);
      if (yodlLink) {
        window.open(yodlLink, "_blank");
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
  
  return (
    <button
      className={`inline-flex items-center justify-center transition-all-300 shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-1 ${className}`}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
        padding: style.padding,
      }}
      onClick={handleClick}
    >
      {yodlConfig?.enabled ? (
        <>
          <ExternalLink className="mr-2" size={20} />
          <span>{style.buttonText} with Yodl</span>
        </>
      ) : (
        <>
          <Coffee className="mr-2" size={20} />
          <span>{style.buttonText}</span>
        </>
      )}
      <ArrowRight className="ml-2 opacity-70" size={16} />
    </button>
  );
};

export default PaymentButton;
