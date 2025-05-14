import React, { useState } from 'react';
import './App.css';
import CalculatorForm from './components/CalculatorForm';
import ChartDisplay from './components/ChartDisplay';
import { calculateMovingAverage, calculateRecommended } from './utils/forecast';
import { fetchHistoricalData } from './api/orderService';

function App() {
  const [historicalData, setHistoricalData] = useState([]);
  const [maForecasts, setMaForecasts] = useState([]);
  const [recommended, setRecommended] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const handleCalculation = async ({ sku, safetyDays, leadTime, maPeriod }) => {
    // 1. Получить исторические данные
    const data = await fetchHistoricalData(sku);
    setHistoricalData(data);

    // 2. Рассчитать скользящее среднее
    const maResults = calculateMovingAverage(data, maPeriod);
    setMaForecasts(maResults);

    // 3. Рассчитать recommended
    // Для dailyAvg возьмем среднее последних N значений (период MA) или просто среднее всех данных
    // Давайте возьмем среднее последних 'maPeriod' дней, если доступно, иначе среднее всех данных
    const dailyAvg = maResults.length > 0 ? maResults[maResults.length - 1] : (data.reduce((sum, val) => sum + val, 0) / data.length || 0);
    const recommendedValue = calculateRecommended(dailyAvg, leadTime, safetyDays);
    setRecommended(recommendedValue);

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
        <div style={{ width: '80%', margin: '20px auto' }}>
          <ChartDisplay data={chartData} options={chartOptions} />
          <h2>Рекомендуемое количество для заказа: {recommended}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
