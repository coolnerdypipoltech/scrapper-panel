import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getValue } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { TT_EXCEL_COLS } from '../config/columns';

const TT_DATE_POSTED = { '': '0', '2d': '2', '3d': '3', '7d': '7' };

export function useTikTokScraper() {
  const { apiKey, ttActorId, fetchActorItems, tagItems, ttData, setTtData } = useApp();

  const [queries,    setQueries]    = useState([]);
  const [max,        setMax]        = useState(50);
  const [searchType, setSearchType] = useState('keyword');
  const [dateRange,  setDateRange]  = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [exporting,  setExporting]  = useState(false);

  const run = async () => {
    if (queries.length === 0) { setError('Agrega al menos un hashtag o keyword.'); return; }
    if (!apiKey.trim()) { setError('Ingresa tu API Key de APIFY en Configuración.'); return; }
    setLoading(true);
    setError('');
    try {
      const base = {
        commentsPerPost: 0, excludePinnedPosts: false,
        maxFollowersPerProfile: 0, maxFollowingPerProfile: 0,
        maxProfilesPerQuery: 1000, maxRepliesPerComment: 0,
        proxyCountryCode: 'None', resultsPerPage: max,
        scrapeRelatedVideos: false,
        searchDatePosted: TT_DATE_POSTED[dateRange] ?? '0',
        searchSection: '/video', searchSorting: '0',
        shouldDownloadAvatars: false, shouldDownloadCovers: false,
        shouldDownloadMusicCovers: false, shouldDownloadSlideshowImages: false,
        shouldDownloadVideos: false, topLevelCommentsPerPost: 0,
        profileScrapeSections: ['videos'], profileSorting: 'latest',
        downloadSubtitlesOptions: 'NEVER_DOWNLOAD_SUBTITLES',
        maxResults: max,
      };
      const input = searchType === 'hashtag'
        ? { ...base, hashtags: queries }
        : { ...base, searchQueries: queries };


      const items = await fetchActorItems(ttActorId, input);
      for (const item of items) {
        if(item.text === ""){
          item.text = "Sin Texto";
        }
      }

      setTtData(prev => [...prev, ...tagItems(items)]);
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
      await buildSheet(wb, 'TikTok', ttData, TT_EXCEL_COLS,
        item => getValue(item, 'videoMeta.coverUrl'));
      await downloadWorkbook(wb, 'tiktok.xlsx');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return { queries, setQueries, max, setMax, searchType, setSearchType, dateRange, setDateRange, loading, error, exporting, run, exportExcel };
}
