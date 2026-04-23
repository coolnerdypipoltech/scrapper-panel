import React from 'react';
import { useApp } from '../context/AppContext';
import { useFacebookScraper } from '../hooks/useFacebookScraper';
import TagsInput from '../components/TagsInput';
import DataTable from '../components/DataTable';
import { FB_COLS } from '../config/columns';

export default function FacebookScraper() {
  const { fbData, setFbData } = useApp();
  const {
    queries, setQueries, max, setMax,
    searchType, setSearchType, recentPosts, setRecentPosts,
    startDate, setStartDate, endDate, setEndDate,
    loading, error, exporting, enriching, run, exportExcel, enrichPages,
  } = useFacebookScraper();

  return (
    <div className="panel card">
      <div className="scraper-controls">
        <div className="scraper-row">
          <TagsInput queries={queries} onQueriesChange={setQueries} platform="facebook" />

          <select className="select-input" value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="posts">Posts</option>
            <option value="videos">Videos</option>
            <option value="photos">Fotos</option>
            <option value="people">Personas</option>
            <option value="groups">Grupos</option>
            <option value="pages">Páginas</option>
          </select>

          <label className="inline-label">
            Máx.
            <input type="number" min={1} max={500} className="num-input" value={max} onChange={e => setMax(Number(e.target.value))} />
          </label>

          <label className="inline-label">
            Desde
            <input type="date" className="date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>

          <label className="inline-label">
            Hasta
            <input type="date" className="date-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>

          <label className="inline-label fb-toggle">
            <input type="checkbox" checked={recentPosts} onChange={e => setRecentPosts(e.target.checked)} />
            Recientes
          </label>

          <button className="btn-run" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" />Scrapeando…</> : '▶ Scrapear'}
          </button>

          {fbData.length > 0 && (
            <>
              <button className="btn-secondary" onClick={() => setFbData([])}>Limpiar</button>
              <button className="btn-secondary" onClick={enrichPages} disabled={loading || enriching}>
                {enriching ? <><span className="spinner" />Páginas…</> : '＋ Likes y categorías'}
              </button>
              <button className="btn-export" onClick={exportExcel} disabled={exporting}>
                {exporting ? <><span className="spinner" />Exportando…</> : '↓ Excel'}
              </button>
            </>
          )}
        </div>
      </div>

      {error   && <div className="error-msg">⚠️ {error}</div>}
      {loading && <div className="loading-msg"><span className="spinner" /> Ejecutando scraper de Facebook, esto puede tardar unos minutos…</div>}
      {fbData.length > 0
        ? <DataTable data={fbData} columns={FB_COLS} onDelete={id => setFbData(d => d.filter(i => i._id !== id))} />
        : !loading && <div className="empty-state">Añade una o más búsquedas y presiona <strong>Scrapear</strong>.</div>
      }
    </div>
  );
}
