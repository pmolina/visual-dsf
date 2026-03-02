import type { ResultState } from '../types/bcra';
import { DebtChart } from './DebtChart';

interface Props {
  cuit: string;
  state: ResultState;
}

function formatCuit(cuit: string): string {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

export function ResultCard({ cuit, state }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{formatCuit(cuit)}</p>
          {state.status === 'success' && (
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">
              {state.data.denominacion}
            </p>
          )}
        </div>
        {state.status === 'success' && (() => {
          const lastPeriodo = state.data.periodos.reduce((a, b) =>
            a.periodo > b.periodo ? a : b
          );
          const hasProblematic = lastPeriodo.entidades.some(e => e.situacion >= 2);
          return hasProblematic ? (
            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full">
              Situación irregular
            </span>
          ) : (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Situación normal
            </span>
          );
        })()}
      </div>
      <div className="p-4">
        {state.status === 'loading' && (
          <div className="flex items-center justify-center h-32 gap-2 text-gray-400 dark:text-gray-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Consultando BCRA…</span>
          </div>
        )}
        {state.status === 'error' && (
          <div className="flex items-center justify-center h-32 text-red-500 dark:text-red-400 text-sm">
            {state.message}
          </div>
        )}
        {state.status === 'empty' && (
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
            Sin deuda registrada en el BCRA
          </div>
        )}
        {state.status === 'success' && (
          state.data.periodos.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
              Sin períodos con deuda
            </div>
          ) : (
            <DebtChart periodos={state.data.periodos} />
          )
        )}
      </div>
    </div>
  );
}
