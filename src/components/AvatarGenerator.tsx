
import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarGeneratorProps {
  ensNameOrAddress: string;
  size?: "default" | "large";
}

const AvatarGenerator = ({ ensNameOrAddress, size = "default" }: AvatarGeneratorProps) => {
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
  
  // Currently, we're just using a placeholder avatar for demo
  // In a real app, you'd fetch the actual ENS avatar if available
  return (
    <Avatar className={size === "large" ? "h-16 w-16" : "h-9 w-9"}>
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
