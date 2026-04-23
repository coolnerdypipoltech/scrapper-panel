import React from 'react';
import { useApp } from '../context/AppContext';
import { useYouTubeScraper } from '../hooks/useYouTubeScraper';
import TagsInput from '../components/TagsInput';
import DataTable from '../components/DataTable';
import { YT_COLS } from '../config/columns';

export default function YouTubeScraper() {
  const { ytData, setYtData } = useApp();
  const { queries, setQueries, max, setMax, order, setOrder, publishedAfter, setPublishedAfter, publishedBefore, setPublishedBefore, loading, error, progress, exporting, run, exportExcel } = useYouTubeScraper();

  return (
    <div className="panel card">
      <div className="scraper-controls">
        <div className="scraper-row">
          <TagsInput queries={queries} onQueriesChange={setQueries} platform="youtube" />

          <label className="inline-label">
            Máx.
            <input type="number" min={1} max={500} className="num-input" value={max} onChange={e => setMax(Number(e.target.value))} />
          </label>

          <select className="select-input" value={order} onChange={e => setOrder(e.target.value)}>
            <option value="relevance">Relevancia</option>
            <option value="date">Fecha de subida</option>
            <option value="viewCount">Vistas</option>
            <option value="rating">Calificación</option>
          </select>

          <label className="inline-label">
            Desde
            <input type="date" className="date-input" value={publishedAfter} onChange={e => setPublishedAfter(e.target.value)} />
          </label>

          <label className="inline-label">
            Hasta
            <input type="date" className="date-input" value={publishedBefore} onChange={e => setPublishedBefore(e.target.value)} />
          </label>

          <button className="btn-run" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" />Scrapeando…</> : '▶ Scrapear'}
          </button>

          {ytData.length > 0 && (
            <>
              <button className="btn-secondary" onClick={() => setYtData([])}>Limpiar</button>
              <button className="btn-export" onClick={exportExcel} disabled={exporting}>
                {exporting ? <><span className="spinner" />Exportando…</> : '↓ Excel'}
              </button>
            </>
          )}
        </div>
      </div>

      {error   && <div className="error-msg">⚠️ {error}</div>}
      {loading && <div className="loading-msg"><span className="spinner" /> Scrapeando query {progress}… esto puede tardar unos minutos.</div>}
      {ytData.length > 0
        ? <DataTable data={ytData} columns={YT_COLS} onDelete={id => setYtData(d => d.filter(i => i._id !== id))} />
        : !loading && <div className="empty-state">Añade una o más búsquedas y presiona <strong>Scrapear</strong>.</div>
      }
    </div>
  );
}
