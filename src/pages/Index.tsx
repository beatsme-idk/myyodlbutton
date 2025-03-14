import { useState, useEffect } from "react";
import { UserConfig } from "@/types";
import ConfigurationForm from "@/components/ConfigurationForm";
import PreviewCard from "@/components/PreviewCard";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileButtonPreview from "@/components/MobileButtonPreview";

const DEFAULT_BUTTON_STYLE = {
  backgroundColor: "#6366F1",
  textColor: "#FFFFFF",
  borderRadius: "9999px",
  fontSize: "16px",
  padding: "12px 24px",
  buttonText: "Support me",
  iconType: "none" as const
};

const DEFAULT_THANK_YOU_STYLE = {
  backgroundColor: "#1E1E2E",
  textColor: "#FFFFFF",
  message: "Thank you for your support! It means a lot to me.",
  showConfetti: true
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
  slug: "demo"
};

interface IndexProps {
  savedConfig: UserConfig | null;
  onConfigSave: (config: UserConfig) => void;
}

const Index = ({ savedConfig, onConfigSave }: IndexProps) => {
  const navigate = useNavigate();
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
    navigate(`/pay/${config.slug}`);
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-3 md:mb-5 space-y-1">
          <div className="flex justify-center mb-2">
            <div className="animate-pulse-subtle inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-glow">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gradient animate-fade-in">
            Create Payment Buttons
          </h1>
          
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto animate-fade-in-up delay-150">
            Design a donation button and start accepting crypto tips without any technical knowledge.
          </p>
        </div>

        {isMobile && (
          <div className="mb-3">
            <MobileButtonPreview buttonStyle={userConfig.buttonStyle} />
          </div>
        )}
        
        <div className="neo-blur rounded-2xl shadow-xl overflow-hidden border border-indigo-500/30 animate-slide-up mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-indigo-500/20">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gradient-blue flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            
            <div className="p-4 md:p-6 bg-gradient-to-br from-slate-900 to-indigo-950/40">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gradient-purple flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </h2>
              <div className="transition-all-300 transform hover:scale-[1.02]">
                <PreviewCard
                  preview={{
                    buttonStyle: userConfig.buttonStyle,
                    slug: userConfig.slug,
                    ensNameOrAddress: userConfig.ensNameOrAddress,
                    socialPreview: userConfig.socialPreview
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
