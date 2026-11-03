/*
 * DMS-Downloads — mock data and table setup of the Downloads page.
 * No legacy screenshot: the page is designed from the pattern of "exports" lists (Google Takeout, Chrome downloads,
 * Salesforce data export): one row per background job, status, size, expiry and the actions that fit the state.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { documentFileCell, statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

/** Days a generated file stays available (shown in the page intro and in the Expires column). */
export const RETENTION_DAYS = 7;

const job = (name, format, description, status, size, requested, expires, extra = {}) => ({
  name,
  format,
  description,
  status,
  size,
  requested,
  expires,
  ...extra
});

/** Downloads of Mario Rossi on 99_PAGE_AM, newest first. Reference date: 2-Nov-2026. */
export const downloads = [
  job(
    'Documents-list_99_PAGE_AM_2026-11-02.xlsx',
    'xlsx',
    'Export documents list · 188 documents',
    'Processing',
    '—',
    '2-Nov-2026 10:42',
    '—',
    { progress: 65 }
  ),
  job(
    'Transmittal-package_TR-99-0043.zip',
    'zip',
    'Bulk download · 42 files',
    'Processing',
    '—',
    '2-Nov-2026 10:38',
    '—',
    { progress: 20 }
  ),
  job('Review-comments-report_PVA.pdf', 'pdf', 'Report · Review comments', 'Queued', '—', '2-Nov-2026 10:37', '—'),
  job(
    'Transmittal-package_TR-99-0042.zip',
    'zip',
    'Bulk download · 116 files',
    'Ready',
    '148.3 MB',
    '2-Nov-2026 09:15',
    '9-Nov-2026'
  ),
  job(
    'Documents-list_99_PAGE_AM_2026-11-01.xlsx',
    'xlsx',
    'Export documents list · 186 documents',
    'Ready',
    '1.2 MB',
    '1-Nov-2026 16:30',
    '8-Nov-2026'
  ),
  job('Isometric-package_IS-0098.zip', 'zip', 'Bulk download · 214 files', 'Failed', '—', '31-Oct-2026 08:50', '—', {
    error: 'Timeout while building the archive'
  }),
  job(
    'Distribution-matrix_DM-032154.xlsx',
    'xlsx',
    'Export distribution matrix · 34 distributions',
    'Ready',
    '86 KB',
    '30-Oct-2026 17:20',
    '6-Nov-2026'
  ),
  job(
    'As-built-dossier_Q2.zip',
    'zip',
    'Bulk download · 1,204 files',
    'Expired',
    '1.04 GB',
    '22-Oct-2026 14:00',
    '29-Oct-2026'
  ),
  job(
    'Task-list_PVA_2026-10-20.xlsx',
    'xlsx',
    'Export task list · 22 tasks',
    'Expired',
    '212 KB',
    '20-Oct-2026 09:12',
    '27-Oct-2026'
  )
];

/** Row actions follow the state of the job: Download lives here (no icon in the row), only for a ready file; retry when it failed. */
const rowMenu = ({ row }) => {
  const { status } = row.original;
  if (status === 'Ready')
    return html`
      <sl-menu>
        <sl-menu-item value="download"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-menu-item>
        <sl-menu-item value="link"><sl-icon slot="prefix" name="link-45deg"></sl-icon>Copy download link</sl-menu-item>
        <sl-divider></sl-divider>
        <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
      </sl-menu>
    `;
  if (status === 'Failed')
    return html`
      <sl-menu>
        <sl-menu-item value="retry"><sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>Retry</sl-menu-item>
        <sl-menu-item value="details"><sl-icon slot="prefix" name="info-circle"></sl-icon>View details</sl-menu-item>
        <sl-divider></sl-divider>
        <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
      </sl-menu>
    `;
  if (status === 'Expired')
    return html`
      <sl-menu>
        <sl-menu-item value="again"><sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>Request again</sl-menu-item>
        <sl-divider></sl-divider>
        <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
      </sl-menu>
    `;
  return html`
    <sl-menu>
      <sl-menu-item value="cancel"><sl-icon slot="prefix" name="x-circle"></sl-icon>Cancel job</sl-menu-item>
    </sl-menu>
  `;
};

/** The state of the job; what explains it (progress, error) has its own column. */
const statusCell = ({ row }) => statusTag(row.original.status);

/** Progress of a running job; every other state has nothing to show. */
const progressCell = ({ row }) => {
  const { status, progress } = row.original;
  return status === 'Processing'
    ? html`<sl-progress-bar value=${progress} label="Progress ${progress}%">${progress}%</sl-progress-bar>`
    : '—';
};

/** Why a job failed; every other state has nothing to show. */
const errorCell = ({ row }) => {
  const { error } = row.original;
  return error ? html`<span class="rs-truncate" title=${error}>${error}</span>` : '—';
};

export const downloadColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'File',
    enableSorting: true,
    meta: { width: 'minmax(14rem, 1fr)' },
    cell: ({ row }) => documentFileCell(row.original.format, row.original.name, row.original.description)
  },
  { id: 'status', header: 'Status', meta: { width: '8rem' }, cell: statusCell },
  { id: 'progress', header: 'Progress', meta: { width: '8rem' }, cell: progressCell },
  { id: 'error', header: 'Error', meta: { width: 'minmax(10rem, 1fr)' }, cell: errorCell },
  { id: 'size', accessorKey: 'size', header: 'Size', meta: { width: '6rem', nowrap: true } },
  {
    id: 'requested',
    accessorKey: 'requested',
    header: 'Requested',
    enableSorting: true,
    meta: { width: '10rem', nowrap: true }
  },
  { id: 'expires', accessorKey: 'expires', header: 'Expires', meta: { width: '7.5rem', nowrap: true } },
  { id: 'actions', meta: { actions: true }, cell: rowMenu }
];

/** Ready files can be downloaded together: the toolbar Download acts on the rows ticked with the checkboxes. */
export const isReady = row => row.status === 'Ready';

/** State of the page: two ready files ticked, so Download and Delete are active. */
export const isTicked = row =>
  row.name.startsWith('Transmittal-package_TR-99-0042') || row.name.startsWith('Documents-list_99_PAGE_AM_2026-11-01');
