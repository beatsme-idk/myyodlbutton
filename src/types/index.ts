
export interface ButtonStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontSize: string;
  padding: string;
  buttonText: string;
  icon?: string;  // Added icon property
}

export interface ThankYouPageStyle {
  backgroundColor: string;
  textColor: string;
  message: string;
  showConfetti: boolean;
  socialLinks?: SocialLinks;
  customLink?: CustomLink;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
}

export interface CustomLink {
  text: string;
  url: string;
}

export interface SocialPreviewStyle {
  title: string;
  description: string;
  imageUrl: string;
  useCustomImage: boolean;
}

export interface YodlPaymentConfig {
  tokens: string[];
  chains: string[];
  currency: string;
  amount: string;
  memo?: string;
  redirectUrl?: string;
}

export interface UserConfig {
  ensNameOrAddress: string;
  buttonStyle: ButtonStyle;
  thankYouPage: ThankYouPageStyle;
  socialPreview: SocialPreviewStyle;
  slug: string;
  yodlConfig: YodlPaymentConfig;
}

export interface PreviewProps {
  preview: {
    buttonStyle: ButtonStyle;
    slug: string;
    ensNameOrAddress: string;
    socialPreview?: SocialPreviewStyle;
    yodlConfig?: YodlPaymentConfig;
  };
}

export interface ThankYouProps {
  thankYou: {
    message: string;
    showConfetti: boolean;
    backgroundColor: string;
    textColor: string;
    socialLinks?: SocialLinks;
    customLink?: CustomLink;
  };
}

export interface Payment {
  id: string;
  date: Date;
  amount: string;
  currency: string;
  sender: string;
  status: "completed" | "pending" | "failed";
  transactionHash?: string;
  token: string;
  chain: string;
  memo?: string;
}

// Yodl specific types
export enum ChainPrefix {
  ETH = 'eth',
  ARB = 'arb1',
  BASE = 'base',
  POL = 'pol',
  OETH = 'oeth'
}

export interface PaymentPreferences {
  ensName?: string;
  address: string;
  preferredCurrency: string;
  chainPreferences: Record<string, { isEnabled: boolean }>;
}
