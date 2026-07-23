import React, { useState } from 'react';
import { ChevronDown, Search, Download, Filter, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, searchPlaceholder = "Buscar...", onRowClick }: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  // Very naive filter for prototype
  const filteredData = query ? data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
  ) : data;

  return (
    <div className="bg-graphite border border-line rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-3 border-b border-line flex flex-col sm:flex-row gap-3 justify-between items-center bg-iron">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-zinc border border-line rounded-md pl-9 pr-3 py-1.5 text-13 text-eggshell focus:outline-none focus:border-stone placeholder:text-stone"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc border border-line rounded-md text-13 text-stone hover:text-eggshell transition-colors">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc border border-line rounded-md text-13 text-stone hover:text-eggshell transition-colors">
            <Columns className="w-4 h-4" /> Colunas
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc border border-line rounded-md text-13 text-stone hover:text-eggshell transition-colors ml-auto sm:ml-0">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-graphite">
              {columns.map((col, idx) => (
                <th key={idx} className={cn("px-4 py-3 text-11 font-bold text-stone uppercase tracking-wider whitespace-nowrap", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredData.length > 0 ? filteredData.map((item, rowIdx) => (
              <tr 
                key={rowIdx} 
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  "hover:bg-zinc transition-colors", 
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn("px-4 py-2.5 text-13 text-eggshell whitespace-nowrap", col.className)}>
                    {col.cell ? col.cell(item) : String((item as any)[col.accessorKey] || '-')}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-13 text-stone">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination */}
      <div className="p-3 border-t border-line bg-iron flex items-center justify-between text-12 text-stone">
        <span>Mostrando {filteredData.length} registros</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 bg-zinc border border-line rounded disabled:opacity-50" disabled>Anterior</button>
          <button className="px-2 py-1 bg-zinc border border-line rounded disabled:opacity-50" disabled>Próxima</button>
        </div>
      </div>
    </div>
  );
}