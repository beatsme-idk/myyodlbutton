
import { ButtonStyle } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface MobileButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

const MobileButtonPreview = ({ buttonStyle }: MobileButtonPreviewProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;
  
  return (
    <div className="py-4 px-2 mt-1 mb-4 rounded-lg shadow-inner bg-background/80 border border-indigo-500/10 flex justify-center">
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
  );
};

export default MobileButtonPreview;
