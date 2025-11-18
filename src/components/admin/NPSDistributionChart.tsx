import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface NPSDistributionChartProps {
  promoters: number;
  neutrals: number;
  detractors: number;
}

export const NPSDistributionChart = ({ promoters, neutrals, detractors }: NPSDistributionChartProps) => {
  const data = [
    { name: "Promotores (9-10)", value: promoters, percentage: 0 },
    { name: "Neutros (7-8)", value: neutrals, percentage: 0 },
    { name: "Detratores (0-6)", value: detractors, percentage: 0 },
  ];

  const total = promoters + neutrals + detractors;
  
  // Calculate percentages
  data.forEach(item => {
    item.percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
  });

  // Colors matching the theme
  const COLORS = [
    "hsl(142, 76%, 36%)", // nps-promoter (green)
    "hsl(45, 93%, 47%)",  // nps-neutral (yellow)
    "hsl(0, 84%, 60%)",   // nps-detractor (red)
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} respostas ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição NPS</CardTitle>
          <CardDescription>Visualização das categorias de respondentes</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhuma resposta ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição NPS</CardTitle>
        <CardDescription>Visualização das categorias de respondentes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
