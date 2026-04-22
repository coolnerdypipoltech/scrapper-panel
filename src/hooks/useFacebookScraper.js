import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getValue } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { FB_EXCEL_COLS } from '../config/columns';

export function useFacebookScraper() {
  const { apiKey, fbActorId, fetchActorItems, tagItems, fbData, setFbData } = useApp();

  const [queries,     setQueries]     = useState([]);
  const [max,         setMax]         = useState(50);
  const [searchType,  setSearchType]  = useState('posts');
  const [recentPosts, setRecentPosts] = useState(false);
  const [startDate,   setStartDate]   = useState('');
  const [endDate,     setEndDate]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [exporting,   setExporting]   = useState(false);

  const run = async () => {
    if (queries.length === 0) { setError('Agrega al menos una búsqueda.'); return; }
    if (!apiKey.trim()) { setError('Ingresa tu API Key de APIFY en Configuración.'); return; }
    setLoading(true);
    setError('');
    try {
      for (const query of queries) {
        const input = {
          query,
          max_posts:    max,
          search_type:  searchType,
          recent_posts: recentPosts,
          ...(startDate && { start_date: startDate }),
          ...(endDate   && { end_date:   endDate   }),
        };
        const items = await fetchActorItems(fbActorId, input);
        setFbData(prev => [...prev, ...tagItems(items)]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const { default: ExcelJS } = await import('exceljs');
      const wb = new ExcelJS.Workbook();
      await buildSheet(wb, 'Facebook', fbData, FB_EXCEL_COLS,
        item => getValue(item, 'author.profilePicture'));
      await downloadWorkbook(wb, 'facebook.xlsx');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return {
    queries, setQueries, max, setMax,
    searchType, setSearchType, recentPosts, setRecentPosts,
    startDate, setStartDate, endDate, setEndDate,
    loading, error, exporting, run, exportExcel,
  };
}
