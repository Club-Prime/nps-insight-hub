import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, FileText, QrCode as QrCodeIcon, Download, ArrowLeft } from "lucide-react";
import { NPSDistributionChart } from "./NPSDistributionChart";
import { NPSTimelineChart } from "./NPSTimelineChart";
import { QRCodeGenerator } from "./QRCodeGenerator";
import ResponseDetailsModal from "./ResponseDetailsModal";
import { exportToExcel, exportToCSV } from "@/utils/exportData";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionnaireDetailViewProps {
  questionnaireId: string;
  onBack: () => void;
}

export const QuestionnaireDetailView = ({ questionnaireId, onBack }: QuestionnaireDetailViewProps) => {
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [npsData, setNpsData] = useState({
    score: 0,
    promoters: 0,
    neutrals: 0,
    detractors: 0,
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, [questionnaireId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch questionnaire
      const { data: qData, error: qError } = await supabase
        .from("questionnaires")
        .select("*")
        .eq("id", questionnaireId)
        .single();

      if (qError) throw qError;
      setQuestionnaire(qData);

      // Fetch responses
      const { data: rData, error: rError } = await supabase
        .from("survey_responses")
        .select(`
          *,
          answers (
            *,
            questions (*)
          )
        `)
        .eq("questionnaire_id", questionnaireId)
        .order("created_at", { ascending: false });

      if (rError) throw rError;
      setResponses(rData || []);
      calculateNPS(rData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const calculateNPS = (data: any[]) => {
    if (data.length === 0) {
      setNpsData({ score: 0, promoters: 0, neutrals: 0, detractors: 0, total: 0 });
      return;
    }

    const promoters = data.filter((r) => r.nps_score >= 9).length;
    const neutrals = data.filter((r) => r.nps_score >= 7 && r.nps_score <= 8).length;
    const detractors = data.filter((r) => r.nps_score <= 6).length;
    const total = data.length;

    const score = Math.round(((promoters - detractors) / total) * 100);
    setNpsData({ score, promoters, neutrals, detractors, total });
  };

  const handleExportExcel = () => {
    exportToExcel({ responses, questionnaire });
    toast.success("Relatório Excel exportado!");
  };

  const handleExportCSV = () => {
    exportToCSV(responses);
    toast.success("Arquivo CSV exportado!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pesquisa não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button onClick={onBack} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{questionnaire.title}</h2>
              <Badge variant={questionnaire.is_active ? "default" : "secondary"}>
                {questionnaire.is_active ? "Ativa" : "Inativa"}
              </Badge>
            </div>
            {questionnaire.description && (
              <p className="text-muted-foreground mt-2">{questionnaire.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              URL: /survey/{questionnaire.slug || questionnaire.id}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={responses.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileText className="w-4 h-4 mr-2" />
              Excel (.xlsx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV}>
              <FileText className="w-4 h-4 mr-2" />
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Score NPS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{npsData.score}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {npsData.score > 50 ? "Excelente" : npsData.score > 0 ? "Bom" : "Precisa melhorar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Promotores</CardTitle>
            <Users className="h-4 w-4 text-nps-promoter" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nps-promoter">{npsData.promoters}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {npsData.total > 0 ? Math.round((npsData.promoters / npsData.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Neutros</CardTitle>
            <Users className="h-4 w-4 text-nps-neutral" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nps-neutral">{npsData.neutrals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {npsData.total > 0 ? Math.round((npsData.neutrals / npsData.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Detratores</CardTitle>
            <Users className="h-4 w-4 text-nps-detractor" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-nps-detractor">{npsData.detractors}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {npsData.total > 0 ? Math.round((npsData.detractors / npsData.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <NPSDistributionChart
          promoters={npsData.promoters}
          neutrals={npsData.neutrals}
          detractors={npsData.detractors}
        />
        <NPSTimelineChart responses={responses} />
      </div>

      {/* QR Code */}
      <div className="grid gap-6 md:grid-cols-2">
        <QRCodeGenerator
          questionnaireId={questionnaire.id}
          questionnaireTitle={questionnaire.title}
          slug={questionnaire.slug}
        />
      </div>

      {/* Responses List */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Recentes ({responses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma resposta ainda
              </div>
            ) : (
              responses.slice(0, 10).map((response) => (
                <Card 
                  key={response.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={async () => {
                    // Buscar dados completos da resposta com relacionamentos
                    const { data, error } = await supabase
                      .from("survey_responses")
                      .select(`
                        *,
                        questionnaire:questionnaires(title),
                        survey_answers:answers(
                          answer_value,
                          question:questions(question_text, question_type)
                        )
                      `)
                      .eq("id", response.id)
                      .single();

                    if (error) {
                      toast.error("Erro ao carregar detalhes");
                      return;
                    }

                    setSelectedResponse(data);
                    setDetailsModalOpen(true);
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Data</p>
                        <p className="font-medium">{new Date(response.created_at).toLocaleString("pt-BR")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-medium">{response.full_name || "Anônimo"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Produto</p>
                        <p className="font-medium">{response.product}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Serviço</p>
                        <p className="font-medium">{response.service}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Score NPS</p>
                        <p
                          className={`text-2xl font-bold ${
                            response.nps_score >= 9
                              ? "text-nps-promoter"
                              : response.nps_score >= 7
                              ? "text-nps-neutral"
                              : "text-nps-detractor"
                          }`}
                        >
                          {response.nps_score}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response Details Modal */}
      <ResponseDetailsModal
        response={selectedResponse}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedResponse(null);
        }}
      />
    </div>
  );
};
