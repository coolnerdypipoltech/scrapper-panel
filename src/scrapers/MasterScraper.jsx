import React from 'react';
import { useApp } from '../context/AppContext';
import { useMasterScraper } from '../hooks/useMasterScraper';
import TagsInput from '../components/TagsInput';
import DataTable from '../components/DataTable';
import { YT_COLS, TT_COLS, FB_COLS, IG_COLS, GN_COLS } from '../config/columns';

const PLATFORM_SECTIONS = [
  { key: 'youtube', label: 'YouTube', dataKey: 'ytData', setterKey: 'setYtData', columns: YT_COLS },
  { key: 'tiktok', label: 'TikTok', dataKey: 'ttData', setterKey: 'setTtData', columns: TT_COLS },
  { key: 'facebook', label: 'Facebook', dataKey: 'fbData', setterKey: 'setFbData', columns: FB_COLS },
  { key: 'instagram', label: 'Instagram', dataKey: 'igData', setterKey: 'setIgData', columns: IG_COLS },
  { key: 'google-news', label: 'Google News', dataKey: 'gnData', setterKey: 'setGnData', columns: GN_COLS },
];

export default function MasterScraper() {
  const app = useApp();
  const {
    queries, setQueries,
    maxResults, setMaxResults,
    dateRange, setDateRange,
    ttSearchType, setTtSearchType,
    igSearchType, setIgSearchType,
    gnTimeframe, setGnTimeframe,
    loading, error, status,
    run,
  } = useMasterScraper();

  const clearAll = () => {
    app.setYtData([]);
    app.setTtData([]);
    app.setFbData([]);
    app.setIgData([]);
    app.setGnData([]);
  };

  const hasResults = PLATFORM_SECTIONS.some(section => app[section.dataKey].length > 0);

  return (
    <div className="panel card">
      <div className="scraper-controls">
        <div className="scraper-row">
          <TagsInput queries={queries} onQueriesChange={setQueries} platform="youtube" />

          <label className="inline-label">
            Máx. base
            <input type="number" min={1} max={100} className="num-input" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} />
          </label>

          <select className="select-input" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="">Cualquier fecha</option>
            <option value="2d">Últimos 2 días</option>
            <option value="3d">Últimos 3 días</option>
            <option value="7d">Última semana</option>
          </select>

          <select className="select-input" value={ttSearchType} onChange={e => setTtSearchType(e.target.value)}>
            <option value="keyword">TikTok keyword</option>
            <option value="hashtag">TikTok hashtag</option>
          </select>

          <select className="select-input" value={igSearchType} onChange={e => setIgSearchType(e.target.value)}>
            <option value="user">Instagram usuario</option>
            <option value="hashtag">Instagram hashtag</option>
            <option value="place">Instagram lugar</option>
          </select>

          <select className="select-input" value={gnTimeframe} onChange={e => setGnTimeframe(e.target.value)}>
            <option value="1d">News 1d</option>
            <option value="7d">News 7d</option>
            <option value="30d">News 30d</option>
          </select>

          <button className="btn-run" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" />Buscando…</> : '▶ Buscar en todo'}
          </button>

          {hasResults && (
            <button className="btn-secondary" onClick={clearAll}>Limpiar todo</button>
          )}
        </div>
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}
      {loading && <div className="loading-msg"><span className="spinner" /> Ejecutando búsqueda maestra en 5 scrapers…</div>}

      {!loading && Object.keys(status).length > 0 && (
        <div className="empty-state">
          {PLATFORM_SECTIONS.map(section => (
            <div key={section.key}><strong>{section.label}:</strong> {status[section.key] || 'sin cambios'}</div>
          ))}
        </div>
      )}

      {PLATFORM_SECTIONS.map(section => {
        const data = app[section.dataKey];
        if (data.length === 0) return null;
        const setData = app[section.setterKey];

        return (
          <div key={section.key} style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 10 }}>{section.label} <span className="badge">{data.length}</span></h3>
            <DataTable data={data} columns={section.columns} onDelete={id => setData(prev => prev.filter(item => item._id !== id))} />
          </div>
        );
      })}

      {!hasResults && !loading && (
        <div className="empty-state">Añade una o más búsquedas y presiona <strong>Buscar en todo</strong> para ejecutar los 5 scrapers al mismo tiempo.</div>
      )}
    </div>
  );
}