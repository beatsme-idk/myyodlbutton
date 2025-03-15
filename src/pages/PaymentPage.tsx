
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonStyle, YodlPaymentConfig } from "@/types";
import PaymentButton from "@/components/PaymentButton";
import AvatarGenerator from "@/components/AvatarGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getPaymentConfig = (slug: string): {
  buttonStyle: ButtonStyle, 
  ensNameOrAddress: string, 
  socialPreview?: any,
  yodlConfig?: YodlPaymentConfig
} | null => {
  const savedConfig = localStorage.getItem("buymeacoffee_config");
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      if (config.slug === slug) {
        return {
          buttonStyle: config.buttonStyle,
          ensNameOrAddress: config.ensNameOrAddress,
          socialPreview: config.socialPreview || {
            title: "Support My Work",
            description: "Every contribution helps me continue creating amazing content for you!",
            imageUrl: "",
            useCustomImage: false
          },
          yodlConfig: config.yodlConfig || {
            tokens: ["USDC", "USDT"],
            chains: ["base", "oeth"],
            currency: "USD",
            amount: ""
          }
        };
      }
    } catch (e) {
      console.error("Error parsing saved config:", e);
    }
  }
  
  const mockConfigs: Record<string, {
    buttonStyle: ButtonStyle, 
    ensNameOrAddress: string, 
    socialPreview?: any,
    yodlConfig?: YodlPaymentConfig
  }> = {
    "demo": {
      buttonStyle: {
        backgroundColor: "#1E40AF",
        textColor: "#FFFFFF",
        borderRadius: "9999px",
        fontSize: "16px",
        padding: "12px 24px",
        buttonText: "Buy me a coffee"
      },
      ensNameOrAddress: "vitalik.eth",
      socialPreview: {
        title: "Support My Work",
        description: "Every contribution helps me continue creating awesome content for you!",
        imageUrl: "",
        useCustomImage: false
      },
      yodlConfig: {
        tokens: ["USDC", "USDT"],
        chains: ["base", "oeth"],
        currency: "USD",
        amount: ""
      }
    }
  };
  
  return mockConfigs[slug] || null;
};

const PaymentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<{
    buttonStyle: ButtonStyle, 
    ensNameOrAddress: string, 
    socialPreview?: any,
    yodlConfig?: YodlPaymentConfig
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (slug) {
      setTimeout(() => {
        try {
          const paymentConfig = getPaymentConfig(slug);
          if (paymentConfig) {
            if (!paymentConfig.buttonStyle || !paymentConfig.ensNameOrAddress) {
              throw new Error("Invalid payment configuration");
            }
            
            setConfig(paymentConfig);
            setError(null);
            console.log("Payment config loaded:", paymentConfig);
          } else {
            const errorMsg = `Payment button not found for: ${slug}`;
            console.error(errorMsg);
            setError(errorMsg);
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive"
            });
          }
        } catch (err) {
          const errorMsg = `Error loading payment page: ${err instanceof Error ? err.message : 'Unknown error'}`;
          console.error(errorMsg);
          setError(errorMsg);
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }, 500);
    }
  }, [slug, toast]);
  
  const handlePayment = () => {
    if (slug) {
      navigate(`/thank-you/${slug}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" variant="gradient" />
      </div>
    );
  }
  
  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-lg text-destructive">
          {error || `Payment button not found for slug: ${slug}`}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full animate-fade-in">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <AvatarGenerator ensNameOrAddress={config?.ensNameOrAddress || ""} size="large" />
            <div>
              <CardTitle className="text-2xl font-medium">
                Support {config?.ensNameOrAddress}
              </CardTitle>
              
              {config?.yodlConfig && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700/50 flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    Yodl Enabled
                  </Badge>
                  
                  {config.yodlConfig.tokens && config.yodlConfig.tokens.length > 0 && (
                    <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700/50 text-xs">
                      {config.yodlConfig.tokens.join(', ')}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-center text-muted-foreground pb-4">
            Your contribution helps them continue creating amazing content.
            {config?.yodlConfig && (
              <p className="text-sm mt-2 text-green-400">
                Pay with crypto stablecoins across multiple blockchains.
              </p>
            )}
          </div>
          
          {config && (
            <PaymentButton
              style={config.buttonStyle}
              ensNameOrAddress={config.ensNameOrAddress}
              slug={slug || ""}
              onClick={handlePayment}
              className="w-full"
              yodlConfig={config.yodlConfig}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
