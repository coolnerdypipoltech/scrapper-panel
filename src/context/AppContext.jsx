import React, { createContext, useContext, useState, useEffect } from 'react';
import { APIFY_BASE, DEFAULT_YT_ACTOR, DEFAULT_TT_ACTOR, DEFAULT_FB_ACTOR, DEFAULT_IG_ACTOR, DEFAULT_GN_ACTOR, tagItems, getValue } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { YT_EXCEL_COLS, TT_EXCEL_COLS, FB_EXCEL_COLS, IG_EXCEL_COLS, GN_EXCEL_COLS } from '../config/columns';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ─── Settings ──────────────────────────────────────────────────────────────
  const [apiKey,       setApiKey]       = useState(() => localStorage.getItem('apify_key') || '');
  const [apiVisible,   setApiVisible]   = useState(false);
  const [ytActorId,    setYtActorId]    = useState(() =>  DEFAULT_YT_ACTOR);
  const [ttActorId,    setTtActorId]    = useState(() =>  DEFAULT_TT_ACTOR);
  const [fbActorId,    setFbActorId]    = useState(() =>  DEFAULT_FB_ACTOR);
  const [igActorId,    setIgActorId]    = useState(() =>  DEFAULT_IG_ACTOR);
  const [gnActorId,    setGnActorId]    = useState(() =>  DEFAULT_GN_ACTOR);
  const [settingsOpen, setSettingsOpen] = useState(!localStorage.getItem('apify_key'));

  useEffect(() => { apiKey ? localStorage.setItem('apify_key', apiKey) : localStorage.removeItem('apify_key'); }, [apiKey]);

  // ─── Shared scraper data (needed for stats + exportAll) ────────────────────
  const [ytData, setYtData] = useState([]);
  const [ttData, setTtData] = useState([]);
  const [fbData, setFbData] = useState([]);
  const [igData, setIgData] = useState([]);
  const [gnData, setGnData] = useState([]);

  // ─── Export-all state ──────────────────────────────────────────────────────
  const [exporting,    setExporting]    = useState(false);
  const [exportError,  setExportError]  = useState('');

  // ─── Generic APIFY fetch ───────────────────────────────────────────────────
  const fetchActorItems = async (actorId, input) => {
    const res = await fetch(
      `${APIFY_BASE}/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${encodeURIComponent(apiKey.trim())}&clean=true`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error ${res.status}: ${res.statusText}`);
    }
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error('La respuesta no tiene el formato esperado.');
    return items;
  };

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const ytViews     = ytData.reduce((s, i) => s + (Number(i.viewCount)      || 0), 0);
  const ttPlays     = ttData.reduce((s, i) => s + (Number(i.playCount)      || 0), 0);
  const fbReactions = fbData.reduce((s, i) => s + (Number(i.reactions_count) || 0), 0);
  const igLikes     = igData.reduce((s, i) => s + (Number(i.likesCount)     || 0), 0);
  const gnArticles  = gnData.length;
  const total       = ytViews + ttPlays + fbReactions + igLikes + gnArticles;

  // ─── Export all ────────────────────────────────────────────────────────────
  const exportAll = async () => {
    setExporting(true);
    setExportError('');
    try {
      const { default: ExcelJS } = await import('exceljs');
      const wb = new ExcelJS.Workbook();
      if (ytData.length) await buildSheet(wb, 'YouTube',  ytData, YT_EXCEL_COLS, item => `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`);
      if (ttData.length) await buildSheet(wb, 'TikTok',   ttData, TT_EXCEL_COLS, item => getValue(item, 'videoMeta.coverUrl'));
      if (fbData.length) await buildSheet(wb, 'Facebook', fbData, FB_EXCEL_COLS, item => getValue(item, 'author.profilePicture'));
      if (igData.length) await buildSheet(wb, 'Instagram', igData, IG_EXCEL_COLS, item => getValue(item, 'displayUrl'));
      if (gnData.length) await buildSheet(wb, 'Google News', gnData, GN_EXCEL_COLS, item => getValue(item, 'image'));
      await downloadWorkbook(wb, 'scraper-export.xlsx');
    } catch (err) {
      setExportError('Error al exportar: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppContext.Provider value={{
      // Settings
      apiKey, setApiKey, apiVisible, setApiVisible,
      ytActorId, setYtActorId,
      ttActorId, setTtActorId,
      fbActorId, setFbActorId,
      igActorId, setIgActorId,
      gnActorId, setGnActorId,
      settingsOpen, setSettingsOpen,
      // API
      fetchActorItems, tagItems,
      // Data
      ytData, setYtData,
      ttData, setTtData,
      fbData, setFbData,
      igData, setIgData,
      gnData, setGnData,
      // Stats
      stats: { ytViews, ttPlays, fbReactions, igLikes, gnArticles, total },
      // Export all
      exporting, exportError, exportAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
