import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, TrendingUp, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import logoBlack from "@/assets/logo-black.png";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<any[]>([]);
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
      const { data, error } = await supabase
        .from("survey_responses")
        .select(`
          *,
          answers (
            *,
            questions (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResponses(data || []);
      calculateNPS(data || []);
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

    const promoters = data.filter(r => r.nps_score >= 9).length;
    const neutrals = data.filter(r => r.nps_score >= 7 && r.nps_score <= 8).length;
    const detractors = data.filter(r => r.nps_score <= 6).length;
    const total = data.length;

    const score = Math.round(((promoters - detractors) / total) * 100);

    setNpsData({ score, promoters, neutrals, detractors, total });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const exportToCSV = () => {
    const headers = ["Data", "CPF", "Nome", "Produto", "Serviço", "NPS"];
    const rows = responses.map(r => [
      new Date(r.created_at).toLocaleDateString(),
      r.cpf,
      r.full_name,
      r.product,
      r.service,
      r.nps_score,
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `respostas_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

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
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="responses">Respostas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Respostas NPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Promotores (9-10)</span>
                      <span className="font-bold">{npsData.promoters}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-nps-promoter h-3 rounded-full transition-all"
                        style={{ width: `${npsData.total > 0 ? (npsData.promoters / npsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Neutros (7-8)</span>
                      <span className="font-bold">{npsData.neutrals}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-nps-neutral h-3 rounded-full transition-all"
                        style={{ width: `${npsData.total > 0 ? (npsData.neutrals / npsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Detratores (0-6)</span>
                      <span className="font-bold">{npsData.detractors}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-nps-detractor h-3 rounded-full transition-all"
                        style={{ width: `${npsData.total > 0 ? (npsData.detractors / npsData.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Todas as Respostas ({responses.length})</h2>
              <Button onClick={exportToCSV} disabled={responses.length === 0}>
                <FileText className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            <div className="space-y-4">
              {responses.map((response) => (
                <Card key={response.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Data</p>
                        <p className="font-medium">{new Date(response.created_at).toLocaleString()}</p>
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
                        <p className={`text-2xl font-bold ${
                          response.nps_score >= 9 ? "text-nps-promoter" :
                          response.nps_score >= 7 ? "text-nps-neutral" :
                          "text-nps-detractor"
                        }`}>
                          {response.nps_score}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
