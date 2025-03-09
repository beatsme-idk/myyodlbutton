
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Goal as GoalIcon } from "lucide-react";

interface GoalTrackerProps {
  title: string;
  description?: string;
  currentAmount: number;
  targetAmount: number;
  currency?: string;
}

const GoalTracker = ({
  title,
  description,
  currentAmount,
  targetAmount,
  currency = "USD"
}: GoalTrackerProps) => {
  // Calculate percentage with safe math to avoid NaN
  const percentage = targetAmount > 0 
    ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100) 
    : 0;
  
  // Format amounts with currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Determine color based on progress
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 75) return "bg-green-400";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-blue-400";
    return "bg-indigo-500";
  };
  
  return (
    <Card className="bg-black/40 border-indigo-500/30 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-400" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {description && (
          <p className="text-sm text-slate-300 mb-4">{description}</p>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <GoalIcon className="h-4 w-4 text-indigo-300" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <span className="text-sm font-bold">{percentage}%</span>
          </div>
          
          <Progress value={percentage} className="h-2.5" indicatorColor={getProgressColor(percentage)} />
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-indigo-300 mr-1" />
              <span className="text-sm text-slate-300">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">{formatAmount(currentAmount)}</span>
              <span className="text-xs text-slate-400">of {formatAmount(targetAmount)}</span>
            </div>
          </div>
          
          {percentage >= 100 && (
            <div className="mt-2 py-1.5 px-3 bg-green-900/30 border border-green-500/20 rounded-md text-center">
              <span className="text-sm text-green-400 font-medium">Goal reached! 🎉</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;
