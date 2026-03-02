const MULTIPLIERS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

export function validateCuit(raw: string): boolean {
  const digits = raw.replace(/[-\s]/g, '');
  if (!/^\d{11}$/.test(digits)) return false;
  const nums = digits.split('').map(Number);
  const sum = MULTIPLIERS.reduce((acc, m, i) => acc + m * nums[i]!, 0);
  const remainder = sum % 11;
  if (remainder === 1) return false; // no valid CUIT produces remainder 1
  const check = remainder === 0 ? 0 : 11 - remainder;
  return nums[10] === check;
}

export function parseCuits(input: string): string[] {
  return input
    .split(/[\n,\s]+/)
    .map(c => c.replace(/-/g, '').trim())
    .filter(Boolean);
}
