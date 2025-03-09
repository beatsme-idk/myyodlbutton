
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonStyle } from "@/types";
import PaymentButton from "@/components/PaymentButton";
import AvatarGenerator from "@/components/AvatarGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// In a real app, this would fetch from an API or database
const getPaymentConfig = (slug: string): {buttonStyle: ButtonStyle, ensNameOrAddress: string} | null => {
  // Try to load from localStorage first
  const savedConfig = localStorage.getItem("buymeacoffee_config");
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    if (config.slug === slug) {
      return {
        buttonStyle: config.buttonStyle,
        ensNameOrAddress: config.ensNameOrAddress
      };
    }
  }
  
  // Fallback to demo config
  const mockConfigs: Record<string, {buttonStyle: ButtonStyle, ensNameOrAddress: string}> = {
    "demo": {
      buttonStyle: {
        backgroundColor: "#1E40AF",
        textColor: "#FFFFFF",
        borderRadius: "9999px",
        fontSize: "16px",
        padding: "12px 24px",
        buttonText: "Buy me a coffee"
      },
      ensNameOrAddress: "vitalik.eth"
    }
  };
  
  return mockConfigs[slug] || null;
};

const PaymentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<{buttonStyle: ButtonStyle, ensNameOrAddress: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (slug) {
      // Simulate an API call
      setTimeout(() => {
        const paymentConfig = getPaymentConfig(slug);
        setConfig(paymentConfig);
        setLoading(false);
      }, 500);
    }
  }, [slug]);
  
  const handlePayment = () => {
    if (slug) {
      navigate(`/thank-you/${slug}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-lg text-destructive">
          Payment button not found for slug: {slug}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full animate-fade-in">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <AvatarGenerator ensNameOrAddress={config.ensNameOrAddress} size="lg" />
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
