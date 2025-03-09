
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonStyle } from "@/types";
import PaymentButton from "@/components/PaymentButton";
import AvatarGenerator from "@/components/AvatarGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

// In a real app, this would fetch from an API or database
const getPaymentConfig = (slug: string): {buttonStyle: ButtonStyle, ensNameOrAddress: string, socialPreview?: any} | null => {
  // Try to load from localStorage first
  const savedConfig = localStorage.getItem("buymeacoffee_config");
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      if (config.slug === slug) {
        // Ensure socialPreview exists to prevent undefined errors
        return {
          buttonStyle: config.buttonStyle,
          ensNameOrAddress: config.ensNameOrAddress,
          socialPreview: config.socialPreview || {
            title: "Support My Work",
            description: "Every contribution helps me continue creating amazing content for you!",
            imageUrl: "",
            useCustomImage: false
          }
        };
      }
    } catch (e) {
      console.error("Error parsing saved config:", e);
      // Continue to fallback config
    }
  }
  
  // Fallback to demo config
  const mockConfigs: Record<string, {buttonStyle: ButtonStyle, ensNameOrAddress: string, socialPreview?: any}> = {
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
      }
    }
  };
  
  return mockConfigs[slug] || null;
};

const PaymentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<{buttonStyle: ButtonStyle, ensNameOrAddress: string, socialPreview?: any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (slug) {
      // Simulate an API call
      setTimeout(() => {
        try {
          const paymentConfig = getPaymentConfig(slug);
          if (paymentConfig) {
            // Ensure we have a valid config with all required properties
            if (!paymentConfig.buttonStyle || !paymentConfig.ensNameOrAddress) {
              throw new Error("Invalid payment configuration");
            }
            
            // Set the config and clear any previous errors
            setConfig(paymentConfig);
            setError(null);
            console.log("Payment config loaded:", paymentConfig);
          } else {
            // Handle case where no config was found
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
          // Handle any unexpected errors
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
            <AvatarGenerator ensNameOrAddress={config.ensNameOrAddress} size="large" />
            <div>
              <CardTitle className="text-2xl font-medium">
                Support {config.ensNameOrAddress}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-center text-muted-foreground pb-4">
            Your contribution helps them continue creating amazing content.
          </div>
          
          <PaymentButton
            style={config.buttonStyle}
            ensNameOrAddress={config.ensNameOrAddress}
            slug={slug || ""}
            onClick={handlePayment}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
