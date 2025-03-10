
export interface ButtonStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontSize: string;
  padding: string;
  buttonText: string;
  buttonTextType?: "tip" | "donate" | "pay" | "custom";
  iconType?: "coffee" | "heart" | "dollar-sign" | "hand-coins" | "custom" | "none";
  tipText?: string;
  donateText?: string;
  payText?: string;
}

export interface ThankYouPageStyle {
  backgroundColor: string;
  textColor: string;
  message: string;
  showConfetti: boolean;
  accentColor?: string;
  headerText?: string;
  showTransactionDetails?: boolean;
  showReturnHomeButton?: boolean;
  showShareButton?: boolean;
  animation?: "bounce" | "pulse" | "wave" | "none";
}

export interface SocialPreviewStyle {
  title: string;
  description: string;
  imageUrl: string;
  useCustomImage: boolean;
}

export interface YodlPaymentConfig {
  enabled: boolean;
  tokens?: string;
  chains?: string;
  currency?: string;
  amount?: string;
  memo?: string;
  webhooks?: string[];
  redirectUrl?: string;
}

export interface UserConfig {
  ensNameOrAddress: string;
  buttonStyle: ButtonStyle;
  thankYouPage: ThankYouPageStyle;
  socialPreview: SocialPreviewStyle;
  slug: string;
  yodlConfig?: YodlPaymentConfig;
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
    accentColor?: string;
    headerText?: string;
    showTransactionDetails?: boolean;
    showReturnHomeButton?: boolean;
    showShareButton?: boolean;
    animation?: "bounce" | "pulse" | "wave" | "none";
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
