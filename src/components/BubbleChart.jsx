import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble, Doughnut, Pie, PolarArea } from 'react-chartjs-2';
import { getValue } from '../utils/helpers';

ChartJS.register(LinearScale, PointElement, ArcElement, RadialLinearScale, Tooltip, Legend);

const MIN_R = 4;
const MAX_R = 28;
const TOP_N = 20;

const CHART_TYPES = [
  { key: 'bubble',   label: 'Bubble' },
  { key: 'doughnut', label: 'Doughnut' },
  { key: 'pie',      label: 'Pie' },
  { key: 'polar',    label: 'Polar Area' },
];

const PALETTE = [
  'rgba(108,99,255,0.8)', 'rgba(45,227,216,0.8)',  'rgba(255,69,69,0.8)',
  'rgba(255,122,0,0.8)',  'rgba(52,168,83,0.8)',   'rgba(24,119,242,0.8)',
  'rgba(245,166,35,0.8)', 'rgba(255,92,92,0.8)',   'rgba(72,213,138,0.8)',
  'rgba(156,106,222,0.8)','rgba(240,180,80,0.8)',  'rgba(100,200,255,0.8)',
  'rgba(255,150,150,0.8)','rgba(130,220,130,0.8)', 'rgba(200,100,200,0.8)',
  'rgba(255,200,100,0.8)','rgba(100,180,220,0.8)', 'rgba(220,180,100,0.8)',
  'rgba(180,220,100,0.8)','rgba(100,220,180,0.8)',
];

function normalizeRadius(values) {
  const nums = values.filter(n => !isNaN(n));
  if (!nums.length) return values.map(() => (MIN_R + MAX_R) / 2);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return values.map(v => {
    if (isNaN(v)) return MIN_R;
    if (max === min) return (MIN_R + MAX_R) / 2;
    return MIN_R + ((v - min) / (max - min)) * (MAX_R - MIN_R);
  });
}

function getLabel(item, columns) {
  const labelCol = columns.find(c =>
    c.key === 'title' || c.key === 'text' || c.key === 'caption' ||
    c.key === 'description' || c.type === 'text'
  );
  if (!labelCol) return '';
  const val = getValue(item, labelCol.key);
  if (!val) return '';
  return String(val).slice(0, 60) + (String(val).length > 60 ? '…' : '');
}

function getNumericValue(item, col) {
  const raw = getValue(item, col.key);
  if (col.type === 'reactions') {
    if (!raw || typeof raw !== 'object') return 0;
    return Object.values(raw).reduce((sum, v) => sum + (Number(v) || 0), 0);
  }
  return Number(raw) || 0;
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1c2035',
  borderColor: '#252a45',
  borderWidth: 1,
  titleColor: '#dde1f5',
  bodyColor: '#7880a8',
  padding: 10,
};

