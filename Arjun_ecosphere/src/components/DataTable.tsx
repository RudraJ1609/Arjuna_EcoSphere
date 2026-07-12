import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortKey?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  actions?: (item: T) => React.ReactNode;
  actionsHeader?: string;
  pageSize?: number;
  emptyMessage?: string;
  id?: string;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchFilter,
  actions,
  actionsHeader = 'Actions',
  pageSize = 6,
  emptyMessage = 'No records found.',
  id
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search logic
  const filteredData = useMemo(() => {
    if (!query.trim() || !searchFilter) return data;
    return data.filter((item) => searchFilter(item, query.toLowerCase()));
  }, [data, query, searchFilter]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    const sorted = [...filteredData].sort((a: any, b: any) => {
      // Safely access sortKey
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortKey, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: string) => {
    if (!key) return;
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div id={id} className="bg-[#161a22] border border-[#262b36] rounded-xl overflow-hidden shadow-xl">
      {/* Search Header */}
      {searchFilter && (
        <div className="p-4 border-b border-[#262b36] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm font-semibold text-gray-300">
            Records found: <span className="text-white font-mono">{filteredData.length}</span>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-[#0d0f14] text-white border border-[#262b36] rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-slate-500 transition-colors"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2" />
          </div>
        </div>
      )}

      {/* Responsive Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1f29] border-b border-[#262b36]">
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(col.sortKey)}
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none ${
                    col.sortKey ? 'cursor-pointer hover:text-white transition-colors' : ''
                  } ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.header}
                    {col.sortKey && sortKey === col.sortKey && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262b36]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-8 text-sm text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[#1a1f29]/50 transition-colors duration-150 odd:bg-[#161a22] even:bg-[#181d26]"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-5 py-3 text-xs text-gray-300 font-medium ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.accessor(item)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-3 text-xs text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 bg-[#1a1f29] border-t border-[#262b36] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-gray-400">
            Showing <span className="text-white font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="text-white font-semibold">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="text-white font-semibold">{sortedData.length}</span> entries
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-[#0d0f14] border border-[#262b36] text-gray-400 hover:text-white hover:border-slate-500 disabled:opacity-50 disabled:hover:border-[#262b36] disabled:hover:text-gray-400 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-xs font-semibold rounded border transition-all ${
                  currentPage === page
                    ? 'bg-slate-500/20 text-white border-slate-500'
                    : 'bg-[#0d0f14] text-gray-400 border-[#262b36] hover:text-white hover:border-slate-500'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-[#0d0f14] border border-[#262b36] text-gray-400 hover:text-white hover:border-slate-500 disabled:opacity-50 disabled:hover:border-[#262b36] disabled:hover:text-gray-400 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
