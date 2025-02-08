export const generateMockData = (totalItems = 300) => {
  const banks = ['Сбербанк', 'Тинькофф', 'Альфа-Банк', 'ВТБ', 'Точка'];
  const articles = [
    'Закупочная стоимость',
    'Заработная плата',
    'Вывод частичной прибыли',
    'Займы расход',
  ];
  const contragents = [
    'ООО "Ромашка"',
    'ИП Иванов',
    'ЗАО "ТехИнвест"',
    'АО "СибЭнерго"',
  ];
  const categories = [
    'Операционные расходы',
    'Зарплата',
    'Финансовые операции',
  ];

  return Array.from({ length: totalItems }, (_, i) => {
    const amount = (Math.random() * 1000000).toFixed(2);
    const expenditureAmount =
      Math.random() < 0.3 ? '0.00' : Math.min(amount, amount * 0.6).toFixed(2);

    return {
      id: i,
      account: `40817810${Math.floor(100000000 + Math.random() * 900000000)}`,
      bank: banks[i % banks.length],
      account_number: `40702810${Math.floor(
        100000000 + Math.random() * 900000000
      )}`,
      article: Math.random() < 0.5 ? '' : articles[i % articles.length],
      executed: new Date(
        Math.floor(Math.random() * (2025 - 2022 + 1)) + 2022,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString(),
      category: categories[i % categories.length],
      amount,
      expenditureAmount,
      contragentName: contragents[i % contragents.length],
      paymentPurpose: `Оплата по договору №${i + 1}`,
      tags: ['важный', 'срочный'].slice(0, Math.floor(Math.random() * 2) + 1),
    };
  });
};
