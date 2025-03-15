
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserConfig } from "@/types";
import PaymentButton from "@/components/PaymentButton";
import { generateYodlPaymentLink } from "@/utils/yodl";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AvatarGenerator from "@/components/AvatarGenerator";
import LoadingSpinner from "@/components/LoadingSpinner";

const PaymentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const STORAGE_KEY = "myyodlbutton_config";
    
    // Attempt to load from localStorage
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        
        // Check if this is the config we're looking for by slug
        if (parsedConfig && parsedConfig.slug === slug) {
          setConfig(parsedConfig);
        } else {
          setError("Payment button not found");
        }
      } else {
        setError("Payment button not found");
      }
    } catch (err) {
      console.error("Error loading configuration:", err);
      setError("Error loading payment button");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const handlePayNow = () => {
    if (!config) return;
    
    // Set up the redirect URL for the thank you page
    const yodlConfig = config.yodlConfig 
      ? {
          ...config.yodlConfig,
          redirectUrl: `${window.location.origin}/thank-you/${config.slug}`
        }
      : undefined;
      
    const paymentLink = generateYodlPaymentLink(config.ensNameOrAddress, yodlConfig);
    
    if (paymentLink) {
      window.location.href = paymentLink;
    } else {
      // Fallback if link generation fails
      toast({
        title: "Error",
        description: "Could not generate payment link. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-300">Loading payment button...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Oops! {error}</h1>
          <p className="text-slate-300">The payment button you're looking for doesn't exist or has been removed.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <AvatarGenerator 
          ensNameOrAddress={config.ensNameOrAddress} 
          size="xxlarge"
          className="mx-auto"
        />
        
        <h1 className="text-3xl font-bold">
          Support {config.ensNameOrAddress}
        </h1>
        
        <p className="text-slate-300 mb-8">
          Your support helps me continue creating content and projects you enjoy!
        </p>
        
        <div className="flex justify-center">
          <PaymentButton
            style={config.buttonStyle}
            ensNameOrAddress={config.ensNameOrAddress}
            slug={config.slug}
            onClick={handlePayNow}
            yodlConfig={config.yodlConfig}
            className="transform scale-125 origin-center"
          />
        </div>
      </div>
      
      <div className="mt-16 text-center text-sm text-slate-500">
        <p>Powered by Yodl and Lovable</p>
      </div>
    </div>
  );
};

export default PaymentPage;
