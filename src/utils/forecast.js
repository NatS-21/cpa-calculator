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

// Функция для расчета экспоненциального сглаживания (ES)
// historicalData: массив чисел, представляющих исторические продажи/потребность
// alpha: коэффициент сглаживания (0 < alpha <= 1)
export const calculateExponentialSmoothing = (historicalData, alpha) => {
  if (!historicalData || historicalData.length === 0 || alpha <= 0 || alpha > 1) {
    return [];
  }

  const esForecasts = [];
  // Инициализация S_0. Часто используется S_0 = demand_0
  let St_minus_1 = historicalData[0];

  // Прогноз для первого периода (делается в конце периода 0, используя данные периода 0)
  // В цикле ниже S_t будет рассчитан в конце периода t, используя demand_t и S_{t-1}
  // Таким образом, esForecasts[t] будет прогнозом для периода t+1.
  // Для согласованности с MA, где MA[i] - прогноз на i+1, добавим первый элемент.
   esForecasts.push(St_minus_1); // S_1 прогноз для периода 1 (используя S_0 = demand_0)

  for (let t = 1; t < historicalData.length; t++) {
    const demand_t = historicalData[t];
    const St = alpha * demand_t + (1 - alpha) * St_minus_1;
    esForecasts.push(St);
    St_minus_1 = St; // S_t становится S_{t-1} для следующей итерации
  }

  return esForecasts;
}; 