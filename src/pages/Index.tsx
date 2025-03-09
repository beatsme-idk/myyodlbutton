
import { useState, useEffect } from "react";
import { UserConfig } from "@/types";
import ConfigurationForm from "@/components/ConfigurationForm";
import PreviewCard from "@/components/PreviewCard";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const DEFAULT_BUTTON_STYLE = {
  backgroundColor: "#1E40AF",
  textColor: "#FFFFFF",
  borderRadius: "9999px",
  fontSize: "16px",
  padding: "12px 24px",
  buttonText: "Buy me a coffee"
};

const DEFAULT_THANK_YOU_STYLE = {
  backgroundColor: "#F9FAFB",
  textColor: "#111827",
  message: "Thank you for your support! It means a lot to me.",
  showConfetti: true
};

const DEFAULT_CONFIG: UserConfig = {
  ensNameOrAddress: "vitalik.eth",
  buttonStyle: DEFAULT_BUTTON_STYLE,
  thankYouPage: DEFAULT_THANK_YOU_STYLE,
  slug: "demo"
};

interface IndexProps {
  savedConfig: UserConfig | null;
  onConfigSave: (config: UserConfig) => void;
}

const Index = ({ savedConfig, onConfigSave }: IndexProps) => {
  const navigate = useNavigate();
  const [userConfig, setUserConfig] = useState<UserConfig>(savedConfig || DEFAULT_CONFIG);
  
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
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white animate-fade-in">
            Create Your Payment Button
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in">
            Design a beautiful "Buy Me a Coffee" button in minutes and start accepting payments.
          </p>
        </div>
        
        <div className="glass-dark rounded-2xl shadow-xl overflow-hidden border border-slate-700/50 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-700/50">
              <h2 className="text-xl font-semibold mb-6 text-slate-100 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Configure Your Payment Button
              </h2>
              <ConfigurationForm 
                initialConfig={userConfig}
                onConfigChange={handleConfigChange}
                onSave={handleSave}
              />
            </div>
            
            <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800/90">
              <h2 className="text-xl font-semibold mb-6 text-slate-100 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Preview
              </h2>
              <div className="transition-all-300 transform hover:scale-[1.02]">
                <PreviewCard
                  preview={{
                    buttonStyle: userConfig.buttonStyle,
                    slug: userConfig.slug,
                    ensNameOrAddress: userConfig.ensNameOrAddress
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
