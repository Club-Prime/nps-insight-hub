import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, GripVertical, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id?: string;
  section_title?: string;
  question_text: string;
  question_type: "nps" | "scale" | "yes_no" | "text_short" | "text_long" | "multiple_choice" | "checkbox";
  is_required: boolean;
  options?: { choices: string[] };
  placeholder?: string;
  order_index: number;
}

interface QuestionnaireEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionnaire?: any;
  onSuccess: () => void;
}

export const QuestionnaireEditor = ({ open, onOpenChange, questionnaire, onSuccess }: QuestionnaireEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      question_text: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos produtos/serviços?",
      question_type: "nps",
      is_required: true,
      order_index: 0,
    },
  ]);

  // Atualizar estados quando o questionário mudar
  useEffect(() => {
    if (questionnaire) {
      setTitle(questionnaire.title || "");
      setDescription(questionnaire.description || "");
      setSlug(questionnaire.slug || "");
      
      // Transformar options do formato do banco (array) para o formato do editor (objeto com choices)
      const transformedQuestions = (questionnaire.questions || []).map((q: any) => ({
        ...q,
        options: q.options 
          ? (Array.isArray(q.options) ? { choices: q.options } : q.options)
          : undefined,
      }));
      
      setQuestions(
        transformedQuestions.length > 0
          ? transformedQuestions
          : [
              {
                question_text: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos produtos/serviços?",
                question_type: "nps",
                is_required: true,
                order_index: 0,
              },
            ]
      );
    } else {
      // Resetar para novo questionário
      setTitle("");
      setDescription("");
      setSlug("");
      setQuestions([
        {
          question_text: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos produtos/serviços?",
          question_type: "nps",
          is_required: true,
          order_index: 0,
        },
      ]);
    }
  }, [questionnaire, open]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!questionnaire) {
      setSlug(generateSlug(value));
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      question_text: "",
      question_type: "text_short",
      is_required: true,
      order_index: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions[index].question_type === "nps") {
      toast.error("Não é possível remover a pergunta NPS");
      return;
    }
    setDeleteIndex(index);
  };

  const confirmRemoveQuestion = () => {
    if (deleteIndex === null) return;
    
    const updated = questions.filter((_, i) => i !== deleteIndex);
    updated.forEach((q, i) => (q.order_index = i));
    setQuestions(updated);
    setDeleteIndex(null);
    toast.success("Pergunta removida com sucesso");
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addChoice = (questionIndex: number) => {
    const updated = [...questions];
    const question = updated[questionIndex];
    if (!question.options) {
      question.options = { choices: [""] };
    } else {
      question.options.choices.push("");
    }
    setQuestions(updated);
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const updated = [...questions];
    if (updated[questionIndex].options) {
      updated[questionIndex].options!.choices[choiceIndex] = value;
      setQuestions(updated);
    }
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options) {
      updated[questionIndex].options!.choices = updated[questionIndex].options!.choices.filter(
        (_, i) => i !== choiceIndex
      );
      setQuestions(updated);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título");
      return;
    }

    if (!slug.trim()) {
      toast.error("Por favor, insira um slug");
      return;
    }

    const hasEmptyQuestions = questions.some((q) => !q.question_text.trim());
    if (hasEmptyQuestions) {
      toast.error("Por favor, preencha todas as perguntas");
      return;
    }

    setLoading(true);

    try {
      let questionnaireId = questionnaire?.id;

      if (questionnaire) {
        const { error: updateError } = await supabase
          .from("questionnaires")
          .update({
            title,
            description,
            slug,
            updated_at: new Date().toISOString(),
          })
          .eq("id", questionnaire.id);

        if (updateError) throw updateError;

        await supabase.from("questions").delete().eq("questionnaire_id", questionnaire.id);
      } else {
        const { data: newQuestionnaire, error: createError } = await supabase
          .from("questionnaires")
          .insert({
            title,
            description,
            slug,
            is_active: true,
          })
          .select()
          .single();

        if (createError) throw createError;
        questionnaireId = newQuestionnaire.id;
      }

      const questionsToInsert = questions.map((q) => ({
        questionnaire_id: questionnaireId,
        section_title: q.section_title || null,
        question_text: q.question_text,
        question_type: q.question_type as any, // Type will be updated when Supabase types are regenerated
        is_required: q.is_required,
        options: q.options || null,
        placeholder: q.placeholder || null,
        order_index: q.order_index,
      }));

      const { error: questionsError } = await supabase.from("questions").insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast.success(questionnaire ? "Pesquisa atualizada!" : "Pesquisa criada com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving questionnaire:", error);
      if (error.code === "23505") {
        toast.error("Já existe uma pesquisa com este slug");
      } else {
        toast.error("Erro ao salvar pesquisa");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{questionnaire ? "Editar Pesquisa" : "Nova Pesquisa"}</DialogTitle>
            <DialogDescription>
              Configure o título, descrição e perguntas da pesquisa. A pergunta NPS é obrigatória.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Pesquisa *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Pesquisa de Satisfação 2025"
                  className={!title.trim() ? "border-destructive" : ""}
                />
                {!title.trim() && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Este campo é obrigatório
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="pesquisa-satisfacao-2025"
                  className={!slug.trim() ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  🔗 URL: {window.location.origin}/survey/{slug || "..."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o objetivo desta pesquisa"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Perguntas ({questions.length})</Label>
                <Button onClick={addQuestion} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-move shrink-0" />
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          Pergunta {index + 1}
                          {question.question_type === "nps" && (
                            <Badge variant="secondary" className="ml-2">NPS - Obrigatória</Badge>
                          )}
                          {question.is_required && question.question_type !== "nps" && (
                            <Badge variant="outline">Obrigatória</Badge>
                          )}
                        </CardTitle>
                        {question.question_type !== "nps" && (
                          <Button
                            onClick={() => removeQuestion(index)}
                            size="icon"
                            variant="ghost"
                            className="ml-auto shrink-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Texto da Pergunta</Label>
                        <Textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
                          placeholder="Digite a pergunta"
                          disabled={question.question_type === "nps"}
                          rows={2}
                          className={!question.question_text.trim() ? "border-destructive" : ""}
                        />
                        {!question.question_text.trim() && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Este campo é obrigatório
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Tipo de Pergunta</Label>
                          <Select
                            value={question.question_type}
                            onValueChange={(value) => updateQuestion(index, "question_type", value)}
                            disabled={question.question_type === "nps"}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nps">NPS (0-10)</SelectItem>
                              <SelectItem value="scale">Escala (1-5)</SelectItem>
                              <SelectItem value="yes_no">Sim/Não</SelectItem>
                              <SelectItem value="text_short">Texto Curto</SelectItem>
                              <SelectItem value="text_long">Texto Longo</SelectItem>
                              <SelectItem value="multiple_choice">Múltipla Escolha (Radio)</SelectItem>
                              <SelectItem value="checkbox">Múltipla Seleção (Checkbox)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Obrigatória?</Label>
                          <Select
                            value={question.is_required ? "yes" : "no"}
                            onValueChange={(value) => updateQuestion(index, "is_required", value === "yes")}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Sim</SelectItem>
                              <SelectItem value="no">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {(question.question_type === "multiple_choice" || question.question_type === "checkbox") && (
                        <div className="space-y-2 pl-4 border-l-2 border-border">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Opções de Resposta</Label>
                            <Button onClick={() => addChoice(index)} size="sm" variant="ghost">
                              <Plus className="w-3 h-3 mr-1" />
                              Opção
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {question.options?.choices.map((choice, choiceIndex) => (
                              <div key={choiceIndex} className="flex items-center gap-2">
                                <Input
                                  value={choice}
                                  onChange={(e) => updateChoice(index, choiceIndex, e.target.value)}
                                  placeholder={`Opção ${choiceIndex + 1}`}
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() => removeChoice(index, choiceIndex)}
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0 h-8 w-8"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Salvando..." : questionnaire ? "Atualizar" : "Criar Pesquisa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a pergunta {deleteIndex !== null ? deleteIndex + 1 : ""}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveQuestion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Pergunta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
