/*
 * xCPage-Structures — mock data and table setup shared by every screen of the flow.
 *
 * Nodes, linked documents and Clipboard documents are transcribed from the legacy screenshots and from
 * application_screenshot/xCPage - Structures/README.md (project 99_PAGE_AM, structure 01 WBS, branch 1000).
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { documentCell, documentMenu, revisionTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Quick info

const FILE = {
  pdf: { name: 'file-earmark-pdf', title: 'Native file: PDF' },
  docx: { name: 'file-earmark-word', title: 'Native file: Word' }
};

/** Quick info of a document: flag (current revision `success`, otherwise `neutral`) and the native file, if any. */
const quickInfo = ({ row }) => {
  const record = row.original;
  const file = FILE[record.format];
  return html`<span class="rs-quick-info">
    <sl-icon
      name="flag"
      variant=${record.current ? 'success' : 'neutral'}
      title=${record.current ? 'Current revision' : 'Not the current revision'}
    ></sl-icon>
    ${file ? html`<sl-icon name=${file.name} title=${file.title}></sl-icon>` : ''}
  </span>`;
};

// ------------------------------------------------------------------ Documents linked to a node

const linked = (
  document,
  din,
  sigla,
  revision,
  managingDept,
  issuingDept,
  discipline,
  originator,
  format,
  current = true
) => ({
  document,
  din,
  sigla,
  revision,
  managingDept,
  issuingDept,
  discipline,
  originator,
  format,
  current
});

/** Test_Activity_23June (WBS Activity): the 3 documents of the Documents tab. */
export const activityDocuments = [
  linked('20291', '202910003', 'BBB', 'B', 'PIPE-PIPING', 'ENG-ENGINEERING', 'Piping', 'Saipem', null, false),
  linked('20291', '202910001', 'BBB', 'B', 'PIPE-PIPING', 'ENG-ENGINEERING', 'Piping', 'Saipem', 'pdf'),
  linked('AA-A1-3761', '963258', 'OT', 'A1', 'PIPE-PIPING', 'PROC-PROCUREMENT', 'Mechanical', 'Vendor', 'docx')
];

export const linkedColumns = [
  { id: 'info', header: 'Quick info', meta: { width: '5rem' }, cell: quickInfo },
  {
    id: 'document',
    accessorKey: 'document',
    header: 'Document',
    enableSorting: true,
    meta: { width: 'minmax(10rem, 1fr)' },
    cell: ({ row }) => documentCell(row.original.document, row.original.din, row.original.sigla)
  },
  {
    id: 'revision',
    accessorKey: 'revision',
    header: 'Rev. code',
    meta: { width: '5.5rem' },
    cell: ({ row }) => revisionTag(row.original.revision)
  },
  { id: 'managingDept', accessorKey: 'managingDept', header: 'Managing dept', meta: { width: '9rem', nowrap: true } },
  {
    id: 'issuingDept',
    accessorKey: 'issuingDept',
    header: 'Issuing department',
    meta: { width: '9rem', nowrap: true }
  },
  { id: 'discipline', accessorKey: 'discipline', header: 'Discipline', meta: { width: '7rem', nowrap: true } },
  { id: 'originator', accessorKey: 'originator', header: 'Originator', meta: { width: '7rem', nowrap: true } },
  { id: 'actions', meta: { actions: true }, cell: documentMenu }
];

// ------------------------------------------------------------------ Nodes of 01 WBS (was the folder tree)

const node = (name, path, type, nodeId, docs, children = false) => ({ name, path, type, nodeId, docs, children });

