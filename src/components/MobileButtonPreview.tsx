
import { ButtonStyle } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface MobileButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

const MobileButtonPreview = ({ buttonStyle }: MobileButtonPreviewProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  // Show the preview after a small delay to ensure smooth animation
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div 
      className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 rounded-xl p-4 shadow-xl w-11/12 max-w-md">
        <div className="text-xs text-slate-400 mb-2 text-center">Live Preview</div>
        <div className="flex items-center justify-center p-4">
          <button
            className="inline-flex items-center justify-center shadow-lg"
            style={{
              background: buttonStyle.backgroundColor,
              color: buttonStyle.textColor,
              borderRadius: buttonStyle.borderRadius,
              fontSize: buttonStyle.fontSize,
              padding: buttonStyle.padding,
            }}
          >
            {buttonStyle.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileButtonPreview;
