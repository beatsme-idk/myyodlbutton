
import { ThankYouProps } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Heart } from "lucide-react";
import ConfettiEffect from "./ConfettiEffect";

const ThankYouPage = ({ thankYou }: ThankYouProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in"
      style={{
        backgroundColor: thankYou.backgroundColor,
        color: thankYou.textColor
      }}
    >
      {thankYou.showConfetti && <ConfettiEffect />}
      
      <div className="max-w-md w-full text-center space-y-6">
        <Heart className="mx-auto animate-pulse" size={60} />
        
        <h1 className="text-4xl font-bold tracking-tight">
          Thank You!
        </h1>
        
        <div className="text-lg">
          {thankYou.message}
        </div>
        
        <div className="pt-6">
          <Button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
