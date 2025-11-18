import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NPSScale } from "@/components/survey/NPSScale";
import { QuestionRenderer } from "@/components/survey/QuestionRenderer";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import logoBlack from "@/assets/logo-black.png";

export default function Survey() {
  const navigate = useNavigate();
  const { identifier } = useParams<{ identifier?: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingQuestionnaire, setLoadingQuestionnaire] = useState(true);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    cpf: "",
    fullName: "",
    product: "",
    service: "",
  });
  
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchQuestionnaire();
  }, []);

  const fetchQuestionnaire = async () => {
    setLoadingQuestionnaire(true);
    try {
      let questionnaireData;

      if (identifier) {
        // Try to find by slug first, then by ID
        const { data: bySlug } = await supabase
          .from("questionnaires")
          .select("*")
          .eq("slug", identifier)
          .eq("is_active", true)
          .single();

        if (bySlug) {
          questionnaireData = bySlug;
        } else {
          const { data: byId } = await supabase
            .from("questionnaires")
            .select("*")
            .eq("id", identifier)
            .eq("is_active", true)
            .single();
          questionnaireData = byId;
        }
      } else {
        // Default behavior: get any active questionnaire
        const { data } = await supabase
          .from("questionnaires")
          .select("*")
          .eq("is_active", true)
          .single();
        questionnaireData = data;
      }

      if (questionnaireData) {
        setQuestionnaire(questionnaireData);
        
        const { data: questionsData } = await supabase
          .from("questions")
          .select("*")
          .eq("questionnaire_id", questionnaireData.id)
          .order("order_index");

        setQuestions(questionsData || []);
      } else {
        toast.error("Questionário não encontrado ou inativo");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      toast.error("Erro ao carregar questionário");
      navigate("/");
    } finally {
      setLoadingQuestionnaire(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const validateForm = () => {
    if (!formData.cpf || !formData.fullName || !formData.product || !formData.service) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return false;
    }

    if (npsScore === null) {
      toast.error("Por favor, responda a pergunta NPS");
      return false;
    }

    const requiredQuestions = questions.filter(q => q.is_required && q.question_type !== 'nps');
    for (const question of requiredQuestions) {
      if (!answers[question.id]) {
        toast.error(`Por favor, responda: ${question.question_text}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data: responseData, error: responseError } = await supabase
        .from("survey_responses")
        .insert({
          questionnaire_id: questionnaire.id,
          cpf: formData.cpf.replace(/\D/g, ""),
          full_name: formData.fullName,
          product: formData.product,
          service: formData.service,
          nps_score: npsScore,
        })
        .select()
        .single();

      if (responseError) {
        if (responseError.code === "23505") {
          toast.error("Você já respondeu esta pesquisa!");
        } else {
          throw responseError;
        }
        return;
      }

      const answerInserts = questions
        .filter(q => q.question_type !== 'nps' && answers[q.id])
        .map(q => ({
          response_id: responseData.id,
          question_id: q.id,
          answer_value: answers[q.id],
        }));

      if (answerInserts.length > 0) {
        await supabase.from("answers").insert(answerInserts);
      }

      setSubmitted(true);
      toast.success("Pesquisa enviada com sucesso!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Erro ao enviar pesquisa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <CheckCircle className="w-20 h-20 mx-auto text-nps-promoter" />
          <h1 className="text-3xl font-bold">Obrigado!</h1>
          <p className="text-lg text-muted-foreground">
            Sua opinião é muito importante para nós.
          </p>
        </div>
      </div>
    );
  }

  if (loadingQuestionnaire) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Carregando pesquisa...</p>
        </div>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Pesquisa não encontrada</h1>
          <p className="text-muted-foreground">O questionário solicitado não está disponível.</p>
          <Button onClick={() => navigate("/")}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <img src={logoBlack} alt="GO HEALTH" className="h-16 mx-auto" />
          <h1 className="text-4xl font-bold">Pesquisa de Satisfação</h1>
          <p className="text-lg text-muted-foreground">
            Sua opinião nos ajuda a melhorar continuamente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identification Section */}
          <div className="bg-card p-8 rounded-lg border border-border space-y-6">
            <h2 className="text-2xl font-bold mb-6">Identificação</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produto Adquirido *</Label>
                <Input
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Serviço Utilizado *</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Nome do serviço"
                  required
                />
              </div>
            </div>
          </div>

          {/* NPS Question */}
          <div className="bg-card p-8 rounded-lg border border-border space-y-6">
            <div className="space-y-4">
              <Label className="text-xl font-bold">
                Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos produtos/serviços? *
              </Label>
              <NPSScale value={npsScore} onChange={setNpsScore} />
            </div>
          </div>

          {/* Additional Questions */}
          {questions
            .filter(q => q.question_type !== 'nps')
            .map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={answers[question.id] || ""}
                onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
              />
            ))}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full text-lg h-14"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Pesquisa"}
          </Button>
        </form>
      </div>
    </div>
  );
}
