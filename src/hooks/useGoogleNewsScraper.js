import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getValue } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { GN_EXCEL_COLS } from '../config/columns';

export function useGoogleNewsScraper() {
  const { apiKey, gnActorId, fetchActorItems, tagItems, gnData, setGnData } = useApp();

  const [queries, setQueries] = useState([]);
  const [maxArticles, setMaxArticles] = useState(5);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const run = async () => {
    if (queries.length === 0) { setError('Agrega al menos una keyword.'); return; }
    if (!apiKey.trim()) { setError('Ingresa tu API Key de APIFY en Configuración.'); return; }
    if (!gnActorId.trim()) { setError('Ingresa el Actor ID de Google News en Configuración.'); return; }
    setLoading(true);
    setError('');
    try {
      const input = {
        decodeUrls: false,
        extractDescriptions: true,
        extractImages: true,
        keywords: queries,
        maxArticles,
        proxyConfiguration: {
          useApifyProxy: true,
        },
        region_language: 'MX:es-419',
        timeframe,
        topics: [],
        topicUrls: [],
      };
      const items = await fetchActorItems(gnActorId, input);
      setGnData(prev => [...prev, ...tagItems(items)]);
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
      await buildSheet(wb, 'Google News', gnData, GN_EXCEL_COLS,
        item => getValue(item, 'image'));
      await downloadWorkbook(wb, 'google-news.xlsx');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return {
    queries, setQueries,
    maxArticles, setMaxArticles,
    timeframe, setTimeframe,
    loading, error, exporting,
    run, exportExcel,
  };
}