
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PaymentPage from "./pages/PaymentPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";
import { UserConfig } from "./types";

const queryClient = new QueryClient();

const STORAGE_KEY = "buymeacoffee_config";

const App = () => {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(() => {
    // Try to load config from localStorage
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    return savedConfig ? JSON.parse(savedConfig) : null;
  });

  const handleConfigSave = (config: UserConfig) => {
    setUserConfig(config);
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
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
