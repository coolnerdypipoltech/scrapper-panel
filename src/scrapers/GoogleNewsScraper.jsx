import React from 'react';
import { useApp } from '../context/AppContext';
import { useGoogleNewsScraper } from '../hooks/useGoogleNewsScraper';
import TagsInput from '../components/TagsInput';
import DataTable from '../components/DataTable';
import { GN_COLS } from '../config/columns';

export default function GoogleNewsScraper() {
  const { gnData, setGnData } = useApp();
  const {
    queries, setQueries,
    maxArticles, setMaxArticles,
    timeframe, setTimeframe,
    loading, error, exporting,
    run, exportExcel,
  } = useGoogleNewsScraper();

  return (
    <div className="panel card">
      <div className="scraper-controls">
        <div className="scraper-row">
          <TagsInput queries={queries} onQueriesChange={setQueries} platform="google-news" />

          <label className="inline-label">
            Máx. artículos
            <input type="number" min={1} max={100} className="num-input" value={maxArticles} onChange={e => setMaxArticles(Number(e.target.value))} />
          </label>

          <select className="select-input" value={timeframe} onChange={e => setTimeframe(e.target.value)}>
            <option value="1d">Último día</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>

          <button className="btn-run" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" />Scrapeando…</> : '▶ Scrapear'}
          </button>

          {gnData.length > 0 && (
            <>
              <button className="btn-secondary" onClick={() => setGnData([])}>Limpiar</button>
              <button className="btn-export" onClick={exportExcel} disabled={exporting}>
                {exporting ? <><span className="spinner" />Exportando…</> : '↓ Excel'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}
      {loading && <div className="loading-msg"><span className="spinner" /> Ejecutando scraper de Google News, esto puede tardar unos minutos…</div>}
      {gnData.length > 0
        ? <DataTable data={gnData} columns={GN_COLS} onDelete={id => setGnData(d => d.filter(i => i._id !== id))} />
        : !loading && <div className="empty-state">Añade una o más keywords y presiona <strong>Scrapear</strong>.</div>
      }
    </div>
  );
}