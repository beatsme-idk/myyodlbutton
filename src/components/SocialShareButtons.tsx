
import { Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

const SocialShareButtons = ({ url, title }: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    window.open(twitterUrl, "_blank");
    toast({
      title: "Shared on Twitter",
      description: "Your payment button has been shared on Twitter",
    });
  };
  
  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    window.open(linkedinUrl, "_blank");
    toast({
      title: "Shared on LinkedIn",
      description: "Your payment button has been shared on LinkedIn",
    });
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2 transition-all-200"
        onClick={shareOnTwitter}
      >
        <Twitter size={16} />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2 transition-all-200"
        onClick={shareOnLinkedIn}
      >
        <Linkedin size={16} />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-2 transition-all-200"
        onClick={copyToClipboard}
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
      </Button>
    </div>
  );
};

export default SocialShareButtons;
