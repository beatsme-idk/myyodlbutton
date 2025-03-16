import { Card, CardContent } from "@/components/ui/card";
import { SocialPreviewStyle } from "@/types";
import AvatarGenerator from "./AvatarGenerator";
import { Coffee, Gift, Heart, Sparkles, Wallet } from "lucide-react";

interface SocialPreviewCardProps {
  ensNameOrAddress: string;
  socialPreview: SocialPreviewStyle;
}

const SocialPreviewCard = ({ ensNameOrAddress, socialPreview }: SocialPreviewCardProps) => {
  const displayEnsOrAddress = ensNameOrAddress.length > 20 
    ? `${ensNameOrAddress.substring(0, 6)}...${ensNameOrAddress.substring(ensNameOrAddress.length - 4)}`
    : ensNameOrAddress;

  // Generate a default image if none is provided
  const defaultImage = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="text-white text-center p-6">
        <Wallet className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <div className="text-xl font-bold">{socialPreview.title}</div>
        <div className="text-sm mt-2 opacity-80 max-w-xs mx-auto">
          {socialPreview.description.substring(0, 100)}
          {socialPreview.description.length > 100 ? '...' : ''}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
      <div className="aspect-[1200/630] bg-slate-900 overflow-hidden">
        {socialPreview.useCustomImage && socialPreview.imageUrl ? (
          <img 
            src={socialPreview.imageUrl} 
            alt={socialPreview.title}
            className="w-full h-full object-cover"
          />
        ) : (
          defaultImage
        )}
      </div>
      <CardContent className="p-4 bg-slate-800">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-indigo-600 p-2 mt-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{socialPreview.title}</h3>
            <p className="text-slate-300 text-sm mt-1 line-clamp-2">
              {socialPreview.description}
            </p>
            <div className="text-indigo-400 text-xs mt-2 truncate">
              myyodlbutton.lovable.app
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialPreviewCard;
