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
        <span>Configuración</span>
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


        </div>
      )}
    </section>
  );
}
