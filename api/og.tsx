// @jsxRuntime automatic
// @jsxImportSource react
import { ImageResponse } from '@vercel/og';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatPeriod(period: string): string {
  const year = period.slice(0, 4);
  const month = parseInt(period.slice(4, 6), 10) - 1;
  return `${MONTHS[month] ?? period.slice(4, 6)} ${year}`;
}

function formatARS(value: number): string {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
}

function formatCuit(cuit: string): string {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

interface Entidad {
  monto: number;
  situacion: number;
}

interface Periodo {
  periodo: string;
  entidades: Entidad[];
}

interface BCRAResponse {
  status: number;
  results: {
    denominacion: string;
    periodos: Periodo[];
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cuit = (typeof req.query.cuit === 'string' ? req.query.cuit : '')?.replace(/-/g, '');

  if (!cuit || !/^\d{11}$/.test(cuit)) {
    return res.status(400).send('Missing or invalid cuit');
  }

  let denominacion = '';
  let latestPeriod = '';
  let totalDebt = 0;
  let hasDebt = false;
  let worstSituation = 1;

  try {
    const apiRes = await fetch(`https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/Historicas/${cuit}`);
    if (apiRes.ok) {
      const data: BCRAResponse = await apiRes.json();
      const r = data.results;
      if (r && r.periodos.length > 0) {
        hasDebt = true;
        denominacion = r.denominacion;
        const sorted = [...r.periodos].sort((a, b) => b.periodo.localeCompare(a.periodo));
        const latest = sorted[0]!;
        latestPeriod = formatPeriod(latest.periodo);
        totalDebt = latest.entidades.reduce((sum, e) => sum + e.monto * 1000, 0);
        worstSituation = Math.max(...latest.entidades.map(e => e.situacion));
      }
    }
  } catch {
    // fall through — will show fallback card
  }

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          color: '#f1f5f9',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#64748b', marginBottom: 16 }}>
          deudas.ar
        </div>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, marginBottom: 24 }}>
          {denominacion || formatCuit(cuit)}
        </div>
        {denominacion && (
          <div style={{ display: 'flex', fontSize: 30, color: '#94a3b8', marginBottom: 32 }}>
            CUIT {formatCuit(cuit)}
          </div>
        )}
        {hasDebt ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 'auto' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 28, color: '#94a3b8' }}>Deuda total</span>
              <span style={{ fontSize: 42, fontWeight: 700, color: '#f87171' }}>{formatARS(totalDebt)}</span>
              <span style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 600,
                padding: '6px 16px',
                borderRadius: 9999,
                backgroundColor: worstSituation >= 2 ? '#7f1d1d' : '#14532d',
                color: worstSituation >= 2 ? '#fca5a5' : '#86efac',
                marginLeft: 12,
              }}>
                {worstSituation >= 2 ? 'Irregular' : 'Normal'}
              </span>
            </div>
            <div style={{ display: 'flex', fontSize: 24, color: '#64748b' }}>
              {latestPeriod}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 32, color: '#4ade80', marginTop: 'auto' }}>
            Sin deuda registrada
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.send(buffer);
}
