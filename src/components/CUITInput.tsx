import { useState } from 'react';
import { validateCuit } from '../utils/cuit';

interface Props {
  onSubmit: (cuits: string[]) => void;
  loading: boolean;
  initialValue?: string;
}

export function CUITInput({ onSubmit, loading, initialValue = '' }: Props) {
  const [value, setValue] = useState(() => initialValue.split(/[\n,]/)[0]?.trim() ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cuit = value.replace(/-/g, '').trim();

    if (!cuit) {
      setError('Ingresá un CUIT.');
      return;
    }
    if (!validateCuit(cuit)) {
      setError(`CUIT inválido: ${value.trim()}`);
      return;
    }

    setError('');
    onSubmit([cuit]);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        CUIT / CUIL{' '}
        <span className="text-gray-400 dark:text-gray-500 font-normal">(con o sin guiones)</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          placeholder="20-18413955-4"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shrink-0"
        >
          {loading ? 'Consultando…' : 'Consultar'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </form>
  );
}
