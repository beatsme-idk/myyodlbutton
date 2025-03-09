
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentButton from "./PaymentButton";
import { PreviewProps } from "@/types";
import SocialShareButtons from "./SocialShareButtons";
import AvatarGenerator from "./AvatarGenerator";
import SocialPreviewCard from "./SocialPreviewCard";
import { Sparkles, Link as LinkIcon, CopyIcon, Check, Share2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { generateYodlPaymentLink } from "@/utils/yodl";

const PreviewCard = ({ preview }: PreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const baseUrl = window.location.origin;
  const paymentUrl = `${baseUrl}/pay/${preview.slug}`;
  const yodlUrl = preview.yodlConfig?.enabled 
    ? generateYodlPaymentLink(preview.ensNameOrAddress, preview.yodlConfig)
    : null;
  
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "URL copied to clipboard",
      description: "Share it with your audience to receive payments",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="w-full overflow-hidden glass-panel transition-all-200 shadow-xl border-0 rounded-xl">
      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-900/60 to-indigo-950/70 border-b border-indigo-500/20">
        <CardTitle className="text-2xl font-medium flex items-center gap-3">
          <AvatarGenerator ensNameOrAddress={preview.ensNameOrAddress} />
          <div className="flex flex-col items-start">
            <span className="text-gradient">Payment Button</span>
            <CardDescription className="text-indigo-300 mt-1">
              Share with your audience
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6">
        <div className="rounded-lg glass-morphism p-10 flex items-center justify-center shadow-inner">
          <div className="transition-all-300 transform hover:scale-110">
            <PaymentButton
              style={preview.buttonStyle}
              ensNameOrAddress={preview.ensNameOrAddress}
              slug={preview.slug}
              yodlConfig={preview.yodlConfig}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Share your button
            </h3>
            {preview.socialPreview && (
              <button
                onClick={() => setShowSocialPreview(!showSocialPreview)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Share2 size={14} />
                {showSocialPreview ? "Hide" : "Show"} social preview
              </button>
            )}
          </div>
          
          {preview.socialPreview && showSocialPreview && (
            <div className="my-4 animate-fade-in">
              <SocialPreviewCard 
                ensNameOrAddress={preview.ensNameOrAddress}
                socialPreview={preview.socialPreview}
              />
              <p className="text-xs text-slate-400 mt-2">
                This is how your link will appear when shared on social media
              </p>
            </div>
          )}
          
          <SocialShareButtons url={paymentUrl} title={`Support me with ${preview.buttonStyle.buttonText}`} />
        </div>
        
        <div className="glass-morphism p-4 rounded-lg space-y-2">
          <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
            <LinkIcon size={16} className="text-indigo-400" />
            Payment Link
          </h3>
          
          <div className="relative">
            <div className="flex items-center bg-black/30 rounded-lg overflow-hidden border border-indigo-500/20">
              <div className="flex-1 overflow-hidden">
                <input 
                  type="text" 
                  value={paymentUrl} 
                  readOnly 
                  className="bg-transparent w-full px-3 py-2 text-sm text-indigo-200 font-mono overflow-x-auto focus:outline-none"
                />
              </div>
              <button 
                className="bg-indigo-600/50 hover:bg-indigo-600 border-l border-indigo-500/30 px-3 py-2 text-white transition-colors"
                onClick={() => handleCopy(paymentUrl)}
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <CopyIcon size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {yodlUrl && (
          <div className="glass-morphism p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
              <Wallet size={16} className="text-green-400" />
              Yodl Payment Link
            </h3>
            
            <div className="relative">
              <div className="flex items-center bg-black/30 rounded-lg overflow-hidden border border-green-500/20">
                <div className="flex-1 overflow-hidden">
                  <input 
                    type="text" 
                    value={yodlUrl} 
                    readOnly 
                    className="bg-transparent w-full px-3 py-2 text-sm text-green-200 font-mono overflow-x-auto focus:outline-none"
                  />
                </div>
                <button 
                  className="bg-green-600/50 hover:bg-green-600 border-l border-green-500/30 px-3 py-2 text-white transition-colors"
                  onClick={() => handleCopy(yodlUrl)}
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <CopyIcon size={18} />
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <Sparkles size={12} className="text-green-400" />
              Your audience will be able to pay you with various tokens on multiple blockchains
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
