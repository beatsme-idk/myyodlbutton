
import { ButtonStyle } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, Heart, Star, Check } from "lucide-react";

interface MobileButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

const MobileButtonPreview = ({ buttonStyle }: MobileButtonPreviewProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;
  
  // Get the icon based on iconType
  const getButtonIcon = () => {
    if (!buttonStyle.iconType || buttonStyle.iconType === "none") return null;
    
    switch (buttonStyle.iconType) {
      case "arrow-right":
        return <ArrowRight className="mr-2" size={16} />;
      case "heart":
        return <Heart className="mr-2" size={16} />;
      case "star":
        return <Star className="mr-2" size={16} />;
      case "check":
        return <Check className="mr-2" size={16} />;
      default:
        return null;
    }
  };
  
  const buttonIcon = getButtonIcon();
  
  return (
    <div className="py-3 px-2 mt-1 mb-3 rounded-lg shadow-inner bg-background/80 border border-indigo-500/10 flex justify-center">
      <button
        className="inline-flex items-center justify-center shadow-sm"
        style={{
          background: buttonStyle.backgroundColor,
          color: buttonStyle.textColor,
          borderRadius: buttonStyle.borderRadius,
          fontSize: buttonStyle.fontSize,
          padding: buttonStyle.padding,
        }}
      >
        {buttonIcon}
        {buttonStyle.buttonText}
        <ArrowRight className="ml-2 opacity-70" size={12} />
      </button>
    </div>
  );
};

export default MobileButtonPreview;
