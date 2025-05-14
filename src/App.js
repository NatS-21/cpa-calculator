import React, { useState } from 'react';
import './App.css';
import CalculatorForm from './components/CalculatorForm';
import ChartDisplay from './components/ChartDisplay';
import { calculateMovingAverage, calculateRecommended, calculateExponentialSmoothing } from './utils/forecast';
import { fetchHistoricalData } from './api/orderService';

function App() {
  const [historicalData, setHistoricalData] = useState([]);
  const [maForecasts, setMaForecasts] = useState([]);
  const [esForecasts, setEsForecasts] = useState([]);
  const [recommended, setRecommended] = useState(0);
  const [recommendedES, setRecommendedES] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const handleCalculation = async ({ sku, safetyDays, leadTime, maPeriod, alpha }) => {
    // 1. Получить исторические данные
    const data = await fetchHistoricalData(sku);
    setHistoricalData(data);

    // 2. Рассчитать скользящее среднее
    const maResults = calculateMovingAverage(data, maPeriod);
    setMaForecasts(maResults);

    // 2a. Рассчитать экспоненциальное сглаживание
    const esResults = calculateExponentialSmoothing(data, alpha);
    setEsForecasts(esResults);

    // 3. Рассчитать recommended для MA
    const dailyAvgMA = maResults.length > 0 ? maResults[maResults.length - 1] : (data.reduce((sum, val) => sum + val, 0) / data.length || 0);
    const recommendedValueMA = calculateRecommended(dailyAvgMA, leadTime, safetyDays);
    setRecommended(recommendedValueMA);

    // 3a. Рассчитать recommended для ES
    const dailyAvgES = esResults.length > 0 ? esResults[esResults.length - 1] : (data.reduce((sum, val) => sum + val, 0) / data.length || 0);
    const recommendedValueES = calculateRecommended(dailyAvgES, leadTime, safetyDays);
    setRecommendedES(recommendedValueES);

    // 4. Подготовить данные для графика
    const labels = data.map((_, index) => `День ${index + 1}`);
    const chartDatasets = [
      {
        label: 'Исторические данные',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: `MA (${maPeriod} дней)`,
        // Смещаем прогноз MA, так как MA_t рассчитывается на основе данных до t-1.
        // В нашем calculateMovingAverage, MA[i] - это прогноз для дня i+1.
        // Прогноз MA начинается только после первых 'maPeriod - 1' дней
        data: Array(maPeriod - 1).fill(null).concat(maResults),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: `ES (alpha=${alpha})`,
        // Прогноз ES на период t+1 это S_t. S_t рассчитывается на основе данных до t.
        // esForecasts[i] это S_{i+1} (прогноз на период i+1)
        data: esResults.map((val, index) => index === 0 ? null : val), // ES[0] - это S_0 = demand_0, прогноз на период 1. На графике смещаем на 1 день для наглядности.
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ];

    setChartData({
      labels: labels,
      datasets: chartDatasets,
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Прогноз продаж / потребления',
      },
    },
  };

  return (
    <div className="App">
      <h1>Калькулятор запасов</h1>
      <CalculatorForm onCalculate={handleCalculation} />
      {historicalData.length > 0 && (
        <div style={{ width: '80%', margin: '20px auto' }} className="chart-container">
          <ChartDisplay data={chartData} options={chartOptions} />
          <h2 className="recommended-value">Рекомендуемое количество для заказа (MA): {recommended}</h2>
          <h2 className="recommended-value">Рекомендуемое количество для заказа (ES): {recommendedES}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
