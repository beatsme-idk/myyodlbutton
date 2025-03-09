
export interface ButtonStyle {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontSize: string;
  padding: string;
  buttonText: string;
}

export interface ThankYouPageStyle {
  backgroundColor: string;
  textColor: string;
  message: string;
  showConfetti: boolean;
}

export interface UserConfig {
  ensNameOrAddress: string;
  buttonStyle: ButtonStyle;
  thankYouPage: ThankYouPageStyle;
  slug: string;
}

export interface PreviewProps {
  preview: {
    buttonStyle: ButtonStyle;
    slug: string;
    ensNameOrAddress: string;
  };
}

export interface ThankYouProps {
  thankYou: {
    message: string;
    showConfetti: boolean;
    backgroundColor: string;
    textColor: string;
  };
}
