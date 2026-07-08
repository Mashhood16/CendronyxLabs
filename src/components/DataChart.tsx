import { useTranslate } from '../i18n';
import { useState, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, RotateCcw, Download, Database, Activity } from 'lucide-react';
import { addMeasurementNoise } from '../utils/measurementNoise';

export interface DataPoint {
  [key: string]: number | string;
}

export interface DataSerie {
  key: string;
  name: string;
  color: string;
}

interface DataChartProps {
  title: string;
  xAxisKey: string;
  xAxisLabel: string;
  series: DataSerie[];
  data: DataPoint[];
  onRecord: (noisedValues: DataPoint) => void;
  onReset: () => void;
  noisePercent?: number;
  noiseSeed?: number;
  recordLabel?: string;
  chartType?: 'line' | 'bar';
}

export default function DataChart({
  title,
  xAxisKey,
  xAxisLabel,
  series,
  data,
  onRecord,
  onReset,
  noisePercent = 2,
  noiseSeed = 42,
  recordLabel = 'Record Data Point',
  chartType = 'line',
}: DataChartProps) {
  const { t } = useTranslate();
  const seedRef = useRef(noiseSeed);

  const handleRecord = () => {
    const noisedValues: DataPoint = {};
    // Generate noised values for current time point
    series.forEach((s, i) => {
      const rawValue = data.length > 0 ? Number(data[data.length - 1][s.key]) : 0;
      // Use the seed for consistent noise at same time step
      const noise = addMeasurementNoise(rawValue || 0, seedRef.current + i, noisePercent);
      noisedValues[s.key] = parseFloat(noise.toFixed(2));
    });
    seedRef.current += 1;
    onRecord(noisedValues);
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = [xAxisKey, ...series.map(s => s.key)].join(',');
    const rows = data.map(d => {
      const vals = series.map(s => d[s.key] ?? 0);
      return [d[xAxisKey], ...vals].join(',');
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare chart data - extract displayed values
  const chartData = data.map((d, idx) => {
    const point: Record<string, number | string> = { [xAxisKey]: d[xAxisKey] };
    series.forEach(s => {
      point[s.name] = d[s.key] ?? 0;
    });
    return point;
  });

  const hasData = data.length > 0;

  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#1c1b1b] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c1b1b] flex items-center justify-between bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500" />
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200">{title}</h3>
          {hasData && (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {data.length} {t("pts")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {hasData && (
            <button
              onClick={handleExportCSV}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              title={t("Export CSV")}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            title={t("Clear Data")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4">
        <div className="h-48 bg-slate-50 dark:bg-[#0a0a0a] rounded-xl p-2 border border-slate-100 dark:border-[#1c1b1b]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={10} label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -5, style: { fontSize: 10, fill: '#94a3b8' } }} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  {series.map((s) => (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.name}
                      stroke={s.color}
                      strokeWidth={2}
                      dot={{ r: 3, fill: s.color, stroke: '#1e293b', strokeWidth: 1 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={10} label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -5, style: { fontSize: 10, fill: '#94a3b8' } }} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  {series.map((s) => (
                    <Bar key={s.key} dataKey={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <Activity className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-xs font-medium">{t("No data recorded yet")}</p>
              <p className="text-[10px] mt-1">{t("Click \"")}{recordLabel}{t("\" to start logging")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Record Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleRecord}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Plus className="w-3.5 h-3.5" />
          {recordLabel}
          <span className="text-[10px] opacity-70 ml-1">(±{noisePercent}{t("% noise)")}</span>
        </button>
      </div>

      {/* Data Table */}
      {hasData && (
        <div className="px-4 pb-4">
          <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-100 dark:border-[#1c1b1b]">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 dark:bg-[#0a0a0a] text-slate-500 dark:text-slate-400 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 font-medium">{xAxisKey}</th>
                  {series.map((s) => (
                    <th key={s.key} className="px-2 py-1.5 font-medium">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1c1b1b]">
                {data.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-2 py-1 font-mono font-bold text-slate-700 dark:text-slate-200">{d[xAxisKey]}</td>
                    {series.map((s) => (
                      <td key={s.key} className="px-2 py-1 font-mono text-slate-600 dark:text-slate-300">
                        {Number(d[s.key] ?? 0).toFixed(1)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
            <Activity className="w-3 h-3" />
            <span>{t("Realistic measurements with ±")}{noisePercent}{t("% experimental noise")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