/** First level of 01 WBS plus the expanded branch 1000 (the legacy tree). Types only where the README states them. */
export const wbsNodes = [
  node('00', '01 WBS', '—', '—', 0, true),
  node('10', '01 WBS', '—', '—', 0),
  node('1000', '01 WBS', '—', '—', 0, true),
  node('Test_Discipline', '01 WBS › 1000', 'WBS Intermediate Discipline', '—', 0, true),
  node('Test_EMC', '01 WBS › 1000 › Test_Discipline', 'WBS EMC', '9100', 0, true),
  node('Test_Activity_23June', '01 WBS › 1000 › Test_Discipline › Test_EMC', 'WBS Activity', '—', 3),
  node('11', '01 WBS', '—', '—', 0),
  node('19', '01 WBS', '—', '—', 0),
  node('A', '01 WBS', '—', '—', 0, true),
  node('B', '01 WBS', '—', '—', 0, true),
  node('B1', '01 WBS', '—', '—', 0, true),
  node('FA', '01 WBS', '—', '—', 0, true),
  node('KT1', '01 WBS', '—', '—', 0, true),
  node('KT2', '01 WBS', '—', '—', 0),
  node('MI', '01 WBS', '—', '—', 0),
  node('New Element', '01 WBS', '—', '—', 0)
];

export const isNode = name => row => row.name === name;

const typeTag = type => (type === '—' ? '—' : html`<sl-tag size="small" variant="primary">${type}</sl-tag>`);

/** Row menu ⋮ of a node: the actions of the node toolbar of the legacy. */
const nodeMenu = ({ row }) => html`
  <sl-menu>
    <sl-menu-item value="child"><sl-icon slot="prefix" name="plus-lg"></sl-icon>New child element</sl-menu-item>
    <sl-menu-item value="link"><sl-icon slot="prefix" name="link-45deg"></sl-icon>Link documents</sl-menu-item>
    ${row.original.type === 'WBS Activity'
      ? html`<sl-menu-item value="progress"
          ><sl-icon slot="prefix" name="bar-chart-steps"></sl-icon>Check progress</sl-menu-item
        >`
      : ''}
  </sl-menu>
`;

export const nodeColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Node',
    enableSorting: true,
    meta: { width: 'minmax(10rem, 1fr)' },
    cell: ({ row }) =>
      html`<span class="rs-inline"
        ><sl-icon name="folder"></sl-icon>${documentCell(row.original.name, row.original.path)}</span
      >`
  },
  { id: 'type', header: 'Type', meta: { width: '13.5rem' }, cell: ({ row }) => typeTag(row.original.type) },
  { id: 'nodeId', accessorKey: 'nodeId', header: 'Node ID', meta: { width: '6.5rem', nowrap: true } },
  { id: 'docs', accessorKey: 'docs', header: 'Docs', meta: { width: '5rem', align: 'end' } },
  { id: 'actions', meta: { actions: true }, cell: nodeMenu }
];

// ------------------------------------------------------------------ Clipboard documents (Link documents dialog)

const clip = (name, din, title, format = 'pdf') => ({ name, din, title, format, current: true });

/** The 5 documents of the legacy Clipboard panel. */
export const clipboardDocuments = [
  clip('032309-1536608-ME-D-…', 'test_review_doc_000900…', 'test_…'),
  clip('1120305', '11203050001', 'General…'),
  clip('1120312', '11203120001', 'Equipment…'),
  clip('23451224- RevA1', '23451224- RevA10003', 'VENDOR…'),
  clip('99_PAGE_AM--Draft', 'Auto Populated0016', 'PRE-…')
];

/** Rows ticked in the legacy screenshot. */
export const isLinkCandidate = row => ['1120305', '1120312'].includes(row.name);

export const clipboardColumns = [
  { id: 'info', header: 'Quick info', meta: { width: '5rem' }, cell: quickInfo },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Document',
    meta: { width: 'minmax(10rem, 1fr)' },
    cell: ({ row }) => documentCell(row.original.name, row.original.din)
  },
  { id: 'title', accessorKey: 'title', header: 'Title', meta: { width: 'minmax(8rem, 1fr)' } }
];

/** Ticks several rows (mountTable selects only the first one). */
export async function selectRows(table, isSelected) {
  table.setSelection(table.data.filter(isSelected));
  await table.updateComplete;
}
