import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-obsidian-blood/5 border-l-fired-cream",
  success: "border-green-500/10 border-l-green-500",
  warning: "border-fired-cream/30 border-l-fired-cream",
  danger: "border-destructive/10 border-l-destructive",
};

export const StatsCard = ({
  title,
  value,
  subtitle,
  variant = "default",
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "bg-pure-snow border-l-4 border-t border-r border-b p-6 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-xl group",
        variantStyles[variant]
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-obsidian-blood/40 group-hover:text-fired-cream transition-colors">
          {title}
        </p>
        <p className="text-4xl font-black text-obsidian-blood italic tracking-tighter">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/20">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
