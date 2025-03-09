
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface AvatarGeneratorProps {
  ensNameOrAddress: string;
  size?: "sm" | "md" | "lg";
}

const AvatarGenerator = ({ ensNameOrAddress, size = "md" }: AvatarGeneratorProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Size mapping
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  useEffect(() => {
    const generateAvatar = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // For demonstration purposes, we'll use a placeholder service
        // In a real app, you'd integrate with a proper ENS avatar service
        const hash = ensNameOrAddress.toLowerCase().replace(/[^a-z0-9]/g, "");
        const url = `https://avatars.dicebear.com/api/identicon/${hash}.svg`;
        setAvatarUrl(url);
      } catch (err) {
        console.error("Error generating avatar:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (ensNameOrAddress) {
      generateAvatar();
    }
  }, [ensNameOrAddress]);

  // Get initials from ENS name or address
  const getInitials = (): string => {
    if (!ensNameOrAddress) return "?";
    
    // For ENS names, use the first character
    if (ensNameOrAddress.includes(".eth")) {
      return ensNameOrAddress.split(".")[0].charAt(0).toUpperCase();
    }
    
    // For Ethereum addresses, use first and last characters
    if (ensNameOrAddress.startsWith("0x")) {
      return `${ensNameOrAddress.charAt(2).toUpperCase()}${ensNameOrAddress.charAt(ensNameOrAddress.length - 1).toUpperCase()}`;
    }
    
    return ensNameOrAddress.charAt(0).toUpperCase();
  };

  if (loading) {
    return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
  }

  return (
    <Avatar className={`${sizeClasses[size]} transition-all-200`}>
      <AvatarImage src={avatarUrl} alt={ensNameOrAddress} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarGenerator;
