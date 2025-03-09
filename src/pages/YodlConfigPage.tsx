
import { useState, useEffect } from "react";
import { UserConfig, YodlPaymentConfig } from "@/types";
import YodlConfig from "@/components/YodlConfig";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "buymeacoffee_config";

const DEFAULT_YODL_CONFIG: YodlPaymentConfig = {
  enabled: false,
  tokens: "USDC,USDT",
  chains: "base,oeth",
  currency: "USD",
  amount: "",
  memo: "",
  webhooks: []
};

const YodlConfigPage = () => {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [yodlConfig, setYodlConfig] = useState<YodlPaymentConfig>(DEFAULT_YODL_CONFIG);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load config from localStorage
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        
        if (parsedConfig.yodlConfig) {
          setYodlConfig(parsedConfig.yodlConfig);
        }
      }
    } catch (error) {
      console.error("Error loading configuration:", error);
      toast({
        title: "Error",
        description: "Failed to load your configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleYodlConfigChange = (newYodlConfig: YodlPaymentConfig) => {
    setYodlConfig(newYodlConfig);
  };

  const handleSave = () => {
    if (!config) {
      toast({
        title: "Error",
        description: "No configuration found to update",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update the config with new Yodl settings
      const updatedConfig = {
        ...config,
        yodlConfig
      };
      
      // Save back to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
      
      toast({
        title: "Success",
        description: "Yodl payment configuration saved successfully",
      });
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save your configuration",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            Yodl Payment Configuration
          </h1>
          <p className="text-slate-400 mt-2">
            Configure how you receive crypto payments via the Yodl protocol
          </p>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Yodl Settings</CardTitle>
            <CardDescription>
              Set up your preferred tokens, chains, and other Yodl payment options
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <YodlConfig 
              config={yodlConfig} 
              onChange={handleYodlConfigChange} 
            />
            
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSave} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default YodlConfigPage;
