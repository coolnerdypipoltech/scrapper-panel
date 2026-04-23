import React from 'react';
import { getValue, formatNumber } from '../utils/helpers';

const REACTION_EMOJIS = { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😠', care: '🤗' };

function ThumbnailWithFallback({ href, urls, alt, className, referrerPolicy = 'no-referrer' }) {
  const uniqueUrls = React.useMemo(() => urls.filter((url, index) => url && urls.indexOf(url) === index), [urls]);
  const [srcIndex, setSrcIndex] = React.useState(0);

  React.useEffect(() => {
    setSrcIndex(0);
  }, [uniqueUrls]);

  const src = uniqueUrls[srcIndex];

  if (!src) {
    return (
      <a href={String(href || '#')} target="_blank" rel="noopener noreferrer" className="cell-link" title="Abrir publicación">
        ↗
      </a>
    );
  }

  return (
    <a href={String(href || '#')} target="_blank" rel="noopener noreferrer">
      <img
        className={className}
        src={String(src)}
        alt={alt}
        loading="lazy"
        referrerPolicy={referrerPolicy}
        onError={() => setSrcIndex(prev => prev + 1)}
      />
    </a>
  );
}

function GnThumbnail({ url, href }) {
  const [src, setSrc] = React.useState(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then(res => {
        const ct = res.headers.get('content-type') || 'image/jpeg';
        return res.text().then(b64 => ({ b64, ct }));
      })
      .then(({ b64, ct }) => {
        if (cancelled) return;
        // Strip any data: prefix the server may already include
        const raw = b64.replace(/^data:[^;]+;base64,/, '').trim();
        const mime = ct.split(';')[0].trim();
        setSrc(`data:${mime};base64,${raw}`);
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [url]);

  if (failed) return <a href={String(href || '#')} target="_blank" rel="noopener noreferrer" className="cell-link" title="Abrir noticia">↗</a>;
  if (!src)   return <span className="cell-null cell-loading">…</span>;
  return (
    <a href={String(href || '#')} target="_blank" rel="noopener noreferrer">
      <img className="cell-thumbnail" src={src} alt="news" loading="lazy" />
    </a>
  );
}

export default function Cell({ col, item }) {
  const val = getValue(item, col.key);
  if (val == null || val === '') return <span className="cell-null">—</span>;

  switch (col.type) {
    case 'thumbnail':
      return (
        <a href={`https://www.youtube.com/watch?v=${String(val)}`} target="_blank" rel="noopener noreferrer">
          <img className="cell-thumbnail" src={`https://img.youtube.com/vi/${String(val)}/mqdefault.jpg`} alt="thumbnail" loading="lazy" />
        </a>
      );

    case 'tt-thumbnail': {
      const href = getValue(item, col.linkKey) || '#';
      return (
        <a href={String(href)} target="_blank" rel="noopener noreferrer">
          <img className="cell-thumbnail" src={String(val)} alt="cover" loading="lazy" referrerPolicy="no-referrer" />
        </a>
      );
    }

    case 'fb-thumbnail': {
      const href = getValue(item, col.linkKey) || '#';
      return (
        <a href={String(href)} target="_blank" rel="noopener noreferrer">
          <img className="cell-avatar" src={String(val)} alt="avatar" loading="lazy" referrerPolicy="no-referrer" />
        </a>
      );
    }

    case 'ig-thumbnail': {
      const href = getValue(item, col.linkKey) || '#';
      const urls = [
        val,
        getValue(item, 'images.0'),
        getValue(item, 'childPosts.0.displayUrl'),
        getValue(item, 'childPosts.1.displayUrl'),
        getValue(item, 'childPosts.2.displayUrl'),
      ];
      return (
        <ThumbnailWithFallback
          href={href}
          urls={urls}
          alt="preview"
          className="cell-thumbnail"
          referrerPolicy="no-referrer"
        />
      );
    }

    case 'news-thumbnail': {
      const href = getValue(item, col.linkKey) || '#';
      return (
        <a href={String(href)} target="_blank" rel="noopener noreferrer">
          <img className="cell-thumbnail" src={String(val)} alt="news" loading="lazy" referrerPolicy="no-referrer" />
        </a>
      );
    }

    case 'gn-thumbnail': {
      const href = getValue(item, col.linkKey) || '#';
      return <GnThumbnail url={String(val)} href={href} />;
    }

    case 'fb-author': {
      const href = getValue(item, col.linkKey) || '#';
      return (
        <a href={String(href)} target="_blank" rel="noopener noreferrer" className="cell-author-link">
          {String(val)}
        </a>
      );
    }

    case 'reactions': {
      if (typeof val !== 'object' || val === null) return <span className="cell-number">{formatNumber(val)}</span>;
      const entries = Object.entries(val).filter(([, n]) => n > 0);
      if (entries.length === 0) return <span className="cell-null">—</span>;
      return (
        <span className="cell-reactions">
          {entries.map(([k, n]) => (
            <span key={k} className="cell-reaction-item" title={k}>
              {REACTION_EMOJIS[k] || '👍'} {formatNumber(n)}
            </span>
          ))}
        </span>
      );
    }

    case 'link':
      return (
        <a href={String(val)} target="_blank" rel="noopener noreferrer" className="cell-link" title={String(val)}>↗</a>
      );

    case 'date':
      return (
        <span>{new Date(val).toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
      );

    case 'number':
      return <span className="cell-number">{formatNumber(val)}</span>;

    default:
      return col.truncate
        ? <span className="cell-truncate" title={String(val)}>{String(val)}</span>
        : <span>{String(val)}</span>;
  }
}
