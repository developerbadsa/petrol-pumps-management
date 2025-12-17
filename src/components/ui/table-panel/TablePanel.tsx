'use client';

import type {ReactNode} from 'react';
import type {ColumnDef, SortState} from './types';
import {exportRowsToCsv} from './exportCsv';
import {useTablePanel} from './useTablePanel';

function cx(...v: Array<string | false | null | undefined>) {
   return v.filter(Boolean).join(' ');
}

function alignClass(align?: ColumnDef<any>['align']) {
   if (align === 'center') return 'text-center';
   if (align === 'right') return 'text-right';
   return 'text-left';
}

function justifyClass(align?: ColumnDef<any>['align']) {
   if (align === 'center') return 'justify-center';
   if (align === 'right') return 'justify-end';
   return 'justify-start';
}

function SortIcon({active, dir}: {active: boolean; dir: SortState['dir']}) {
   return (
      <span
         className={cx(
            'ml-2 inline-flex items-center',
            active ? 'opacity-100' : 'opacity-60'
         )}>
         <svg width='10' height='10' viewBox='0 0 24 24' aria-hidden='true'>
            <path
               d='M8 10l4-4 4 4'
               fill='none'
               stroke='currentColor'
               strokeWidth='2'
               strokeLinecap='round'
               strokeLinejoin='round'
               opacity={active && dir === 'asc' ? 1 : 0.5}
            />
            <path
               d='M16 14l-4 4-4-4'
               fill='none'
               stroke='currentColor'
               strokeWidth='2'
               strokeLinecap='round'
               strokeLinejoin='round'
               opacity={active && dir === 'desc' ? 1 : 0.5}
            />
         </svg>
      </span>
   );
}

function getPages(page: number, pageCount: number) {
   if (pageCount <= 7) return Array.from({length: pageCount}, (_, i) => i + 1);

   const items: Array<number | '...'> = [];
   const left = Math.max(1, page - 2);
   const right = Math.min(pageCount, page + 2);

   items.push(1);
   if (left > 2) items.push('...');

   for (let p = left; p <= right; p++) {
      if (p !== 1 && p !== pageCount) items.push(p);
   }

   if (right < pageCount - 1) items.push('...');
   items.push(pageCount);
   return items;
}

type Props<T> = {
   rows: T[];
   columns: ColumnDef<T>[];
   getRowKey: (row: T, index: number) => string;

   searchText?: (row: T) => string;

   exportFileName?: string;
   exportLabel?: string;

   totalLabel?: (filteredTotal: number) => ReactNode;

   className?: string;
};

