
import { useParams } from "react-router-dom";
import ThankYouComponent from "@/components/ThankYouPage";
import { useEffect, useState } from "react";
import { ThankYouPageStyle } from "@/types";

// In a real app, this would fetch from an API or database
const getThankYouConfig = (slug: string): ThankYouPageStyle | null => {
  // For demonstration, we'll use a static config
  // In a real app, you'd fetch this from an API or database
  const mockConfigs: Record<string, ThankYouPageStyle> = {
    "demo": {
      backgroundColor: "#F9FAFB",
      textColor: "#111827",
      message: "Thank you for your support! It means a lot to me.",
      showConfetti: true
    }
  };
  
  return mockConfigs[slug] || null;
};

const ThankYouPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<ThankYouPageStyle | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (slug) {
      // Simulate an API call
      setTimeout(() => {
        const thankYouConfig = getThankYouConfig(slug);
        setConfig(thankYouConfig || {
          backgroundColor: "#F9FAFB",
          textColor: "#111827",
          message: "Thank you for your support!",
          showConfetti: true
        });
        setLoading(false);
      }, 500);
    }
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-destructive">
          Configuration not found for slug: {slug}
        </div>
      </div>
    );
  }
  
  return (
    <ThankYouComponent
      thankYou={{
        message: config.message,
        showConfetti: config.showConfetti,
        backgroundColor: config.backgroundColor,
        textColor: config.textColor
      }}
    />
  );
};

export default ThankYouPage;
