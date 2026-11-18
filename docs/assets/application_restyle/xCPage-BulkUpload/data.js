/*
 * xCPage-BulkUpload — mock data and table setup shared by every screen of the flow.
 *
 * Bulk uploads, matching rules and conditions are transcribed from the legacy screenshots and from
 * application_screenshot/xCPage - Bulk Upload/README.md. test_iso_15 (detail panel, Edit) is added to the first page
 * of the list; the Create screens follow one new bulk upload through its two matching rules.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Bulk uploads list

const bulkUpload = (name, createdBy, createdOn, status, template, format, locked = false) => ({
  name,
  createdBy,
  createdOn,
  status,
  template,
  format,
  locked
});

/** First page of the 341 bulk uploads of the project (legacy page size 10, here 25). */
export const bulkUploads = [
  bulkUpload('test_iso_15', 'Kuppili Sai Durga', '15-Jul-2026 08:34', 'Draft', 'Isometric Document', 'xlsx'),
  bulkUpload(
    'testing234',
    'Kuppili Sai Durga SaiDurga.Kuppili',
    '3-Apr-2026 09:52',
    'Draft',
    'Isometric Document',
    'xls',
    true
  ),
  bulkUpload(
    'tets_upload_ext_file_260126',
    'De Angeli Filippo',
    '26-Jan-2026 10:56',
    'Processed',
    'Job Document',
    'xlsx'
  ),
  bulkUpload('test', 'user_test2', '21-Jan-2026 12:10', 'Processed', 'Job Document', 'xlsx'),
  bulkUpload('test_bu_anselmo_1501', 'user_test1', '15-Jan-2026 12:10', 'Processed', 'Job Document', 'xlsx'),
  bulkUpload('test_Filippo_bulk_update_2', 'De Angeli Filippo', '15-Jan-2026 11:44', 'Ready', 'Job Document', 'xlsx'),
  bulkUpload('test_Filippo_bulk_update', 'De Angeli Filippo', '15-Jan-2026 11:30', 'Ready', 'Job Document', 'xlsx'),
  bulkUpload('test_Filippo_bulk upload', 'De Angeli Filippo', '15-Jan-2026 11:16', 'Ready', 'Job Document', 'xlsx'),
  bulkUpload(
    'test_from_xc_date_with_time_2811',
    'user_test1',
    '28-Nov-2025 12:04',
    'Queued',
    'Isometric Document',
    'xlsx'
  ),
  bulkUpload('test_from_xc_2811120725', 'user_test1', '28-Nov-2025 12:07', 'Ready', 'Job Document', 'xlsx'),
  bulkUpload('test_bu_from_xc_2811115525', 'user_test1', '28-Nov-2025 11:55', 'Ready', 'Job Document', 'xlsx')
];

export const isSelectedBulkUpload = row => row.name === 'test_iso_15';

/** Row menu ⋮: the two legacy actions on a record (Edit Bulk Upload opens the wizard, where the rules are managed). */
const bulkUploadMenu = () => html`
  <sl-menu>
    <sl-menu-item value="edit"><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item>
    <sl-menu-item value="rules"><sl-icon slot="prefix" name="diagram-3"></sl-icon>Manage matching rules</sl-menu-item>
  </sl-menu>
`;

