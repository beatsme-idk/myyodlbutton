
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentButton from "./PaymentButton";
import { PreviewProps } from "@/types";
import SocialShareButtons from "./SocialShareButtons";
import AvatarGenerator from "./AvatarGenerator";

const PreviewCard = ({ preview }: PreviewProps) => {
  const baseUrl = window.location.origin;
  const paymentUrl = `${baseUrl}/pay/${preview.slug}`;
  
  return (
    <Card className="w-full overflow-hidden transition-all-200 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-medium flex items-center gap-3">
          <AvatarGenerator ensNameOrAddress={preview.ensNameOrAddress} />
          <span>Button Preview</span>
        </CardTitle>
        <CardDescription>
          How your payment button will appear to others
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-secondary p-8 flex items-center justify-center">
          <PaymentButton
            style={preview.buttonStyle}
            ensNameOrAddress={preview.ensNameOrAddress}
            slug={preview.slug}
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Share your button</h3>
          <SocialShareButtons url={paymentUrl} title={`Support me with ${preview.buttonStyle.buttonText}`} />
        </div>
        
        <div className="text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <span>Button URL:</span>
            <code className="bg-secondary px-2 py-1 rounded text-xs">
              {paymentUrl}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
