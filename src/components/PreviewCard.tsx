
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentButton from "./PaymentButton";
import { PreviewProps } from "@/types";
import SocialShareButtons from "./SocialShareButtons";
import AvatarGenerator from "./AvatarGenerator";

const PreviewCard = ({ preview }: PreviewProps) => {
  const baseUrl = window.location.origin;
  const paymentUrl = `${baseUrl}/pay/${preview.slug}`;
  
  return (
    <Card className="w-full overflow-hidden glass-card transition-all-200 animate-fade-in shadow-xl border-0">
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-b border-white/5">
        <CardTitle className="text-2xl font-medium flex items-center gap-3">
          <AvatarGenerator ensNameOrAddress={preview.ensNameOrAddress} />
          <span className="bg-gradient-to-r from-white to-slate-300 text-transparent bg-clip-text">Button Preview</span>
        </CardTitle>
        <CardDescription className="text-slate-300">
          How your payment button will appear to others
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="rounded-lg glass-morphism p-8 flex items-center justify-center shadow-inner">
          <div className="transition-all-300 transform hover:scale-110 hover:rotate-1">
            <PaymentButton
              style={preview.buttonStyle}
              ensNameOrAddress={preview.ensNameOrAddress}
              slug={preview.slug}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Share your button</h3>
          <SocialShareButtons url={paymentUrl} title={`Support me with ${preview.buttonStyle.buttonText}`} />
        </div>
        
        <div className="text-sm text-slate-400 pt-2 glass-morphism p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span>Button URL:</span>
            <code className="bg-black/30 px-2 py-1 rounded text-xs text-lime-300 font-mono">
              {paymentUrl}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