export const bulkUploadColumns = [
  {
    id: 'quickInfo',
    header: 'Quick info',
    meta: { width: '6.5rem' },
    cell: ({ row }) =>
      html`<span class="rs-quick-info">
        <sl-icon name="file-earmark-excel" title=${row.original.format.toUpperCase() + ' file'}></sl-icon>
        ${row.original.locked ? html`<sl-icon name="lock" title="Locked"></sl-icon>` : ''}
      </span>`
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    meta: { width: 'minmax(10rem, 1fr)' },
    cell: ({ row }) => html`<span class="rs-truncate" title=${row.original.name}>${row.original.name}</span>`
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'State',
    meta: { width: '6.5rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'template',
    accessorKey: 'template',
    header: 'Allowed template',
    meta: { width: '10rem' },
    cell: ({ row }) => html`<sl-tag size="small" variant="primary">${row.original.template}</sl-tag>`
  },
  {
    id: 'createdBy',
    accessorKey: 'createdBy',
    header: 'Created by',
    meta: { width: 'minmax(7.5rem, 1fr)' },
    cell: ({ row }) => html`<span class="rs-truncate" title=${row.original.createdBy}>${row.original.createdBy}</span>`
  },
  {
    id: 'createdOn',
    accessorKey: 'createdOn',
    header: 'Created on',
    enableSorting: true,
    meta: { width: '10rem', nowrap: true }
  },
  { id: 'actions', meta: { actions: true }, cell: bulkUploadMenu }
];

// ------------------------------------------------------------------ Matching rules

/** Operators of a condition: the legacy long form and the short form of the conditions table. */
export const OPERATORS = {
  eq: { label: 'is equal to', short: '=', binary: true },
  neq: { label: 'is not equal to', short: '!=', binary: true },
  empty: { label: 'is empty', short: 'is empty', binary: false },
  notEmpty: { label: 'is not empty', short: 'is not empty', binary: false }
};

const condition = (newValue, operator, existingValue = '') => ({ newValue, operator, existingValue });
const rule = (action, ...conditions) => ({ action, conditions });

/** test_iso_15: the 3 rules of the detail panel. */
export const isoRules = [
  rule(
    'New Isometric Revision Action',
    condition('Document Identification Number', 'eq', 'Document Identification Number')
  ),
  rule(
    'New Isometric Revision Action',
    condition('Certifying Body Answer', 'notEmpty'),
    condition('Checked Out By', 'neq', 'Checked Out By')
  ),
  rule(
    'Overwrite Action',
    condition('Constructor', 'eq', 'Constructor'),
    condition('Client Document Identification', 'eq', 'Client Document Identification'),
    condition('Company Project Code', 'notEmpty')
  )
];

/** The new bulk upload of the Create screens: the 2 rules of Manage BU Matching Rules. */
export const newRules = [
  rule(
    'Overwrite Action',
    condition('Certifying Body Action', 'eq', 'Certifying Body Action'),
    condition('Client Review Category', 'eq', 'Client Review Category'),
    condition('Constructor', 'empty')
  ),
  rule(
    'New Isometric Action',
    condition('Creator Name', 'neq', 'Creator Name'),
    condition('Certifying Body Action', 'neq', 'Certifying Body Action'),
    condition('Client Review Category', 'eq', 'Client Review Category')
  )
];

/** One condition as a sentence: "New X is equal to Existing Y" (AND between lines). */
const conditionLine = (c, last) =>
  html`<span class="rs-body"
    >New <strong>${c.newValue}</strong> ${OPERATORS[c.operator].label}${OPERATORS[c.operator].binary
      ? html` existing <strong>${c.existingValue}</strong>`
      : ''}${last ? '' : html` <span class="rs-meta">AND</span>`}</span
  >`;

export const ruleColumns = [
  {
    id: 'index',
    header: '#',
    meta: { width: '3rem', align: 'center' },
    cell: ({ row }) => html`<span class="rs-meta">${row.index + 1}</span>`
  },
  {
    id: 'conditions',
    header: 'When all these conditions are true',
    meta: { width: 'minmax(20rem, 1fr)' },
    cell: ({ row }) =>
      html`<span class="rs-cell-stack">
        ${row.original.conditions.map((c, i, all) => conditionLine(c, i === all.length - 1))}
      </span>`
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: 'Perform',
    meta: { width: '14rem' },
    cell: ({ row }) => html`<sl-tag size="small" variant="primary">${row.original.action}</sl-tag>`
  }
];

// ------------------------------------------------------------------ Set matching rule: conditions table

export const editedRule = newRules[1];

export const conditionColumns = [
  { id: 'newValue', accessorKey: 'newValue', header: 'New value of', meta: { width: 'minmax(12rem, 1fr)' } },
  {
    id: 'operator',
    header: 'Operator',
    meta: { width: '8rem', align: 'center' },
    cell: ({ row }) => html`<span class="rs-mono">${OPERATORS[row.original.operator].short}</span>`
  },
  {
    id: 'existingValue',
    header: 'Existing value of',
    meta: { width: 'minmax(12rem, 1fr)' },
    cell: ({ row }) => row.original.existingValue || '—'
  },
  {
    id: 'remove',
    header: '',
    meta: { width: '3.5rem', align: 'center' },
    cell: ({ row }) =>
      html`<sl-tooltip content="Remove condition"
        ><sl-icon-button
          name="trash"
          label="Remove condition ${row.original.newValue}"
          size="small"
          variant="neutral"
        ></sl-icon-button
      ></sl-tooltip>`
  }
];

/** Document attributes offered by New value of / Existing value of. */
export const attributes = [
  'Certifying Body Action',
  'Certifying Body Answer',
  'Checked Out By',
  'Client Document Identification',
  'Client Review Category',
  'Company Project Code',
  'Constructor',
  'Creator Name',
  'Document Identification Number'
];

export const actions = ['Overwrite Action', 'New Isometric Action', 'New Isometric Revision Action'];
