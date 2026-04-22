import React from 'react';
import { useApp } from '../context/AppContext';
import { useTikTokScraper } from '../hooks/useTikTokScraper';
import TagsInput from '../components/TagsInput';
import DataTable from '../components/DataTable';
import { TT_COLS } from '../config/columns';

export default function TikTokScraper() {
  const { ttData, setTtData } = useApp();
  const { queries, setQueries, max, setMax, searchType, setSearchType, dateRange, setDateRange, loading, error, exporting, run, exportExcel } = useTikTokScraper();

  return (
    <div className="panel card">
      <div className="scraper-controls">
        <div className="scraper-row">
          <TagsInput queries={queries} onQueriesChange={setQueries} platform="tiktok" />

          <select className="select-input" value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="hashtag">Hashtag</option>
            <option value="keyword">Keyword</option>
          </select>

          <label className="inline-label">
            Máx.
            <input type="number" min={1} max={500} className="num-input" value={max} onChange={e => setMax(Number(e.target.value))} />
          </label>

          <select className="select-input" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="">Cualquier fecha</option>
            <option value="2d">Últimos 2 días</option>
            <option value="3d">Últimos 3 días</option>
            <option value="7d">Última semana</option>
          </select>

          <button className="btn-run" onClick={run} disabled={loading}>
            {loading ? <><span className="spinner" />Scrapeando…</> : '▶ Scrapear'}
          </button>

          {ttData.length > 0 && (
            <>
              <button className="btn-secondary" onClick={() => setTtData([])}>Limpiar</button>
              <button className="btn-export" onClick={exportExcel} disabled={exporting}>
                {exporting ? <><span className="spinner" />Exportando…</> : '↓ Excel'}
              </button>
            </>
          )}
        </div>
      </div>

      {error   && <div className="error-msg">⚠️ {error}</div>}
      {loading && <div className="loading-msg"><span className="spinner" /> Ejecutando scraper de TikTok, esto puede tardar unos minutos…</div>}
      {ttData.length > 0
        ? <DataTable data={ttData} columns={TT_COLS} onDelete={id => setTtData(d => d.filter(i => i._id !== id))} />
        : !loading && <div className="empty-state">Añade uno o más hashtags/keywords y presiona <strong>Scrapear</strong>.</div>
      }
    </div>
  );
}
