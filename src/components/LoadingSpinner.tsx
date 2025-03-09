
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "gradient";
}

const LoadingSpinner = ({ 
  size = "md", 
  className = "",
  variant = "primary" 
}: LoadingSpinnerProps) => {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {variant === "primary" ? (
        <div className={cn("relative", dimensions[size])}>
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/60 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className={cn("relative", dimensions[size])}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-border"></div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
