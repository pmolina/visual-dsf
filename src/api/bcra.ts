import type { BCRAResponse } from '../types/bcra';

const BASE = 'https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/Historicas';

export async function fetchDebtHistory(cuit: string): Promise<BCRAResponse> {
  const res = await fetch(`${BASE}/${cuit}`);
  if (res.status === 404) throw new Error('CUIT sin deuda registrada');
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<BCRAResponse>;
}
