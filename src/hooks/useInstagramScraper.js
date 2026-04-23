import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getValue } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { IG_EXCEL_COLS } from '../config/columns';

export function useInstagramScraper() {
  const { apiKey, igActorId, fetchActorItems, tagItems, igData, setIgData } = useApp();

  const [queries, setQueries] = useState([]);
  const [startDate,   setStartDate]   = useState('');
  const [searchLimit, setSearchLimit] = useState(10);
  const [resultsLimit, setResultsLimit] = useState(100);
  const [searchType, setSearchType] = useState('user');
  const [resultsType, setResultsType] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const run = async () => {
    if (queries.length === 0) { setError('Agrega al menos una búsqueda.'); return; }
    if (!apiKey.trim()) { setError('Ingresa tu API Key de APIFY en Configuración.'); return; }
    setLoading(true);
    setError('');
    try {
      for (const query of queries) {
        const input = {
          addParentData: false,
          resultsLimit,
          resultsType,
          search: query,
          searchLimit,
          searchType,
          onlyPostsNewerThan: startDate || undefined,
        };
        const items = await fetchActorItems(igActorId, input);
        if(items.length === 1) {
          if(Object.hasOwn(items[0], "error")) {
            if(items[0].error === "no_items"){
              setError('No se encontraron resultados para la búsqueda: ' + query);
              continue;
            }
          }
        }
        setIgData(prev => [...prev, ...tagItems(items)]);
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
      await buildSheet(wb, 'Instagram', igData, IG_EXCEL_COLS,
        item => getValue(item, 'displayUrl'));
      await downloadWorkbook(wb, 'instagram.xlsx');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return {
    queries, setQueries,
    searchLimit, setSearchLimit,
    resultsLimit, setResultsLimit,
    searchType, setSearchType,
    startDate, setStartDate,
    resultsType, setResultsType,
    loading, error, exporting,
    run, exportExcel,
  };
}