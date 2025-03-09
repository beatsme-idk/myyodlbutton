
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({ size = "md", className = "" }: LoadingSpinnerProps) => {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${dimensions[size]}`}>
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary/60 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
