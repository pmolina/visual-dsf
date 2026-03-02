const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export function formatPeriod(period: string): string {
  // period = "202512" → "Dic 2025"
  const year = period.slice(0, 4);
  const month = parseInt(period.slice(4, 6), 10) - 1;
  return `${MONTHS[month] ?? period.slice(4, 6)} ${year}`;
}
