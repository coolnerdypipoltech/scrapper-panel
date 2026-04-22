import React from 'react';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../utils/helpers';

export default function StatsRow() {
  const { ytData, ttData, fbData, igData, gnData, stats: { ytViews, ttPlays, fbReactions, igLikes, gnArticles, total } } = useApp();

  return (
    <div className="stats-row">
      <div className="stat-card stat-yt">
        <span className="stat-platform">📺 YouTube</span>
        <span className="stat-value">{formatNumber(ytViews)}</span>
        <span className="stat-meta">vistas · {ytData.length} videos</span>
      </div>
      <div className="stat-card stat-tt">
        <span className="stat-platform">🎵 TikTok</span>
        <span className="stat-value">{formatNumber(ttPlays)}</span>
        <span className="stat-meta">reproducciones · {ttData.length} videos</span>
      </div>
      <div className="stat-card stat-fb">
        <span className="stat-platform">📘 Facebook</span>
        <span className="stat-value">{formatNumber(fbReactions)}</span>
        <span className="stat-meta">reacciones · {fbData.length} posts</span>
      </div>
      <div className="stat-card stat-ig">
        <span className="stat-platform">📸 Instagram</span>
        <span className="stat-value">{formatNumber(igLikes)}</span>
        <span className="stat-meta">likes · {igData.length} posts</span>
      </div>
      <div className="stat-card stat-gn">
        <span className="stat-platform">📰 Google News</span>
        <span className="stat-value">{formatNumber(gnArticles)}</span>
        <span className="stat-meta">artículos · {gnData.length} resultados</span>
      </div>
      <div className="stat-card stat-total">
        <span className="stat-platform">📊 Total</span>
        <span className="stat-value">{formatNumber(total)}</span>
        <span className="stat-meta">combinado · {ytData.length + ttData.length + fbData.length + igData.length + gnData.length} items</span>
      </div>
    </div>
  );
}
