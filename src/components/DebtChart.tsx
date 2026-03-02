import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Periodo } from '../types/bcra';
import { formatPeriod } from '../utils/format';
import { getEntityColor } from '../utils/colors';

interface Props {
  periodos: Periodo[];
}

function formatARS(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

interface BarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: Record<string, unknown>;
}

function makeBarShape(entityName: string) {
  return function CustomBar(rawProps: unknown): React.ReactElement {
    const { x = 0, y = 0, width = 0, height = 0, fill, payload } = rawProps as BarShapeProps;
    if (!width || !height || height < 0) return <g />;
    const problemEntities = payload?._problemEntities as Set<string> | undefined;
    const isProblem = problemEntities?.has(entityName) ?? false;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} />
        {isProblem && (
          <line
            x1={x + width - 1}
            y1={y}
            x2={x + width - 1}
            y2={y + height}
            stroke="rgb(239,68,68)"
            strokeWidth={3}
          />
        )}
      </g>
    );
  };
}

export function DebtChart({ periodos }: Props) {
  // Sort old→new
  const sorted = [...periodos].sort((a, b) => a.periodo.localeCompare(b.periodo));

  // Collect total debt per entity across all periods, then sort largest→smallest
  // (first in array = bottom of stack in Recharts)
  const entityTotals = new Map<string, number>();
  for (const p of sorted) {
    for (const e of p.entidades) {
      entityTotals.set(e.entidad, (entityTotals.get(e.entidad) ?? 0) + e.monto);
    }
  }
  const entityNames = Array.from(entityTotals.keys()).sort(
    (a, b) => (entityTotals.get(b) ?? 0) - (entityTotals.get(a) ?? 0)
  );

  // Build chart data — track which entities have situacion >= 2 per period
  const chartData = sorted.map(p => {
    const row: Record<string, unknown> = { period: formatPeriod(p.periodo) };
    const problemEntities = new Set<string>();
    for (const e of p.entidades) {
      row[e.entidad] = ((row[e.entidad] as number) || 0) + e.monto * 1000;
      if (e.situacion >= 2) problemEntities.add(e.entidad);
    }
    row._problemEntities = problemEntities;
    return row;
  });

  const chartHeight = Math.max(280, Math.min(700, entityNames.length * 22 + 140));

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={formatARS}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatARS(value), name]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid rgba(128,128,128,0.2)',
          }}
        />
        {entityNames.length > 1 && (
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        )}
        {entityNames.map(name => (
          <Bar
            key={name}
            dataKey={name}
            stackId="a"
            fill={getEntityColor(name)}
            shape={makeBarShape(name)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