export default function TablePanel<T>({
   rows,
   columns,
   getRowKey,
   searchText,
   exportFileName = 'export.csv',
   exportLabel = 'Export to Excel',
   totalLabel,
   className,
}: Props<T>) {
   const s = useTablePanel({rows, columns, searchText});

   const headerLeft = totalLabel?.(s.filteredTotal) ?? (
      <div className='text-[14px] font-semibold text-[#2D8A2D]'>
         Total Members :{' '}
         <span className='text-[#133374]'>{s.filteredTotal}</span>
      </div>
   );

   return (
      <div
         className={cx(
            'rounded-[18px] bg-white/80 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] backdrop-blur md:p-6',
            className
         )}>
         {/* top bar */}
         <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            {headerLeft}

            {Boolean(exportFileName) && (
               <button
                  type='button'
                  onClick={() =>
                     exportRowsToCsv(s.sortedRows, columns, exportFileName)
                  }
                  className='inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[12px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95'>
                  <span className='inline-flex h-4 w-4 items-center justify-center'>
                     <svg
                        width='13'
                        height='15'
                        viewBox='0 0 13 15'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <g clip-path='url(#clip0_164_9936)'>
                           <path
                              d='M9.10252 7.09343C9.10252 9.28599 9.10252 11.4781 9.10252 13.6707C9.10252 13.7215 9.10374 13.7724 9.10171 13.8228C9.09154 14.0904 8.94309 14.2198 8.67548 14.1844C8.36435 14.1433 8.05403 14.0937 7.7433 14.0494C6.92664 13.9326 6.10956 13.8171 5.29289 13.7004C4.47622 13.5837 3.65996 13.4657 2.84329 13.3486C2.10186 13.2424 1.36044 13.1339 0.618195 13.0334C0.261513 12.985 0.0280628 12.7515 0.00366037 12.3932C0.000813415 12.353 0.00122012 12.3119 0.00122012 12.2716C0.00162683 8.81991 0.00203354 5.36899 0 1.91767C0 1.66552 0.0439244 1.42515 0.270054 1.29378C0.425416 1.2035 0.616975 1.15957 0.79796 1.13232C1.77365 0.985094 2.75138 0.84844 3.72869 0.709753C4.69096 0.573099 5.65323 0.438886 6.6151 0.301825C7.28169 0.207062 7.94829 0.112706 8.61407 0.011436C8.95204 -0.0398092 9.10211 0.0793561 9.10211 0.424651C9.10293 2.64731 9.10211 4.87037 9.10211 7.09303L9.10252 7.09343ZM7.1365 9.68701C7.09135 9.61787 7.06288 9.5715 7.03197 9.52717C6.49187 8.75443 5.95298 7.98046 5.40799 7.21057C5.34332 7.11906 5.34902 7.0613 5.41084 6.97305C5.95216 6.20722 6.4882 5.43732 7.02587 4.66905C7.05922 4.62106 7.09176 4.57266 7.14097 4.50108C6.62445 4.50108 6.13884 4.49823 5.65323 4.50555C5.60768 4.50637 5.55196 4.56249 5.52024 4.60682C5.27581 4.94927 5.03626 5.29538 4.79467 5.64027C4.7174 5.75049 4.63891 5.85948 4.55187 5.9819C4.22284 5.51216 3.90399 5.06193 3.59163 4.60723C3.53551 4.52548 3.47694 4.49742 3.38015 4.49864C2.9592 4.50352 2.53785 4.50067 2.11691 4.50108C2.07502 4.50108 2.03313 4.50759 1.97538 4.51247C2.01768 4.5751 2.04737 4.62106 2.07868 4.6662C2.61635 5.43488 3.15198 6.20478 3.69453 6.9702C3.76286 7.06659 3.75716 7.1276 3.69128 7.22073C3.14629 7.99063 2.607 8.76419 2.06648 9.53734C2.0372 9.57964 2.01036 9.62356 1.96928 9.6866C2.41178 9.6866 2.82296 9.67481 3.23292 9.69148C3.43749 9.70002 3.58025 9.65528 3.67379 9.46332C3.72422 9.36001 3.80475 9.27095 3.87186 9.17578C4.09514 8.85732 4.31801 8.53928 4.54984 8.20822C4.59295 8.26516 4.6267 8.30786 4.65761 8.35179C4.93987 8.75443 5.22538 9.15503 5.50113 9.56215C5.56661 9.65895 5.63656 9.69067 5.74962 9.68863C6.10956 9.68172 6.4699 9.68619 6.83025 9.68619H7.1365V9.68701Z'
                              fill='white'
                           />
                           <path
                              d='M9.76017 1.24696C10.2084 1.24696 10.6444 1.24696 11.0799 1.24696C11.5009 1.24696 11.9222 1.24574 12.3432 1.24737C12.6958 1.24899 12.9606 1.4918 12.9939 1.84116C12.9992 1.89647 13 1.9526 13 2.00832C13 5.39822 13 8.78854 13 12.1784C13 12.5827 12.8438 12.8239 12.5225 12.9166C12.4745 12.9304 12.4233 12.9394 12.3737 12.9394C11.5265 12.9406 10.6789 12.9402 9.83175 12.9402C9.81182 12.9402 9.7923 12.937 9.75977 12.9341V1.24696H9.76017Z'
                              fill='white'
                           />
                        </g>
                        <defs>
                           <clipPath id='clip0_164_9936'>
                              <rect width='13' height='14.1896' fill='white' />
                           </clipPath>
                        </defs>
                     </svg>
                  </span>
                  {exportLabel}
               </button>
            )}
         </div>

         {/* controls row */}
         <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-2 text-[11px] text-[#6F8093]'>
               <span>Show</span>
               <select
                  value={s.pageSize}
                  onChange={e => s.setPageSize(Number(e.target.value))}
                  className='h-8 w-[64px] rounded-[6px] border border-black/10 bg-white px-2 text-[11px] text-[#2B3A4A] shadow-sm outline-none focus:border-[#0B8B4B]'>
                  {s.pageSizeOptions.map(n => (
                     <option key={n} value={n}>
                        {n}
                     </option>
                  ))}
               </select>
            </div>

            <label className='flex items-center gap-2 text-[11px] text-[#6F8093]'>
               <span>Search:</span>
               <input
                  value={s.query}
                  onChange={e => s.setQuery(e.target.value)}
                  className='h-8 w-full rounded-[6px] border border-black/10 bg-white px-3 text-[11px] text-[#2B3A4A] shadow-sm outline-none focus:border-[#0B8B4B] md:w-[220px]'
               />
            </label>
         </div>

         {/* table */}
         <div className='mt-4 overflow-hidden rounded-[12px] border border-black/10 bg-white'>
            <div className='overflow-x-auto'>
               <table className='w-full border-collapse'>
                  <thead className='bg-[#009970]'>
                     <tr>
                        {columns.map((col, idx) => {
                           const active = s.sort.id === col.id;
                           const clickable = Boolean(col.sortable);

                           const headerNode =
                              typeof col.header === 'string' ||
                              typeof col.header === 'number' ? (
                                 <span className='truncate'>{col.header}</span>
                              ) : (
                                 col.header
                              );

                           return (
                              <th
                                 key={col.id}
                                 scope='col'
                                 className={cx(
                                    'h-[54px] px-4 py-0 align-middle whitespace-nowrap text-[11px] font-semibold text-white',
                                    alignClass(col.align),
                                    idx !== columns.length - 1 &&
                                       'border-r border-white/15',
                                    col.headerClassName
                                 )}>
                                 <button
                                    type='button'
                                    onClick={() =>
                                       clickable && s.toggleSort(col.id)
                                    }
                                    disabled={!clickable}
                                    className={cx(
                                       'flex h-[54px] w-full items-center gap-2',
                                       justifyClass(col.align),
                                       !clickable && 'cursor-default'
                                    )}>
                                    {headerNode}
                                    {col.sortable && (
                                       <SortIcon
                                          active={active}
                                          dir={s.sort.dir}
                                       />
                                    )}
                                 </button>
                              </th>
                           );
                        })}
                     </tr>
                  </thead>

                  <tbody>
                     {s.pageRows.map((row, rIdx) => (
                        <tr
                           key={getRowKey(row, rIdx)}
                           className='border-t border-black/5 py-2'>
                           {columns.map((col, cIdx) => (
                              <td
                                 key={col.id}
                                 className={cx(
                                    'px-4  text-[11px] text-primary ',
                                    // alignClass(col.align),
                                    cIdx !== columns.length - 1 &&
                                       'border-r border-black/5'
                                    // col.cellClassName
                                 )}>
                                 <div className='min-h-[60px] py-2 flex items-center'>
                                    {col.cell(row)}
                                 </div>
                              </td>
                           ))}
                        </tr>
                     ))}

                     {s.pageRows.length === 0 && (
                        <tr>
                           <td
                              colSpan={columns.length}
                              className='px-4 py-10 text-center text-[12px] text-[#7B8EA3]'>
                              No matching results.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* footer */}
         <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <p className='text-[11px] text-[#7B8EA3]'>
               Showing {s.showingFrom} to {s.showingTo} of {s.filteredTotal}{' '}
               entries
            </p>

            <div className='flex items-center gap-2 border border-black/10 rounded-[9px] '>
               <button
                  type='button'
                  disabled={s.page <= 1}
                  onClick={() => s.setPage(s.page - 1)}
                  className='h-7  border-none bg-white px-3 text-[11px] text-[#6F8093] disabled:opacity-60'>
                  Previous
               </button>

               <div className='flex items-center gap-1 bg-[#F5F7F9] p-[2px]'>
                  {getPages(s.page, s.pageCount).map((p, idx) =>
                     p === '...' ? (
                        <span
                           key={`e-${idx}`}
                           className='px-2 text-[11px] text-[#6F8093]'>
                           ...
                        </span>
                     ) : (
                        <button
                           key={p}
                           type='button'
                           onClick={() => s.setPage(p)}
                           className={cx(
                              'h-7 min-w-7 rounded-none  px-2 text-[11px]',
                              p === s.page ? ' bg-[#75B551] text-white' : ' '
                           )}>
                           {String(p).padStart(2, '0')}
                        </button>
                     )
                  )}
               </div>

               <button
                  type='button'
                  disabled={s.page >= s.pageCount}
                  onClick={() => s.setPage(s.page + 1)}
                  className='h-7  bg-white px-3 text-[11px] text-[#6F8093] disabled:opacity-60'>
                  Next
               </button>
            </div>
         </div>
      </div>
   );
}
