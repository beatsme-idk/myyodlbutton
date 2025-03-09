
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
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};

export const isValidEnsOrAddress = (ensNameOrAddress: string): boolean => {
  // Basic validation for Ethereum address
  const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(ensNameOrAddress);
  
  // Updated validation for ENS name with subdomain support
  const isEns = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+eth$/.test(ensNameOrAddress);
  
  return isEthAddress || isEns;
};
