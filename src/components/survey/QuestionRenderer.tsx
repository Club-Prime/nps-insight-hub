import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  options?: any;
}

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
  const renderInput = () => {
    switch (question.question_type) {
      case "scale":
        return (
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num.toString())}
                className={cn(
                  "aspect-square rounded-lg font-bold text-lg transition-all duration-200",
                  "border-2 flex items-center justify-center",
                  value === num.toString()
                    ? "bg-primary text-primary-foreground border-transparent scale-110 shadow-lg"
                    : "bg-secondary text-foreground border-border hover:border-graphite hover:scale-105"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        );

      case "yes_no":
        return (
          <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`} className="cursor-pointer">Não</Label>
            </div>
          </RadioGroup>
        );

      case "text_short":
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Sua resposta"
            className="max-w-md"
          />
        );

      case "text_long":
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Compartilhe seus comentários..."
            className="min-h-[100px]"
          />
        );

      case "multiple_choice":
        if (!question.options?.choices) return null;
        return (
          <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
            {question.options.choices.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
      <Label className="text-base font-medium">
        {question.question_text}
        {question.is_required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
};
