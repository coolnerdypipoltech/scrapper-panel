import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { YT_EXCEL_COLS } from '../config/columns';

export function useYouTubeScraper() {
  const { apiKey, ytActorId, fetchActorItems, tagItems, ytData, setYtData } = useApp();

  const [queries,        setQueries]        = useState([]);
  const [max,            setMax]            = useState(10);
  const [order,          setOrder]          = useState('relevance');
  const [publishedAfter, setPublishedAfter] = useState('');
  const [publishedBefore,setPublishedBefore]= useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [progress,       setProgress]       = useState('');
  const [exporting,      setExporting]      = useState(false);

  const run = async () => {
    if (queries.length === 0) { setError('Agrega al menos una búsqueda.'); return; }
    if (!apiKey.trim()) { setError('Ingresa tu API Key de APIFY en Configuración.'); return; }
    setLoading(true);
    setError('');
    try {
      for (let idx = 0; idx < queries.length; idx++) {
        setProgress(`${idx + 1} / ${queries.length}: "${queries[idx]}"`);
        const input = {
          channelType: 'any',
          eventType: 'completed',
          maxResults: max,
          order,
          q: queries[idx],
          useFilters: false,
          videoDefinition: 'any',
          videoDuration: 'any',
          videoLicense: 'any',
          safeSearch: 'moderate',
        };
        if (publishedAfter)  input.publishedAfter  = new Date(publishedAfter).toISOString();
        if (publishedBefore) input.publishedBefore = new Date(publishedBefore).toISOString();
        const items = await fetchActorItems(ytActorId, input);
        setYtData(prev => [...prev, ...tagItems(items)]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const { default: ExcelJS } = await import('exceljs');
      const wb = new ExcelJS.Workbook();
      await buildSheet(wb, 'YouTube', ytData, YT_EXCEL_COLS,
        item => item.thumbnailUrl || '');
      await downloadWorkbook(wb, 'youtube.xlsx');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return { queries, setQueries, max, setMax, order, setOrder, publishedAfter, setPublishedAfter, publishedBefore, setPublishedBefore, loading, error, progress, exporting, run, exportExcel };
}
