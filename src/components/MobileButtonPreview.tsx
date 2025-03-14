
import { ButtonStyle } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface MobileButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

const MobileButtonPreview = ({ buttonStyle }: MobileButtonPreviewProps) => {
  // Always return null - we're removing this component as requested
  return null;
};

export default MobileButtonPreview;
