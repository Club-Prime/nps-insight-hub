import * as XLSX from "xlsx";

interface ExportData {
  responses: any[];
  questionnaire?: any;
}

export const exportToExcel = ({ responses, questionnaire }: ExportData) => {
  if (responses.length === 0) {
    return;
  }

  // Prepare data for export
  const exportData = responses.map((response) => {
    const baseData = {
      "Data": new Date(response.created_at).toLocaleString("pt-BR"),
      "CPF": response.cpf,
      "Nome": response.full_name,
      "Produto": response.product,
      "Serviço": response.service,
      "Score NPS": response.nps_score,
      "Categoria": response.nps_score >= 9 
        ? "Promotor" 
        : response.nps_score >= 7 
        ? "Neutro" 
        : "Detrator",
    };

    // Add answers to additional questions
    if (response.answers && response.answers.length > 0) {
      response.answers.forEach((answer: any) => {
        if (answer.questions) {
          baseData[answer.questions.question_text] = answer.answer_value;
        }
      });
    }

    return baseData;
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add main responses sheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  const maxWidth = 50;
  const wscols = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.min(
      Math.max(
        key.length,
        ...exportData.map((row) => String(row[key] || "").length)
      ),
      maxWidth
    ),
  }));
  ws["!cols"] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, "Respostas");

  // Add summary sheet
  const totalResponses = responses.length;
  const promoters = responses.filter((r) => r.nps_score >= 9).length;
  const neutrals = responses.filter((r) => r.nps_score >= 7 && r.nps_score <= 8).length;
  const detractors = responses.filter((r) => r.nps_score <= 6).length;
  const npsScore = Math.round(((promoters - detractors) / totalResponses) * 100);

  const summaryData = [
    { "Métrica": "Total de Respostas", "Valor": totalResponses },
    { "Métrica": "Promotores (9-10)", "Valor": `${promoters} (${Math.round((promoters/totalResponses)*100)}%)` },
    { "Métrica": "Neutros (7-8)", "Valor": `${neutrals} (${Math.round((neutrals/totalResponses)*100)}%)` },
    { "Métrica": "Detratores (0-6)", "Valor": `${detractors} (${Math.round((detractors/totalResponses)*100)}%)` },
    { "Métrica": "Score NPS", "Valor": npsScore },
    { "Métrica": "Classificação", "Valor": npsScore > 50 ? "Excelente" : npsScore > 0 ? "Bom" : "Precisa Melhorar" },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 30 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");

  // Generate filename with timestamp
  const filename = `NPS_Relatorio_${new Date().toISOString().split("T")[0]}_${new Date().getTime()}.xlsx`;

  // Save file
  XLSX.writeFile(wb, filename);
};

export const exportToCSV = (responses: any[]) => {
  if (responses.length === 0) {
    return;
  }

  const headers = ["Data", "CPF", "Nome", "Produto", "Serviço", "NPS", "Categoria"];
  const rows = responses.map((r) => [
    new Date(r.created_at).toLocaleDateString("pt-BR"),
    r.cpf,
    r.full_name,
    r.product,
    r.service,
    r.nps_score,
    r.nps_score >= 9 ? "Promotor" : r.nps_score >= 7 ? "Neutro" : "Detrator",
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NPS_Respostas_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
