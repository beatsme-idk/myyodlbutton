
import { Card } from "@/components/ui/card";
import { SocialPreviewStyle } from "@/types";
import AvatarGenerator from "./AvatarGenerator";

interface SocialPreviewCardProps {
  ensNameOrAddress: string;
  socialPreview: SocialPreviewStyle;
}

const SocialPreviewCard = ({ ensNameOrAddress, socialPreview }: SocialPreviewCardProps) => {
  return (
    <Card className="w-full overflow-hidden glass-panel border-0 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-gray-900 to-slate-900 pt-2 px-2">
        <div className="flex items-center gap-2 pb-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <div className="flex-1 text-xs text-slate-400 text-center">Social Media Preview</div>
        </div>
      </div>
      
      <div className="bg-slate-800 p-4 flex items-center gap-3">
        {socialPreview.useCustomImage && socialPreview.imageUrl ? (
          <img 
            src={socialPreview.imageUrl} 
            alt="Preview" 
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600/20">
            <AvatarGenerator ensNameOrAddress={ensNameOrAddress} size="large" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-md font-semibold text-white truncate">
            {socialPreview.title || `Support me with crypto`}
          </h3>
          <p className="text-sm text-slate-300 line-clamp-2 mt-1">
            {socialPreview.description || `Send crypto to ${ensNameOrAddress} to show your support.`}
          </p>
          <div className="mt-2 text-xs text-slate-400 truncate">
            myyodlbutton.lovable.app/pay/{ensNameOrAddress.replace('.eth', '')}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SocialPreviewCard;
