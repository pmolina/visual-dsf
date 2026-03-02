export interface Entidad {
  entidad: string;
  situacion: number;    // 1=Normal, 2+=Problematic
  monto: number;        // in thousands of AR$
  enRevision: boolean;
  procesoJud: boolean;
}

export interface Periodo {
  periodo: string;      // "202512"
  entidades: Entidad[];
}

export interface BCRAResult {
  identificacion: number;
  denominacion: string;
  periodos: Periodo[];
}

export interface BCRAResponse {
  status: number;
  results: BCRAResult;
}

export type ResultState =
  | { status: 'loading' }
  | { status: 'success'; data: BCRAResult }
  | { status: 'error'; message: string }
  | { status: 'empty' };
