import React, { useState } from 'react';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import Cell from './Cell';
import BubbleChart from './BubbleChart';

import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const SORTABLE_TYPES = new Set(['number', 'text', 'date']);

export default function DataTable({ data, columns, onDelete }) {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const globalFilterFields = columns
    .filter(c => SORTABLE_TYPES.has(c.type))
    .map(c => c.key);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, global: { value: value || null, matchMode: FilterMatchMode.CONTAINS } }));
    setGlobalFilterValue(value);
  };

  const header = (
    <div className="dt-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" style={{top: "7px"}} />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar en tabla..."
        />
      </span>
    </div>
  );

  const deleteBodyTemplate = (rowData) => (
    <button className="btn-delete" onClick={() => onDelete(rowData._id)} title="Eliminar fila">✕</button>
  );


  return (
    <>
      <BubbleChart data={data} columns={columns} />
      <div className="table-wrapper">
      <PrimeDataTable
        value={data}
        dataKey="_id"
        filters={filters}
        globalFilterFields={globalFilterFields}
        header={header}
        removableSort
        paginator={data.length > 10}
        rows={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
        emptyMessage="Sin resultados"
        className="data-table-prime"
      >
        <Column
          header="#"
          headerClassName="col-num"
          bodyClassName="col-num"
          body={(_, { rowIndex }) => rowIndex + 1}
          style={{ width: '3rem' }}
        />
        {columns.map(col => (
          <Column
            key={col.key}
            field={col.key}
            header={col.label}
            sortable={SORTABLE_TYPES.has(col.type)}
            body={(rowData) => <Cell col={col} item={rowData} />}
          />
        ))}
        <Column
          headerClassName="col-actions"
          bodyClassName="col-actions"
          body={deleteBodyTemplate}
          style={{ width: '3rem' }}
        />
      </PrimeDataTable>
    </div>
    </>
  );
}
