import { UserConfig, ButtonStyle, ThankYouPageStyle, SocialPreviewStyle } from "@/types";

export const validateButtonStyle = (style: ButtonStyle): boolean => {
  if (!style) return false;
  
  return (
    typeof style.backgroundColor === "string" &&
    typeof style.textColor === "string" &&
    typeof style.borderRadius === "string" &&
    typeof style.fontSize === "string" &&
    typeof style.padding === "string" &&
    typeof style.buttonText === "string"
  );
};

export const validateThankYouPageStyle = (style: ThankYouPageStyle): boolean => {
  if (!style) return false;
  
  return (
    typeof style.backgroundColor === "string" &&
    typeof style.textColor === "string" &&
    typeof style.message === "string" &&
    typeof style.showConfetti === "boolean"
  );
};

export const validateSocialPreviewStyle = (style: SocialPreviewStyle): boolean => {
  if (!style) return false;
  
  return (
    typeof style.title === "string" &&
    typeof style.description === "string" &&
    typeof style.imageUrl === "string" &&
    typeof style.useCustomImage === "boolean"
  );
};

export const validateUserConfig = (config: UserConfig): boolean => {
  if (!config) return false;
  
  return (
    typeof config.ensNameOrAddress === "string" &&
    config.ensNameOrAddress.trim() !== "" &&
    typeof config.slug === "string" &&
    config.slug.trim() !== "" &&
    validateButtonStyle(config.buttonStyle) &&
    validateThankYouPageStyle(config.thankYouPage) &&
    validateSocialPreviewStyle(config.socialPreview)
  );
};

export const validateHexColor = (color: string): boolean => {
  // If it's a gradient, consider it valid
  if (color.includes("linear-gradient")) {
    return true;
  }
  // Regular hex color validation
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};

export const isValidEnsOrAddress = (value: string): boolean => {
  if (!value) return false;
  
  // Check if it's an Ethereum address (more lenient check)
  const isEthAddress = /^0x[a-fA-F0-9]{1,}$/i.test(value);
  
  // Check if it's an ENS name (more lenient check)
  const isEns = value.toLowerCase().endsWith('.eth');
  
  return isEthAddress || isEns;
};
