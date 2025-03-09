
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserConfig } from "@/types";
import { useState, useEffect } from "react";

const MyProfilePage = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [userConfigs, setUserConfigs] = useState<UserConfig[]>([]);
  
  useEffect(() => {
    if (isConnected && address) {
      // For now, just mock some data
      // In a real app, we would fetch the user's configs from a database
      const mockConfig: UserConfig = {
        ensNameOrAddress: address,
        slug: address.substring(2, 8),
        buttonStyle: {
          backgroundColor: "#1E40AF",
          textColor: "#FFFFFF",
          borderRadius: "9999px",
          fontSize: "16px",
          padding: "12px 24px",
          buttonText: "Buy me a coffee"
        },
        socialPreview: {
          title: "Support My Work",
          description: "Every contribution helps me continue creating awesome content for you!",
          imageUrl: "",
          useCustomImage: false
        },
        thankYouPage: {
          backgroundColor: "#1E1E2E",
          textColor: "#FFFFFF",
          message: "Thank you for your support! It means a lot to me.",
          showConfetti: true
        },
        yodlConfig: {
          enabled: true,
          tokens: "USDC,USDT",
          chains: "base,oeth",
          currency: "USD",
          amount: "",
          memo: "",
          webhooks: []
        }
      };
      
      setUserConfigs([mockConfig]);
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">My Profile</h1>
          <p className="text-slate-400 mt-2 mb-8">
            Please connect your wallet to view your profile
          </p>
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
            My Profile
          </h1>
          <p className="text-slate-400 mt-2">
            Manage your payment buttons and track your payments
          </p>
        </div>
        
        <div className="animate-fade-in space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Wallet</CardTitle>
              <CardDescription>Your connected wallet address</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono">{address}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Payment Buttons</CardTitle>
              <CardDescription>Manage your payment buttons</CardDescription>
            </CardHeader>
            <CardContent>
              {userConfigs.length > 0 ? (
                <div className="space-y-4">
                  {userConfigs.map((config, index) => (
                    <div key={index} className="border p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{config.slug}</h3>
                        <p className="text-sm text-muted-foreground">
                          {config.buttonStyle.buttonText}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/pay/${config.slug}`)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => navigate("/")}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You don't have any payment buttons yet</p>
                  <Button onClick={() => navigate("/")}>Create a Payment Button</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfilePage;
