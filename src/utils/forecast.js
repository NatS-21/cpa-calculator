// Функция для расчета скользящего среднего (MA)
// historicalData: массив чисел, представляющих исторические продажи/потребность
// period: период для скользящего среднего (n)
export const calculateMovingAverage = (historicalData, period) => {
  if (!historicalData || historicalData.length === 0 || period <= 0) {
    return [];
  }

  const maForecasts = [];

  // MA for time t is the average of data from t-1 to t-period
  for (let i = period - 1; i < historicalData.length; i++) {
    const window = historicalData.slice(i - period + 1, i + 1);
    const sum = window.reduce((acc, val) => acc + val, 0);
    const average = sum / period;
    maForecasts.push(average);
  }

   // Для прогноза будущих периодов, можно просто повторять последнее рассчитанное MA
   // Или рассчитать следующее MA, если есть достаточно данных (что уже покрыто циклом выше)
   // Для простоты, вернем массив прогнозов, соответствующих концу каждого периода.
   // Если нужен прогноз на один период вперед, используем последнее значение.

  return maForecasts;
};

// Функция для расчета recommended
// dailyAvg: среднее дневное потребление/продажи
// leadTime: время выполнения заказа (в днях)
// safetyDays: дни страхового запаса
export const calculateRecommended = (dailyAvg, leadTime, safetyDays) => {
  if (dailyAvg < 0 || leadTime < 0 || safetyDays < 0) {
      return 0; // Или другая обработка ошибок
  }
  const recommended = Math.round(dailyAvg * (leadTime + safetyDays));
  return recommended;
}; 