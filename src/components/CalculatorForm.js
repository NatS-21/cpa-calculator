import React, { useState } from 'react';

function CalculatorForm({ onCalculate }) {
  // Состояние для полей ввода
  const [sku, setSku] = useState('');
  const [safetyDays, setSafetyDays] = useState(0);
  const [leadTime, setLeadTime] = useState(0);
  const [maPeriod, setMaPeriod] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика обработки отправки формы
    console.log('Форма отправлена', { sku, safetyDays, leadTime, maPeriod });
    // Вызываем пропс onCalculate и передаем ему текущие значения формы
    if (onCalculate) {
      onCalculate({ sku, safetyDays, leadTime, maPeriod });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          id="sku"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="safetyDays">Safety Days:</label>
        <input
          type="number"
          id="safetyDays"
          value={safetyDays}
          onChange={(e) => setSafetyDays(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="leadTime">Lead Time:</label>
        <input
          type="number"
          id="leadTime"
          value={leadTime}
          onChange={(e) => setLeadTime(Number(e.target.value))}
        />
      </div>
       <div>
        <label htmlFor="maPeriod">MA Period (n):</label>
        <input
          type="number"
          id="maPeriod"
          value={maPeriod}
          onChange={(e) => setMaPeriod(Number(e.target.value))}
        />
      </div>
      <button type="submit">Рассчитать и прогнозировать</button>
    </form>
  );
}

export default CalculatorForm; 