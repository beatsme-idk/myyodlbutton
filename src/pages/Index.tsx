
import { useState } from "react";
import { UserConfig } from "@/types";
import ConfigurationForm from "@/components/ConfigurationForm";
import PreviewCard from "@/components/PreviewCard";
import { useNavigate } from "react-router-dom";

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

const Index = () => {
  const navigate = useNavigate();
  const [userConfig, setUserConfig] = useState<UserConfig>(DEFAULT_CONFIG);
  
  const handleConfigChange = (config: UserConfig) => {
    setUserConfig(config);
  };
  
  const handleSave = (config: UserConfig) => {
    // In a real app, this would save to a database
    console.log("Saving configuration:", config);
    
    // For demo purposes, we'll navigate to the payment page
    navigate(`/pay/${config.slug}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
            Create Your Payment Button
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Design a beautiful "Buy Me a Coffee" button in minutes and start accepting payments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <ConfigurationForm 
              initialConfig={userConfig}
              onConfigChange={handleConfigChange}
              onSave={handleSave}
            />
          </div>
          
          <div className="order-1 lg:order-2">
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
  );
};

export default Index;
