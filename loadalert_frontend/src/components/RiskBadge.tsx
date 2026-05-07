import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface RiskBadgeProps {
  level: "low" | "medium" | "high";
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const levelConfig = {
  low: {
    label: "Low Risk",
    icon: CheckCircle,
    className: "bg-success/20 text-success border-success/30",
  },
  medium: {
    label: "Medium Risk",
    icon: AlertCircle,
    className: "bg-warning/20 text-warning border-warning/30",
  },
  high: {
    label: "High Risk",
    icon: AlertTriangle,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

export const RiskBadge = ({ level, showIcon = true, size = "md" }: RiskBadgeProps) => {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        config.className,
        sizeStyles[size]
      )}
    >
      {showIcon && <Icon className={cn(size === "lg" ? "h-5 w-5" : "h-4 w-4")} />}
      <span>{config.label}</span>
    </div>
  );
};
