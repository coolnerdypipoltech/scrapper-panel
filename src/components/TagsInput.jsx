import React, { useState, useRef } from 'react';

export default function TagsInput({ queries, onQueriesChange, platform }) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const addTag = (val) => {
    const tag = val.trim().replace(/^#/, '');
    if (tag && !queries.includes(tag)) onQueriesChange([...queries, tag]);
    setDraft('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (draft.trim()) addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && queries.length > 0) {
      onQueriesChange(queries.slice(0, -1));
    }
  };

  const placeholder = queries.length === 0
    ? (platform === 'youtube'
        ? 'Añade búsquedas, Enter para confirmar…'
        : 'Añade hashtags/keywords, Enter para confirmar…')
    : '';

  return (
    <div className="tags-input" onClick={() => inputRef.current?.focus()}>
      {queries.map(q => (
        <span key={q} className="tag">
          {platform === 'tiktok' ? `#${q}` : q}
          <button
            className="tag-remove"
            onClick={e => { e.stopPropagation(); onQueriesChange(queries.filter(x => x !== q)); }}
          >×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="tag-draft"
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => { if (draft.trim()) addTag(draft); }}
        placeholder={placeholder}
      />
    </div>
  );
}
