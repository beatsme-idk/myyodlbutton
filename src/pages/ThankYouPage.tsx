
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserConfig } from "@/types";
import ThankYouPage from "@/components/ThankYouPage";
import LoadingSpinner from "@/components/LoadingSpinner";

const ThankYouPageRoute = () => {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError("Thank you page not found");
        }
      } else {
        setError("Thank you page not found");
      }
    } catch (err) {
      console.error("Error loading configuration:", err);
      setError("Error loading thank you page");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Oops! {error}</h1>
          <p className="text-gray-600 dark:text-gray-300">The thank you page you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return <ThankYouPage thankYou={config.thankYouPage} />;
};

export default ThankYouPageRoute;
