import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Settings from './components/Settings';
import StatsRow from './components/StatsRow';
import YouTubeScraper from './scrapers/YouTubeScraper';
import TikTokScraper from './scrapers/TikTokScraper';
import FacebookScraper from './scrapers/FacebookScraper';
import InstagramScraper from './scrapers/InstagramScraper';
import GoogleNewsScraper from './scrapers/GoogleNewsScraper';
import MasterScraper from './scrapers/MasterScraper';
import './App.css';
import cnpLogo from "./assets/cnp.png";

import 'primeicons/primeicons.css';
        
function Shell() {
  const [activeTab, setActiveTab] = useState('youtube');
  const [lightMode, setLightMode] = useState(false);
  const { ytData, ttData, fbData, igData, gnData, exporting, exportAll } = useApp();
  const masterCount = ytData.length + ttData.length + fbData.length + igData.length + gnData.length;

  React.useEffect(() => {
    document.body.classList.toggle('theme-light', lightMode);
  }, [lightMode]);

  return (
    <div className="app">
      <header className="app-header">
        <img src={cnpLogo} alt="CNP Logo" style={{height: "50px"}} />
        <h1 style={{alignSelf:"center"}}>Cooltural Listening</h1>

      </header>

      <Settings />
      <StatsRow />

      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'master'   ? 'active' : ''}`} onClick={() => setActiveTab('master')}>
          <i className="pi pi-globe color-accent"></i>
          Maestro {masterCount > 0 && <span className="badge">{masterCount}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'youtube'  ? 'active' : ''}`} onClick={() => setActiveTab('youtube')}>
          <i className="pi pi-youtube color-accent"></i>
          YouTube {ytData.length > 0 && <span className="badge">{ytData.length}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'tiktok'   ? 'active' : ''}`} onClick={() => setActiveTab('tiktok')}>
          <i className="pi pi-tiktok color-accent"></i>
          TikTok {ttData.length > 0 && <span className="badge">{ttData.length}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'facebook' ? 'active' : ''}`} onClick={() => setActiveTab('facebook')}>
          <i className="pi pi-facebook color-accent"></i>
          Facebook {fbData.length > 0 && <span className="badge">{fbData.length}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'instagram' ? 'active' : ''}`} onClick={() => setActiveTab('instagram')}>
          <i className="pi pi-instagram color-accent"></i>
          Instagram {igData.length > 0 && <span className="badge">{igData.length}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'google-news' ? 'active' : ''}`} onClick={() => setActiveTab('google-news')}>
          <i className="pi pi-book color-accent"></i>
          Google News {gnData.length > 0 && <span className="badge">{gnData.length}</span>}
        </button>
        {(ytData.length > 0 || ttData.length > 0 || fbData.length > 0 || igData.length > 0 || gnData.length > 0) && (
          <button className="btn-export-all" onClick={exportAll} disabled={exporting}>
            {exporting ? <><span className="spinner" />Exportando…</> :  <><i className="pi pi-file-export color-accent" style={{paddingRight: "2px", top: "2px", position: "relative"}}></i> Exportar todo</>}
          </button>
        )}
      </div>

      {activeTab === 'master' && <MasterScraper />}
      {activeTab === 'youtube'  && <YouTubeScraper />}
      {activeTab === 'tiktok'   && <TikTokScraper />}
      {activeTab === 'facebook' && <FacebookScraper />}
      {activeTab === 'instagram' && <InstagramScraper />}
      {activeTab === 'google-news' && <GoogleNewsScraper />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
