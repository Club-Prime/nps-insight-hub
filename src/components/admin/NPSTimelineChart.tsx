import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineChartProps {
  responses: any[];
}

export const NPSTimelineChart = ({ responses }: TimelineChartProps) => {
  // Process data for last 30 days
  const processTimelineData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i));
      return {
        date: format(date, "dd/MMM", { locale: ptBR }),
        fullDate: date,
        promoters: 0,
        neutrals: 0,
        detractors: 0,
        total: 0,
        nps: 0,
      };
    });

    responses.forEach((response) => {
      const responseDate = startOfDay(parseISO(response.created_at));
      const dayData = last30Days.find(
        (day) => day.fullDate.getTime() === responseDate.getTime()
      );

      if (dayData) {
        dayData.total++;
        if (response.nps_score >= 9) {
          dayData.promoters++;
        } else if (response.nps_score >= 7) {
          dayData.neutrals++;
        } else {
          dayData.detractors++;
        }
      }
    });

    // Calculate NPS for each day
    last30Days.forEach((day) => {
      if (day.total > 0) {
        day.nps = Math.round(((day.promoters - day.detractors) / day.total) * 100);
      }
    });

    return last30Days;
  };

  const data = processTimelineData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <p className="text-nps-promoter">Promotores: {dayData.promoters}</p>
            <p className="text-nps-neutral">Neutros: {dayData.neutrals}</p>
            <p className="text-nps-detractor">Detratores: {dayData.detractors}</p>
            <p className="font-bold mt-2">NPS: {dayData.nps}</p>
            <p className="text-muted-foreground">Total: {dayData.total}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = responses.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do NPS (Últimos 30 Dias)</CardTitle>
        <CardDescription>Acompanhe a tendência do seu score ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Nenhuma resposta nos últimos 30 dias</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickMargin={10}
                domain={[-100, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: "10px" }}
              />
              <Line
                type="monotone"
                dataKey="nps"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
                name="Score NPS"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
