import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PaymentPage from "./pages/PaymentPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";
import { UserConfig, YodlPaymentConfig } from "./types";

const queryClient = new QueryClient();

const STORAGE_KEY = "myyodlbutton_config";

const DEFAULT_YODL_CONFIG: YodlPaymentConfig = {
  tokens: ["USDC", "USDT"],
  chains: ["base", "oeth"],
  currency: "USD",
  amount: "",
  memo: "",
  redirectUrl: ""
};

const App = () => {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(() => {
    // Try to load config from localStorage with proper error handling
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        
        // Validate the parsed config has required fields
        if (parsedConfig && 
            parsedConfig.buttonStyle && 
            parsedConfig.ensNameOrAddress && 
            parsedConfig.slug) {
          
          // Ensure all required nested objects exist
          if (!parsedConfig.socialPreview) {
            parsedConfig.socialPreview = {
              title: "Support My Work",
              description: "Every contribution helps me continue creating awesome content for you!",
              imageUrl: "",
              useCustomImage: false
            };
          }
          
          if (!parsedConfig.thankYouPage) {
            parsedConfig.thankYouPage = {
              backgroundColor: "#1E1E2E",
              textColor: "#FFFFFF",
              message: "Thank you for your support! It means a lot to me.",
              showConfetti: true,
              socialLinks: {}
            };
          }

          // Add Yodl config if it doesn't exist
          if (!parsedConfig.yodlConfig) {
            parsedConfig.yodlConfig = DEFAULT_YODL_CONFIG;
          }
          
          // Update button text if it's still the old text
          if (parsedConfig.buttonStyle.buttonText === "Buy me a coffee") {
            parsedConfig.buttonStyle.buttonText = "Yodl me a coffee";
          }
          
          return parsedConfig;
        }
      }
    } catch (error) {
      console.error("Error loading saved configuration:", error);
    }
    
    return null;
  });

  const handleConfigSave = (config: UserConfig) => {
    // Ensure all required fields are present before saving
    const completeConfig = {
      ...config,
      socialPreview: config.socialPreview || {
        title: "Support My Work",
        description: "Every contribution helps me continue creating awesome content for you!",
        imageUrl: "",
        useCustomImage: false
      },
      thankYouPage: config.thankYouPage || {
        backgroundColor: "#1E1E2E",
        textColor: "#FFFFFF",
        message: "Thank you for your support! It means a lot to me.",
        showConfetti: true,
        socialLinks: {}
      },
      yodlConfig: config.yodlConfig || DEFAULT_YODL_CONFIG
    };
    
    setUserConfig(completeConfig);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completeConfig));
      console.log("Configuration saved successfully");
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index savedConfig={userConfig} onConfigSave={handleConfigSave} />} />
            <Route path="/pay/:slug" element={<PaymentPage />} />
            <Route path="/thank-you/:slug" element={<ThankYouPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