export default function BubbleChart({ data, columns }) {
  const [chartType, setChartType] = useState('bubble');

  const numericCols = useMemo(
    () => columns.filter(c => c.type === 'number' || c.type === 'reactions'),
    [columns]
  );
  const textCols = useMemo(
    () => columns.filter(c => c.type === 'text'),
    [columns]
  );

  // Bubble axis state
  const [xKey, setXKey] = useState(() => numericCols[0]?.key ?? '');
  const [yKey, setYKey] = useState(() => numericCols[1]?.key ?? numericCols[0]?.key ?? '');
  const [rKey, setRKey] = useState(() => numericCols[2]?.key ?? numericCols[1]?.key ?? numericCols[0]?.key ?? '');

  // Arc chart state
  const [valueKey, setValueKey] = useState(() => numericCols[0]?.key ?? '');
  const [labelKey, setLabelKey] = useState(() => textCols[0]?.key ?? '');

  // Reset when platform (columns) changes
  const prevCols = React.useRef(numericCols);
  if (prevCols.current !== numericCols) {
    prevCols.current = numericCols;
    setXKey(numericCols[0]?.key ?? '');
    setYKey(numericCols[1]?.key ?? numericCols[0]?.key ?? '');
    setRKey(numericCols[2]?.key ?? numericCols[1]?.key ?? numericCols[0]?.key ?? '');
    setValueKey(numericCols[0]?.key ?? '');
    setLabelKey(textCols[0]?.key ?? '');
  }

  const linkKey = useMemo(() => {
    const linkCol = columns.find(c => c.type === 'link');
    return linkCol?.key ?? null;
  }, [columns]);

  // ── Bubble chart data ────────────────────────────────────────────────
  const bubbleData = useMemo(() => {
    if (chartType !== 'bubble' || !data.length || !xKey || !yKey || !rKey)
      return { datasets: [] };

    const xCol = numericCols.find(c => c.key === xKey);
    const yCol = numericCols.find(c => c.key === yKey);
    const rCol = numericCols.find(c => c.key === rKey);

    const rValues = data.map(item => rCol ? getNumericValue(item, rCol) : 0);
    const radii = normalizeRadius(rValues);

    const points = data.map((item, i) => ({
      x: xCol ? getNumericValue(item, xCol) : 0,
      y: yCol ? getNumericValue(item, yCol) : 0,
      r: radii[i],
      _label: getLabel(item, columns),
      _rRaw: rValues[i],
      _url: linkKey ? getValue(item, linkKey) : null,
    }));

    return {
      datasets: [{
        label: 'Datos',
        data: points,
        backgroundColor: '#EE5243',
        borderColor: '#EE5243',
        borderWidth: 1,
        hoverBackgroundColor: '#FF7060',
      }],
    };
  }, [data, chartType, xKey, yKey, rKey, numericCols, columns, linkKey]);

  // ── Arc chart data (Doughnut, Pie, Polar) ───────────────────────────
  const arcData = useMemo(() => {
    if (chartType === 'bubble' || !data.length || !valueKey)
      return { labels: [], datasets: [] };

    const vCol = numericCols.find(c => c.key === valueKey);
    const lCol = columns.find(c => c.key === labelKey);

    const sorted = [...data]
      .map(item => ({
        label: lCol
          ? String(getValue(item, lCol.key) ?? '').slice(0, 40)
          : getLabel(item, columns),
        value: vCol ? getNumericValue(item, vCol) : 0,
        url: linkKey ? getValue(item, linkKey) : null,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_N);

    return {
      labels: sorted.map(d => d.label || '(sin título)'),
      datasets: [{
        data: sorted.map(d => d.value),
        backgroundColor: PALETTE.slice(0, sorted.length),
        borderColor: PALETTE.slice(0, sorted.length).map(c => c.replace('0.8', '1')),
        borderWidth: 1,
        _urls: sorted.map(d => d.url),
      }],
    };
  }, [data, chartType, valueKey, labelKey, numericCols, columns, linkKey]);

  // ── Labels for axes / tooltips ───────────────────────────────────────
  const xLabel    = numericCols.find(c => c.key === xKey)?.label ?? xKey;
  const yLabel    = numericCols.find(c => c.key === yKey)?.label ?? yKey;
  const rLabel    = numericCols.find(c => c.key === rKey)?.label ?? rKey;
  const valueLabel = numericCols.find(c => c.key === valueKey)?.label ?? valueKey;

  // ── Click handlers ────────────────────────────────────────────────────
  const handleBubbleClick = React.useCallback((_, elements) => {
    if (!elements.length) return;
    const point = bubbleData.datasets[0]?.data[elements[0].index];
    if (point?._url) window.open(String(point._url), '_blank', 'noopener,noreferrer');
  }, [bubbleData]);

  const handleArcClick = React.useCallback((_, elements) => {
    if (!elements.length) return;
    const url = arcData.datasets[0]?._urls?.[elements[0].index];
    if (url) window.open(String(url), '_blank', 'noopener,noreferrer');
  }, [arcData]);

  const onHover = React.useCallback((event, elements) => {
    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
  }, []);

  // ── Options ────────────────────────────────────────────────────────────
  const bubbleOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    onHover,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          label(ctx) {
            const d = ctx.raw;
            const lines = [];
            if (d._label) lines.push(d._label);
            lines.push(`${xLabel}: ${d.x.toLocaleString('es')}`);
            lines.push(`${yLabel}: ${d.y.toLocaleString('es')}`);
            lines.push(`${rLabel}: ${Number(d._rRaw).toLocaleString('es')}`);
            return lines;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: xLabel, color: '#7880a8', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#7880a8', font: { size: 10 } },
      },
      y: {
        title: { display: true, text: yLabel, color: '#7880a8', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#7880a8', font: { size: 10 } },
      },
    },
  }), [xLabel, yLabel, rLabel, onHover]);

  const arcOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    onHover,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#7880a8',
          font: { size: 10 },
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          label(ctx) {
            const val = Number(ctx.raw).toLocaleString('es');
            return ` ${valueLabel}: ${val}`;
          },
        },
      },
    },
    ...(chartType === 'polar' ? {
      scales: {
        r: {
          grid: { color: 'rgba(255,255,255,0.07)' },
          ticks: { color: '#7880a8', font: { size: 9 }, backdropColor: 'transparent' },
        },
      },
    } : {}),
  }), [valueLabel, chartType, onHover]);

  if (!numericCols.length || !data.length) return null;

  const isBubble = chartType === 'bubble';

  return (
    <div className="bubble-chart-wrapper">
      {/* ── Top controls bar ─────────────────────────────────────── */}
      <div className="bubble-chart-controls">
        {/* Chart type selector */}
        <div className="chart-type-selector">
          {CHART_TYPES.map(t => (
            <button
              key={t.key}
              className={`chart-type-btn${chartType === t.key ? ' active' : ''}`}
              onClick={() => setChartType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Bubble-specific controls */}
        {isBubble && (
          <>
            <label className="bubble-axis-label">
              Eje X
              <select value={xKey} onChange={e => setXKey(e.target.value)}>
                {numericCols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
            <label className="bubble-axis-label">
              Eje Y
              <select value={yKey} onChange={e => setYKey(e.target.value)}>
                {numericCols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
            <label className="bubble-axis-label">
              Tamaño burbuja
              <select value={rKey} onChange={e => setRKey(e.target.value)}>
                {numericCols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
          </>
        )}

        {/* Arc-chart controls */}
        {!isBubble && (
          <>
            <label className="bubble-axis-label">
              Valor
              <select value={valueKey} onChange={e => setValueKey(e.target.value)}>
                {numericCols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
            <label className="bubble-axis-label">
              Etiqueta
              <select value={labelKey} onChange={e => setLabelKey(e.target.value)}>
                {textCols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
          </>
        )}
      </div>

      {/* ── Chart canvas ─────────────────────────────────────────── */}
      <div className="bubble-chart-canvas">
        {chartType === 'bubble' && (
          <Bubble data={bubbleData} options={bubbleOptions} onClick={handleBubbleClick} />
        )}
        {chartType === 'doughnut' && (
          <Doughnut data={arcData} options={arcOptions} onClick={handleArcClick} />
        )}
        {chartType === 'pie' && (
          <Pie data={arcData} options={arcOptions} onClick={handleArcClick} />
        )}
        {chartType === 'polar' && (
          <PolarArea data={arcData} options={arcOptions} onClick={handleArcClick} />
        )}
      </div>
    </div>
  );
}
