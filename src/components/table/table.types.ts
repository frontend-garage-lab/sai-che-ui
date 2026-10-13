import {
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures
} from '@tanstack/lit-table';
import type { ColumnDef } from '@tanstack/lit-table';

/** Per-column presentation options. Declared as the `columnMeta` type-only slot below, so it's available on `columnDef.meta`. */
export interface SlTableColumnMeta {
  /** The column's CSS grid track, e.g. `1fr`, `12rem`, `minmax(8rem, 1fr)`. Default `1fr`. */
  width?: string;
  /** Horizontal alignment of the header and its cells. */
  align?: 'start' | 'center' | 'end';
  /** Truncates the column's cells with an ellipsis instead of wrapping them. */
  nowrap?: boolean;
  /** Marks this as the trailing row-actions column. Mutually exclusive with an accessor/cell. */
  actions?: boolean;
}

/** The feature set every `sl-table` instance registers: single-column sorting, pagination and row selection. */
export const slTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnMeta: metaHelper<SlTableColumnMeta>()
});

export type SlTableFeatures = typeof slTableFeatures;

/** A column definition for `sl-table`. `header`/`cell` may return a Lit template, a string, a `Node`, or `null`/`undefined` to render nothing. */
export type SlTableColumnDef<TData extends Record<string, unknown>> = ColumnDef<SlTableFeatures, TData, unknown>;
