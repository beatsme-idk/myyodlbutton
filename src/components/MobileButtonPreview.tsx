
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
      className={`fixed bottom-6 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 shadow-xl w-auto max-w-[90%] mx-auto">
        <div className="text-xs text-slate-400 mb-1 text-center">Live Preview</div>
        <div className="flex items-center justify-center p-3">
          <button
            className="inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
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
