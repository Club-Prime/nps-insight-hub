import { useState } from "react";
import { cn } from "@/lib/utils";

interface NPSScaleProps {
  value: number | null;
  onChange: (value: number) => void;
}

export const NPSScale = ({ value, onChange }: NPSScaleProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-nps-promoter hover:bg-nps-promoter/90";
    if (score >= 7) return "bg-nps-neutral hover:bg-nps-neutral/90";
    return "bg-nps-detractor hover:bg-nps-detractor/90";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "";
    if (score >= 9) return "Muito provável";
    if (score >= 7) return "Neutro";
    return "Pouco provável";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-11 gap-2">
        {[...Array(11)].map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index)}
            onMouseEnter={() => setHoveredValue(index)}
            onMouseLeave={() => setHoveredValue(null)}
            className={cn(
              "aspect-square rounded-lg font-bold text-sm transition-all duration-200",
              "border-2 flex items-center justify-center",
              value === index
                ? cn(getScoreColor(index), "text-white border-transparent scale-110 shadow-lg")
                : "bg-secondary text-foreground border-border hover:border-graphite hover:scale-105"
            )}
          >
            {index}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Nada provável</span>
        <span className="font-medium text-foreground">
          {getScoreLabel(hoveredValue !== null ? hoveredValue : value)}
        </span>
        <span>Muito provável</span>
      </div>
    </div>
  );
};
