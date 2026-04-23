import React from 'react';
import { useApp } from '../context/AppContext';
import { useInstagramScraper } from '../hooks/useInstagramScraper';
import TagsInput from '../components/TagsInput';
import DataTable from '../components/DataTable';
import { IG_COLS } from '../config/columns';

export default function InstagramScraper() {
  const { igData, setIgData } = useApp();
  const {
    queries, setQueries,
    searchLimit, setSearchLimit,
    resultsLimit, setResultsLimit,
    searchType, setSearchType,
    startDate, setStartDate,
    resultsType, setResultsType,
    loading, profilesLoading, error, exporting,
    run, fetchAuthorsProfiles, exportExcel,
  } = useInstagramScraper();

  return (
    <div className="panel card">
      <div className="scraper-controls">
        <div className="scraper-row">
          <TagsInput queries={queries} onQueriesChange={setQueries} platform="instagram" />

          <select className="select-input" value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="hashtag">Hashtag</option>
          </select>

          <select className="select-input" value={resultsType} onChange={e => setResultsType(e.target.value)}>
            <option value="posts">Posts</option>
            <option value="details">Details</option>
          </select>

          <label className="inline-label">
            Límite búsqueda
            <input type="number" min={1} max={100} className="num-input" value={searchLimit} onChange={e => setSearchLimit(Number(e.target.value))} />
          </label>

          <label className="inline-label">
            Resultados
            <input type="number" min={1} max={500} className="num-input" value={resultsLimit} onChange={e => setResultsLimit(Number(e.target.value))} />
          </label>

          <label className="inline-label">
            Desde
            <input type="date" className="date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>

          <button className="btn-run" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" />Scrapeando…</> : '▶ Scrapear'}
          </button>

          {igData.length > 0 && (
            <>
              <button className="btn-secondary" onClick={fetchAuthorsProfiles} disabled={profilesLoading || loading}>
                {profilesLoading ? <><span className="spinner" />Perfiles…</> : 'Autores'}
              </button>
              <button className="btn-secondary" onClick={() => setIgData([])}>Limpiar</button>
              <button className="btn-export" onClick={exportExcel} disabled={exporting}>
                {exporting ? <><span className="spinner" />Exportando…</> : '↓ Excel'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="error-msg">⚠️ {error}</div>}
      {loading && <div className="loading-msg"><span className="spinner" /> Ejecutando scraper de Instagram, esto puede tardar unos minutos…</div>}
      {profilesLoading && <div className="loading-msg"><span className="spinner" /> Consultando perfiles de autores en Instagram…</div>}
      {igData.length > 0
        ? <DataTable data={igData} columns={IG_COLS} onDelete={id => setIgData(d => d.filter(i => i._id !== id))} />
        : !loading && <div className="empty-state">Añade una o más búsquedas y presiona <strong>Scrapear</strong>.</div>
      }
    </div>
  );
}