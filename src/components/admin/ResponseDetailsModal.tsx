import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, CreditCard, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ResponseDetails {
  id: string;
  cpf: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  nps_score: number;
  created_at: string;
  questionnaire: {
    title: string;
  };
  survey_answers: Array<{
    question: {
      question_text: string;
      question_type: string;
    };
    answer_value: string;
  }>;
}

interface ResponseDetailsModalProps {
  response: ResponseDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResponseDetailsModal({
  response,
  isOpen,
  onClose,
}: ResponseDetailsModalProps) {
  if (!response) return null;

  const getNPSCategory = (score: number) => {
    if (score >= 9) return { label: "Promotor", color: "bg-green-500" };
    if (score >= 7) return { label: "Neutro", color: "bg-yellow-500" };
    return { label: "Detrator", color: "bg-red-500" };
  };

  const npsCategory = getNPSCategory(response.nps_score);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes da Resposta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pesquisa e Data */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{response.questionnaire.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(response.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>

          {/* Score NPS */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Score NPS
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">{response.nps_score}</div>
              <Badge className={`${npsCategory.color} text-white`}>
                {npsCategory.label}
              </Badge>
            </div>
          </div>

          {/* Dados do Respondente */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Respondente
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {response.cpf && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{response.cpf}</p>
                  </div>
                </div>
              )}
              {response.full_name && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{response.full_name}</p>
                  </div>
                </div>
              )}
              {response.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{response.email}</p>
                  </div>
                </div>
              )}
              {response.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{response.phone}</p>
                  </div>
                </div>
              )}
            </div>
            {!response.cpf && !response.full_name && !response.email && !response.phone && (
              <p className="text-sm text-muted-foreground italic">
                Resposta anônima - sem dados de identificação
              </p>
            )}
          </div>

          {/* Respostas das Perguntas */}
          {response.survey_answers && response.survey_answers.length > 0 && (
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Respostas
              </h3>
              <div className="space-y-4">
                {response.survey_answers.map((answer, index) => (
                  <div key={index}>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {answer.question.question_text}
                    </p>
                    <p className="font-medium">{answer.answer_value}</p>
                    {index < response.survey_answers.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
