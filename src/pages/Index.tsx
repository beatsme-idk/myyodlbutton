import { useState, useEffect } from "react";
import { UserConfig } from "@/types";
import ConfigurationForm from "@/components/ConfigurationForm";
import PreviewCard from "@/components/PreviewCard";
import Layout from "@/components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";

const DEFAULT_BUTTON_STYLE = {
  backgroundColor: "#6366F1",
  textColor: "#FFFFFF",
  borderRadius: "9999px",
  fontSize: "16px",
  padding: "12px 24px",
  buttonText: "Yodl me a coffee",
  icon: "coffee"
};

const DEFAULT_THANK_YOU_STYLE = {
  backgroundColor: "#1E1E2E",
  textColor: "#FFFFFF",
  message: "Thank you for your support! It means a lot to me.",
  showConfetti: true,
  socialLinks: {}
};

const DEFAULT_SOCIAL_PREVIEW = {
  title: "Support My Work",
  description: "Every contribution helps me continue creating awesome content for you!",
  imageUrl: "",
  useCustomImage: false
};

const DEFAULT_CONFIG: UserConfig = {
  ensNameOrAddress: "vitalik.eth",
  buttonStyle: DEFAULT_BUTTON_STYLE,
  thankYouPage: DEFAULT_THANK_YOU_STYLE,
  socialPreview: DEFAULT_SOCIAL_PREVIEW,
  slug: "demo",
  yodlConfig: {
    tokens: ["USDC", "USDT", "ETH"],
    chains: ["base", "oeth", "mainnet"],
    currency: "USD",
    amount: "",
    memo: "Thanks for the support!",
    redirectUrl: ""
  }
};

interface IndexProps {
  savedConfig: UserConfig | null;
  onConfigSave: (config: UserConfig) => void;
}

const Index = ({ savedConfig, onConfigSave }: IndexProps) => {
  const [userConfig, setUserConfig] = useState<UserConfig>(savedConfig || DEFAULT_CONFIG);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (savedConfig) {
      setUserConfig(savedConfig);
    }
  }, [savedConfig]);
  
  const handleConfigChange = (config: UserConfig) => {
    setUserConfig(config);
  };
  
  const handleSave = (config: UserConfig) => {
    onConfigSave(config);
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="animate-pulse-subtle inline-flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-glow">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-gradient animate-fade-in px-2">
            Create Beautiful Yodl Buttons
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up delay-150 px-2">
            Design and share a sleek donation button in minutes and start accepting crypto tips and donations without any technical knowledge.
          </p>
        </div>
        
        <div className="neo-blur rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-indigo-500/30 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-indigo-500/20">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-gradient-blue flex items-center">
                <svg className="w-5 h-5 mr-2 md:w-6 md:h-6 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Configure Your Button
              </h2>
              <ConfigurationForm 
                initialConfig={userConfig}
                onConfigChange={handleConfigChange}
                onSave={handleSave}
              />
            </div>
            
            <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900 to-indigo-950/40">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-gradient-purple flex items-center">
                <svg className="w-5 h-5 mr-2 md:w-6 md:h-6 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h2>
              <div className="transition-all-300 transform hover:scale-[1.02] flex justify-center lg:justify-start">
                <PreviewCard
                  preview={{
                    buttonStyle: userConfig.buttonStyle,
                    slug: userConfig.slug,
                    ensNameOrAddress: userConfig.ensNameOrAddress,
                    socialPreview: userConfig.socialPreview,
                    yodlConfig: userConfig.yodlConfig
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
