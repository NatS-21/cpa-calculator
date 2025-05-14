import axios from 'axios';

// В реальном приложении здесь была бы логика вызова API
// Например, async function fetchHistoricalData(sku) { ... }

export const fetchHistoricalData = async (sku) => {
  console.log(`Fetching historical data for SKU: ${sku}`);
  // Заглушка: возвращаем тестовые данные
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        10, 12, 15, 11, 13, 14, 16, 18, 17, 19,
        20, 22, 21, 23, 25, 24, 26, 28, 27, 29,
        30, 31, 33, 32, 34, 36, 35, 37, 39, 38
      ]);
    }, 500);
  });
}; 