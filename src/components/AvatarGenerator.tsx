
import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarGeneratorProps {
  ensNameOrAddress: string;
  size?: "default" | "large" | "xxlarge";
  className?: string;
}

const AvatarGenerator = ({ 
  ensNameOrAddress, 
  size = "default", 
  className 
}: AvatarGeneratorProps) => {
  const initial = useMemo(() => {
    if (!ensNameOrAddress) return "?";
    
    // For ENS names, use the first character
    if (ensNameOrAddress.includes(".eth")) {
      return ensNameOrAddress.split(".")[0][0].toUpperCase();
    }
    
    // For Ethereum addresses, use the last character
    return ensNameOrAddress.slice(-1).toUpperCase();
  }, [ensNameOrAddress]);
  
  // Generate a deterministic pastel color based on the ENS name or address
  const backgroundColor = useMemo(() => {
    if (!ensNameOrAddress) return "#7C3AED";
    
    let hash = 0;
    for (let i = 0; i < ensNameOrAddress.length; i++) {
      hash = ensNameOrAddress.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 70%)`;
  }, [ensNameOrAddress]);

  const sizeClasses = {
    default: "h-9 w-9",
    large: "h-16 w-16",
    xxlarge: "h-24 w-24"
  };
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={`https://avatars.dicebear.com/api/identicon/${ensNameOrAddress}.svg`} alt={ensNameOrAddress} />
      <AvatarFallback 
        style={{ backgroundColor }}
        className="text-white"
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarGenerator;
