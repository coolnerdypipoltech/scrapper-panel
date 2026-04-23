import React from 'react';
import Cell from './Cell';

export default function DataTable({ data, columns, onDelete }) {
  console.log(data);
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th className="col-num">#</th>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
            <th className="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item._id}>
              <td className="col-num">{idx + 1}</td>
              {columns.map(c => <td key={c.key}><Cell col={c} item={item} /></td>)}
              <td className="col-actions">
                <button className="btn-delete" onClick={() => onDelete(item._id)} title="Eliminar fila">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
