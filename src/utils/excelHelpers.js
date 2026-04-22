import { getValue } from './helpers';

export const IMG_ROW_H   = 51;  // points ≈ 68 px
export const IMG_W       = 120; // px
export const IMG_H       = 68;  // px
export const THUMB_COL_W = 17;  // chars ≈ 120 px

export const fetchImageAsBase64 = async (url) => {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    const ext = blob.type === 'image/png' ? 'png' : 'jpeg';
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload  = () => resolve({ data: reader.result.split(',')[1], ext });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
};

export const downloadWorkbook = async (wb, filename) => {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const buildSheet = async (wb, wsName, data, colsDef, getThumbUrl) => {
  const ws = wb.addWorksheet(wsName);
  ws.columns = colsDef.map(({ header, key, width }) => ({ header, key, width }));
  ws.getRow(1).font = { bold: true };
  const imgList = await Promise.all(data.map(item => fetchImageAsBase64(getThumbUrl(item))));
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const rowData = {};
    colsDef.forEach((col, idx) => {
      if (idx > 0) {
        const raw = getValue(item, col.srcKey) ?? '';
        rowData[col.key] = col.transform ? col.transform(raw) : raw;
      }
    });
    const exRow = ws.addRow(rowData);
    exRow.height = IMG_ROW_H;
    const img = imgList[i];
    if (img) {
      const imgId = wb.addImage({ base64: img.data, extension: img.ext });
      ws.addImage(imgId, {
        tl: { col: 0, row: i + 1 },
        ext: { width: IMG_W, height: IMG_H },
        editAs: 'oneCell',
      });
    }
  }
};
