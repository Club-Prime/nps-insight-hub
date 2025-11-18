import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  section_title?: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  options?: any;
  placeholder?: string;
}

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
  // Transform options to support both array and object formats
  const getChoices = (): string[] => {
    if (!question.options) return [];
    if (Array.isArray(question.options)) return question.options;
    if (question.options.choices) return question.options.choices;
    return [];
  };

  const choices = getChoices();

  // Debug log
  console.log('QuestionRenderer Debug:', {
    questionText: question.question_text,
    questionType: question.question_type,
    options: question.options,
    choices: choices,
    choicesLength: choices.length
  });

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
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onChange("Sim")}
              className={cn(
                "px-8 py-3 rounded-lg font-medium text-base transition-all duration-200",
                "border-2 flex items-center justify-center min-w-[120px]",
                value === "Sim"
                  ? "bg-primary text-primary-foreground border-transparent shadow-lg"
                  : "bg-secondary text-foreground border-border hover:border-primary hover:scale-105"
              )}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => onChange("Não")}
              className={cn(
                "px-8 py-3 rounded-lg font-medium text-base transition-all duration-200",
                "border-2 flex items-center justify-center min-w-[120px]",
                value === "Não"
                  ? "bg-primary text-primary-foreground border-transparent shadow-lg"
                  : "bg-secondary text-foreground border-border hover:border-primary hover:scale-105"
              )}
            >
              Não
            </button>
          </div>
        );

      case "text_short":
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Sua resposta"}
            className="max-w-md"
          />
        );

      case "text_long":
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Compartilhe seus comentários..."}
            className="min-h-[100px]"
            rows={4}
          />
        );

      case "multiple_choice":
        if (choices.length === 0) {
          return (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Erro: Opções de resposta não configuradas para esta pergunta.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Options: {JSON.stringify(question.options)}
              </p>
            </div>
          );
        }
        return (
          <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
            {choices.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        if (choices.length === 0) {
          return (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Erro: Opções de resposta não configuradas para esta pergunta.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Options: {JSON.stringify(question.options)}
              </p>
            </div>
          );
        }
        
        const selectedValues = value ? value.split(',') : [];
        
        const handleCheckboxChange = (choice: string, checked: boolean) => {
          let newValues = [...selectedValues];
          
          if (checked) {
            if (!newValues.includes(choice)) {
              newValues.push(choice);
            }
          } else {
            newValues = newValues.filter(v => v !== choice);
          }
          
          onChange(newValues.join(','));
        };

        return (
          <div className="space-y-3">
            {choices.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedValues.includes(choice)}
                  onCheckedChange={(checked) => handleCheckboxChange(choice, checked as boolean)}
                />
                <Label 
                  htmlFor={`${question.id}-${index}`} 
                  className="cursor-pointer font-normal"
                >
                  {choice}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
      {question.section_title && (
        <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">
          {question.section_title}
        </h3>
      )}
      <Label className="text-base font-medium block">
        {question.question_text}
        {question.is_required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
};
