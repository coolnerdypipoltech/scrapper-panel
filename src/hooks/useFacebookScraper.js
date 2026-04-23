import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getValue, FB_PAGES_ACTOR_ID } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { FB_EXCEL_COLS } from '../config/columns';



const normalizeFacebookUrl = (rawUrl) => {
  if (!rawUrl) return '';

  try {
    const url = new URL(String(rawUrl).trim());
    const normalizedPath = url.pathname.replace(/\/+$/, '');
    return `${url.hostname.toLowerCase()}${normalizedPath}${url.search}`;
  } catch {
    return String(rawUrl).trim().replace(/\/+$/, '');
  }
};

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
  const [enriching,   setEnriching]   = useState(false);

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
        for (let index = 0; index < items.length; index++) {
          items[index].timestamp = new Date(items[index].timestamp * 1000);
        }
        console.log(items.map(item => item.timestamp));
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

  const enrichPages = async () => {
    if (fbData.length === 0) {
      setError('No hay filas de Facebook para enriquecer.');
      return;
    }
    if (!apiKey.trim()) {
      setError('Ingresa tu API Key de APIFY en Configuración.');
      return;
    }

    const pageUrls = Array.from(new Set(
      fbData
        .map(item => getValue(item, 'author.url'))
        .filter(Boolean)
    ));

    if (pageUrls.length === 0) {
      setError('Las filas visibles no tienen author.url para consultar páginas.');
      return;
    }

    setEnriching(true);
    setError('');

    try {
      const items = await fetchActorItems(FB_PAGES_ACTOR_ID, {
        startUrls: pageUrls.map(url => ({ url })),
      });

      const pagesByUrl = new Map(
        items
          .map(page => {
            const normalizedUrl = normalizeFacebookUrl(page.pageUrl);
            if (!normalizedUrl) return null;

            const categories = Array.isArray(page.categories) ? page.categories.filter(Boolean) : [];
            const likes = Number(page.likes);

            return [normalizedUrl, {
              pageCategories: categories,
              pageCategoriesLabel: categories.join(', '),
              pageLikes: Number.isFinite(likes) ? likes : page.likes,
            }];
          })
          .filter(Boolean)
      );

      if (pagesByUrl.size === 0) {
        setError('El actor de páginas no devolvió datos para las URLs visibles.');
        return;
      }

      setFbData(prev => prev.map(item => {
        const pageData = pagesByUrl.get(normalizeFacebookUrl(getValue(item, 'author.url')));
        return pageData ? { ...item, ...pageData } : item;
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setEnriching(false);
    }
  };

  return {
    queries, setQueries, max, setMax,
    searchType, setSearchType, recentPosts, setRecentPosts,
    startDate, setStartDate, endDate, setEndDate,
    loading, error, exporting, enriching, run, exportExcel, enrichPages,
  };
}
