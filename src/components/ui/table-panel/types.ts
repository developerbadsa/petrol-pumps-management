import type { ReactNode } from 'react';

export type SortDir = 'asc' | 'desc';
export type SortState = { id: string; dir: SortDir };

export type ColumnDef<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;

  // layout
  headerClassName?: string;
  cellClassName?: string;
  align?: 'left' | 'center' | 'right';
  minWidth?: number;

  // sorting
  sortable?: boolean;
  sortValue?: (row: T) => string | number;

  // export
  csvHeader?: string;
  csvValue?: (row: T) => string | number;

};
