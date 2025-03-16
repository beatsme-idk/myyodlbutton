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
    tokens: ["all"],
    chains: ["all"],
    currency: "USD",
    amount: "",
    memo: "",
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="neo-blur rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-indigo-500/30 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-indigo-500/20">
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
