import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  TrendingUp,
  Users,
  FileText,
  Download,
  Plus,
  Edit,
  Eye,
  QrCode as QrCodeIcon,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import logoBlack from "@/assets/logo-black.png";
import { NPSDistributionChart } from "@/components/admin/NPSDistributionChart";
import { NPSTimelineChart } from "@/components/admin/NPSTimelineChart";
import { QuestionnaireEditor } from "@/components/admin/QuestionnaireEditor";
import { QuestionnaireDetailView } from "@/components/admin/QuestionnaireDetailView";
import { exportToExcel, exportToCSV } from "@/utils/exportData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");
  const [npsData, setNpsData] = useState({
    score: 0,
    promoters: 0,
    neutrals: 0,
    detractors: 0,
    total: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch questionnaires
      const { data: qData, error: qError } = await supabase
        .from("questionnaires")
        .select("*, questions(*)")
        .order("created_at", { ascending: false });

      if (qError) throw qError;
      setQuestionnaires(qData || []);

      // Fetch all responses
      const { data: rData, error: rError } = await supabase
        .from("survey_responses")
        .select(`
          *,
          answers (
            *,
            questions (*)
          )
        `)
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleExportExcel = () => {
    exportToExcel({ responses });
    toast.success("Relatório Excel exportado!");
  };

  const handleExportCSV = () => {
    exportToCSV(responses);
    toast.success("Arquivo CSV exportado!");
  };

  const handleCreateQuestionnaire = () => {
    setEditingQuestionnaire(null);
    setEditorOpen(true);
  };

  const handleEditQuestionnaire = async (questionnaire: any) => {
    // Fetch with questions
    const { data, error } = await supabase
      .from("questionnaires")
      .select("*, questions(*)")
      .eq("id", questionnaire.id)
      .single();

    if (error) {
      toast.error("Erro ao carregar pesquisa");
      return;
    }

    setEditingQuestionnaire(data);
    setEditorOpen(true);
  };

  const handleToggleActive = async (questionnaire: any) => {
    try {
      const { error } = await supabase
        .from("questionnaires")
        .update({ is_active: !questionnaire.is_active })
        .eq("id", questionnaire.id);

      if (error) throw error;
      toast.success(questionnaire.is_active ? "Pesquisa desativada" : "Pesquisa ativada");
      fetchData();
    } catch (error) {
      toast.error("Erro ao atualizar pesquisa");
    }
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    try {
      const { error } = await supabase.from("questionnaires").delete().eq("id", id);

      if (error) throw error;
      toast.success("Pesquisa excluída");
      setDeleteDialog(null);
      fetchData();
    } catch (error) {
      toast.error("Erro ao excluir pesquisa");
    }
  };

  const handleViewDetail = (questionnaire: any) => {
    setSelectedQuestionnaire(questionnaire);
    setViewMode("detail");
  };

  if (viewMode === "detail" && selectedQuestionnaire) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoBlack} alt="GO HEALTH" className="h-12" />
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <QuestionnaireDetailView
            questionnaireId={selectedQuestionnaire.id}
            onBack={() => {
              setViewMode("overview");
              setSelectedQuestionnaire(null);
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoBlack} alt="GO HEALTH" className="h-12" />
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="questionnaires">Pesquisas</TabsTrigger>
            <TabsTrigger value="responses">Todas as Respostas</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB - Dashboard Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Score NPS Geral</CardTitle>
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

            <div className="grid gap-6 md:grid-cols-2">
              <NPSDistributionChart
                promoters={npsData.promoters}
                neutrals={npsData.neutrals}
                detractors={npsData.detractors}
              />
              <NPSTimelineChart responses={responses} />
            </div>
          </TabsContent>

          {/* QUESTIONNAIRES TAB - Gerenciamento de Pesquisas */}
          <TabsContent value="questionnaires" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gerenciar Pesquisas</h2>
                <p className="text-muted-foreground">Crie, edite e visualize suas pesquisas de satisfação</p>
              </div>
              <Button onClick={handleCreateQuestionnaire}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Pesquisa
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {questionnaires.map((questionnaire) => {
                const responseCount = responses.filter(
                  (r) => r.questionnaire_id === questionnaire.id
                ).length;

                return (
                  <Card key={questionnaire.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg">{questionnaire.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {questionnaire.description || "Sem descrição"}
                          </CardDescription>
                        </div>
                        <Badge variant={questionnaire.is_active ? "default" : "secondary"}>
                          {questionnaire.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Respostas</p>
                          <p className="font-semibold">{responseCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Perguntas</p>
                          <p className="font-semibold">{questionnaire.questions?.length || 0}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleViewDetail(questionnaire)} size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">•••</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditQuestionnaire(questionnaire)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(questionnaire)}>
                              {questionnaire.is_active ? (
                                <>
                                  <ToggleLeft className="w-4 h-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-4 h-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteDialog(questionnaire)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {questionnaires.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <QrCodeIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma pesquisa criada</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie sua primeira pesquisa para começar a coletar feedback
                    </p>
                    <Button onClick={handleCreateQuestionnaire}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Pesquisa
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* RESPONSES TAB - Todas as Respostas */}
          <TabsContent value="responses" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Todas as Respostas ({responses.length})</h2>
                <p className="text-muted-foreground">Consolidado de todas as pesquisas</p>
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

            <div className="space-y-4">
              {responses.map((response) => {
                const questionnaire = questionnaires.find((q) => q.id === response.questionnaire_id);
                return (
                  <Card key={response.id}>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Pesquisa</p>
                          <p className="font-medium">{questionnaire?.title || "Desconhecida"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Data</p>
                          <p className="font-medium">{new Date(response.created_at).toLocaleString("pt-BR")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nome</p>
                          <p className="font-medium">{response.full_name}</p>
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
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Editor Dialog */}
      <QuestionnaireEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        questionnaire={editingQuestionnaire}
        onSuccess={() => {
          fetchData();
          setEditorOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a pesquisa "{deleteDialog?.title}"? Esta ação não pode ser desfeita e
              todas as respostas associadas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteQuestionnaire(deleteDialog?.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
