
import { ThankYouProps } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Heart, Share, ArrowLeft, Check, Copy } from "lucide-react";
import ConfettiEffect from "./ConfettiEffect";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import SocialShareButtons from "./SocialShareButtons";

const ThankYouPage = ({ thankYou }: ThankYouProps) => {
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast({
      title: "Link copied",
      description: "The payment link has been copied to your clipboard",
    });
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: thankYou.backgroundColor,
        color: thankYou.textColor
      }}
    >
      {thankYou.showConfetti && <ConfettiEffect />}
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"
             style={{ backgroundColor: thankYou.textColor }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"
             style={{ backgroundColor: thankYou.textColor }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"
             style={{ backgroundColor: thankYou.textColor }}></div>
      </div>
      
      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-fade-in">
        <div className="mb-6 animate-bounce">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center backdrop-blur-sm border border-current border-opacity-20" 
               style={{ backgroundColor: `${thankYou.textColor}20` }}>
            <Check className="w-10 h-10 opacity-90" strokeWidth={3} />
          </div>
        </div>
        
        <Heart className="mx-auto" size={60} />
        
        <h1 className="text-4xl font-bold tracking-tight animate-slide-up">
          Thank You!
        </h1>
        
        <div className="text-lg animate-slide-up opacity-90 delay-150">
          {thankYou.message}
        </div>
        
        {/* Transaction details */}
        <div className="backdrop-blur-md rounded-xl p-6 border border-current border-opacity-10 animate-slide-up delay-300"
             style={{ backgroundColor: `${thankYou.textColor}05` }}>
          <div className="flex justify-between items-center mb-3">
            <span className="opacity-70">Status:</span>
            <span className="font-medium flex items-center">
              <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-400"></span>
              Confirmed
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-70">Transaction:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm opacity-80 truncate">0x92e8...f3b2</span>
              <button 
                onClick={handleCopyLink}
                className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center animate-slide-up delay-450">
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-current border-opacity-10 w-full sm:w-auto"
          >
            <Home size={16} className="mr-2" />
            Return Home
          </Button>
          
          <Button
            onClick={() => setShowShareOptions(!showShareOptions)}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-current border-opacity-10 w-full sm:w-auto"
          >
            <Share size={16} className="mr-2" />
            Share
          </Button>
        </div>
        
        {/* Social share options */}
        {showShareOptions && (
          <div className="animate-fade-in py-2">
            <SocialShareButtons url={window.location.origin} title="Thank you for your support!" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYouPage;
