import { TransacaoFinanceira } from '@/hooks/useSupabaseFinanceiro'

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  name: string;
  vendas: number;
  gastos: number;
  lucro: number;
}

export function processFinancialDataForCharts(transacoes: TransacaoFinanceira[]) {
  // Dados mockados para demonstração - pode ser substituído por lógica real
  const vendasMensais: TimeSeriesData[] = [
    { name: 'Jan', vendas: 4000, gastos: 2400, lucro: 1600 },
    { name: 'Fev', vendas: 3000, gastos: 1398, lucro: 1602 },
    { name: 'Mar', vendas: 2000, gastos: 2800, lucro: -800 },
    { name: 'Abr', vendas: 2780, gastos: 3908, lucro: -1128 },
    { name: 'Mai', vendas: 1890, gastos: 4800, lucro: -2910 },
    { name: 'Jun', vendas: 2390, gastos: 3800, lucro: -1410 },
  ];

  const gastosCategoria: ChartData[] = [
    { name: 'Ingredientes', value: 30, color: '#8884d8' },
    { name: 'Embalagens', value: 25, color: '#82ca9d' },
    { name: 'Equipamentos', value: 20, color: '#ffc658' },
    { name: 'Marketing', value: 15, color: '#ff7300' },
    { name: 'Outros', value: 10, color: '#0088FE' },
  ];

  const receitasPopulares: ChartData[] = [
    { name: 'Bolos', value: 4000 },
    { name: 'Docinhos', value: 3000 },
    { name: 'Tortas', value: 2000 },
    { name: 'Cupcakes', value: 2780 },
    { name: 'Salgados', value: 1890 },
  ];

  const crescimentoMensal: ChartData[] = [
    { name: 'Jan', value: 12 },
    { name: 'Fev', value: 15 },
    { name: 'Mar', value: -8 },
    { name: 'Abr', value: 18 },
    { name: 'Mai', value: 22 },
    { name: 'Jun', value: 28 },
  ];

  return {
    vendasMensais,
    gastosCategoria,
    receitasPopulares,
    crescimentoMensal
  };
}