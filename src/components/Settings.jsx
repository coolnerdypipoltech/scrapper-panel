import React from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const {
    apiKey, setApiKey, apiVisible, setApiVisible,
    ytActorId, setYtActorId,
    ttActorId, setTtActorId,
    fbActorId, setFbActorId,
    igActorId, setIgActorId,
    gnActorId, setGnActorId,
    settingsOpen, setSettingsOpen,
  } = useApp();

  return (
    <section className="card settings-section">
      <button className="settings-toggle" onClick={() => setSettingsOpen(o => !o)}>
        <span>⚙️ Configuración</span>
        <span className="chevron">{settingsOpen ? '▲' : '▼'}</span>
      </button>

      {settingsOpen && (
        <div className="settings-body">
          <div className="field-group">
            <label>API Key · APIFY</label>
            <div className="api-key-row">
              <input
                type={apiVisible ? 'text' : 'password'}
                className="api-key-field"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                autoComplete="off"
                spellCheck={false}
              />
              <button className="btn-icon" onClick={() => setApiVisible(v => !v)}>
                {apiVisible ? '🙈' : '👁'}
              </button>
            </div>
            <p className="field-hint">Se guarda en localStorage de tu navegador. No uses en equipos compartidos.</p>
          </div>

          <div className="field-row-actors">
            <div className="field-group">
              <label>Actor ID · YouTube</label>
              <input type="text" value={ytActorId} onChange={e => setYtActorId(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Actor ID · TikTok</label>
              <input type="text" value={ttActorId} onChange={e => setTtActorId(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Actor ID · Facebook</label>
              <input type="text" value={fbActorId} onChange={e => setFbActorId(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Actor ID · Instagram</label>
              <input type="text" value={igActorId} onChange={e => setIgActorId(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Actor ID · Google News</label>
              <input type="text" value={gnActorId} onChange={e => setGnActorId(e.target.value)} placeholder="Pega aquí el actor ID" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
