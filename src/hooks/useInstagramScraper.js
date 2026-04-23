import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getValue } from '../utils/helpers';
import { buildSheet, downloadWorkbook } from '../utils/excelHelpers';
import { IG_EXCEL_COLS } from '../config/columns';
import { DEFAULT_IG_PROFILE_ACTOR } from '../utils/helpers';

export function useInstagramScraper() {
  const { apiKey, igActorId, fetchActorItems, tagItems, igData, setIgData } = useApp();

  const [queries, setQueries] = useState([]);
  const [startDate,   setStartDate]   = useState('');
  const [searchLimit, setSearchLimit] = useState(10);
  const [resultsLimit, setResultsLimit] = useState(100);
  const [searchType, setSearchType] = useState('user');
  const [resultsType, setResultsType] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [profilesLoading, setProfilesLoading] = useState(false);
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
        if(searchType === "hashtag") {
          setIgData(prev => [...prev, ...tagItems(normalizeDataHT(items))]);
        }else{
          if(searchType === "place") {
            setIgData(prev => [...prev, ...tagItems(normalizeDataPlace(items))]);
          }else{
            setIgData(prev => [...prev, ...tagItems(items)]);
          }
        }
        
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const normalizeDataPlace = (data) => {
    let tempData = [];
    data.forEach(item => {
      let tempObject = {
        ownerUsername: "Place", 
        ownerFullName: item.name,
        caption: item.category,
        likesCount: item.posts.length,
        locationName: item.location_address,
        type: "place",
        url: item.inputUrl,
      }
      tempData.push(tempObject);
    });
    return tempData;
  }

  const normalizeDataHT = (data) => {
    let tempData = [];
    data.forEach(item => {
      let tempObject = {
        ownerUsername: "Hashtag", 
        ownerFullName: item.name,
        likesCount: item.postsCount,
        type: "hashtag",
      }
      tempData.push(tempObject);
    });
    return tempData;
  }

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

  const fetchAuthorsProfiles = async () => {
    if (!igData.length) {
      setError('No hay datos de Instagram para enriquecer.');
      return;
    }
    if (!apiKey.trim()) {
      setError('Ingresa tu API Key de APIFY en Configuración.');
      return;
    }

    const usernames = Array.from(
      new Set(
        igData
          .map(item => String(item.ownerUsername || '').trim())
          .filter(username => username && username !== 'Hashtag' && username !== 'Place')
      )
    );

    if (!usernames.length) {
      setError('No hay autores válidos en la tabla para consultar perfiles.');
      return;
    }

    setProfilesLoading(true);
    setError('');
    try {
      const profileItems = await fetchActorItems(DEFAULT_IG_PROFILE_ACTOR, {
        includeAboutSection: false,
        usernames,
      });

      const profilesByUsername = new Map(
        profileItems
          .map(profile => [String(profile.username || '').toLowerCase(), profile])
          .filter(([username]) => username)
      );

      setIgData(prev => prev.map(item => {
        const ownerUsername = String(item.ownerUsername || '').toLowerCase();
        const profile = profilesByUsername.get(ownerUsername);
        if (!profile) return item;

        return {
          ...item,
          profileFullName: profile.fullName,
          profilePicUrl: profile.profilePicUrl,
          profileUsername: profile.username,
          profilePostsCount: profile.postsCount,
          profileFollowersCount: profile.followersCount,
          profileFollowsCount: profile.followsCount,
        };
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setProfilesLoading(false);
    }
  };

  return {
    queries, setQueries,
    searchLimit, setSearchLimit,
    resultsLimit, setResultsLimit,
    searchType, setSearchType,
    startDate, setStartDate,
    resultsType, setResultsType,
    loading, profilesLoading, error, exporting,
    run, fetchAuthorsProfiles, exportExcel,
  };
}