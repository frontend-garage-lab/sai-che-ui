/*
 * xCPage-MyTask-LeadReviewer — mock data and table setup shared by every screen of the flow.
 *
 * Records are transcribed from application_screenshot/xCPage-MyTask-LeadReviewer/ (tasks, comments, revisions,
 * originators). The screenshots show 7 of the 22 consolidation tasks; the rest are completed with records of the
 * same shape — see REPORT.md §7.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { documentCell } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Consolidation tasks (22, all expired)

const task = (
  document,
  din,
  title,
  rev,
  created,
  due,
  { originator = '—', discipline = '—', closed = false } = {}
) => ({
  document,
  din,
  title,
  rev,
  created,
  due,
  discipline,
  originator,
  // Every task in the screenshots is acquired and expired (KPI: 22 expired)
  acquired: true,
  expiry: 'expired',
  // Reviewer tasks closed (green speech bubble in the legacy list)
  closed,
  notified: false
});

export const tasks = [
  task('test_doc_2_1905-A3', 'test_doc_2_1905', 'test_doc_2_1905', 'A3', '16-Jun-2023', '30-Nov-2023'),
  task('test_doc_3_1905-A3', 'test_doc_3_1905', 'test_doc_3_1905', 'A3', '16-Jun-2023', '30-Nov-2023'),
  task('test_doc_1_1905-A3', 'test_doc_1_1905', 'test_doc_1_1905', 'A3', '16-Jun-2023', '30-Nov-2023', {
    closed: true
  }),
  task('test_doc_2_1905-A3', 'test_doc_2_1905', 'test_doc_2_1905', 'A3', '19-May-2023', '31-May-2023'),
  task('AA-A33', 'AA', 'Test', 'A34', '1-Dec-2021', '12-Jan-2022', { closed: true }),
  task('AA-A33', 'AA', 'Test', 'A34', '1-Dec-2021', '12-Jan-2022', { closed: true }),
  task('TEST_AAPC-A2', '0989', '0989', 'A2', '22-Sep-2022', '30-Dec-2022', { originator: 'SAIPEM' }),
  task('test_aug25-a2', 'test_aug25', 'test_aug25', 'A2', '23-Feb-2022', '30-Apr-2022', { originator: 'SAIPEM' }),
  task('sdaSDSDA-A2', 'sdaSDSDA', 'sdaSDSDA', 'A2', '23-Feb-2022', '30-Apr-2022', { originator: 'ARAMCO-BV' }),
  task('test_July_89-A2', 'test_July_89', 'test_July_89', 'A2', '23-Feb-2022', '30-Apr-2022', { closed: true }),
  task('H10-RC-B-21213_A1', 'H10-RC-B-21213', 'Piping layout – area 10', 'A1', '03-Nov-2021', '15-Jan-2022', {
    originator: 'LARSEN & TOUBRO LTD.-0001373173',
    discipline: 'Plant layout & Piping'
  }),
  task('H10-RD-A-87165_A2', 'H10-RD-A-87165', 'Pump datasheet', 'A2', '12-Sep-2021', '01-Dec-2021', {
    originator: 'VDR-20240209',
    discipline: 'Mechanical'
  }),
  task('R1118111-SARC01-A', 'R1118111-SARC01', 'Structural arrangement', 'A', '30-Jun-2021', '30-Sep-2021', {
    originator: 'VDR-20240414',
    discipline: 'Civil & Architectural',
    closed: true
  }),
  task('AA-A1-310407', 'AA-A1-310407', 'Electrical single line diagram', 'B', '02-May-2021', '14-Aug-2021', {
    originator: 'VDR-20240414-1',
    discipline: 'Electrical'
  }),
  task('007-20-4-a1', '007-20-4', '007-20-4', 'A1', '10-Jul-2021', '10-Aug-2021', { originator: 'NK-Originator' }),
  task('sdsASDA-A2', 'sdsASDA', 'sdsASDA', 'A2', '10-Jul-2021', '10-Aug-2021', { originator: 'BBBBB' }),
  task('rwar-1', 'rwar', 'rwar', '1', '04-Feb-2021', '04-Mar-2021', { closed: true }),
  task('test3-A', 'test3', 'test3', 'A', '18-Nov-2020', '18-Dec-2020', { originator: 'AAAAA' }),
  task('TEST_AAPC-U6', 'AA', 'AA', 'U6', '13-Oct-2020', '13-Nov-2020', { originator: 'TO_COMPANY_DEP_1' }),
  task(
    'TEST_AAPC-A0',
    'AO-OO-02-02-10E_A01-10E-14580',
    'AO-OO-02-02-10E_A01-10E-14580',
    'A0',
    '13-Jan-2020',
    '13-Feb-2020',
    {
      originator: 'TO_COMPANY_DEP_2'
    }
  ),
  task('testmanasa_12July-A1', 'testmanasa_12July', 'testmanasa_12July', 'A1', '12-Jul-2020', '12-Aug-2020', {
    originator: 'VDR-20240414-2'
  }),
  task('test_aug33-a2', 'test_aug33', 'test_aug33', 'A2', '23-Feb-2020', '23-Mar-2020', {
    originator: 'VDR-20240414-3'
  })
];

/** Row selected in screen 4, and in screens 5–13. */
export const isFirstPick = (row, index) => tasks.indexOf(row) === 1;
export const isSelectedTask = row => tasks.indexOf(row) === 2;

/** Marks the selected task as notified (screens 12–13). */
export function notifySelected() {
  tasks[2].notified = true;
}

export const originators = [
  'AAAAA',
  'ARAMCO-BV',
  'BBBBB',
  'LARSEN & TOUBRO LTD.-0001373173',
  'NK-Originator',
  'SAIPEM',
  'TO_COMPANY_DEP_1',
  'TO_COMPANY_DEP_2',
  'VDR-20240209',
  'VDR-20240414',
  'VDR-20240414-1',
  'VDR-20240414-2',
  'VDR-20240414-3',
  'VDR-20240414-4'
];

const EXPIRY = {
  safe: { variant: 'success', label: 'Safe' },
  expiring: { variant: 'warning', label: 'Expiring' },
  expired: { variant: 'danger', label: 'Expired' }
};

// Quick info as in the legacy list: expiry dot (same colours as the KPI stats), accepted checkbox (lit by Accept →
// accent), speech bubble (reviewer tasks closed → success) and the "!" of a notified task (danger). Unlit markers are
// neutral.
const quickInfo = row => html`
  <span class="rs-quick-info">
    <sl-status
      class="rs-status-dot"
      variant=${EXPIRY[row.expiry].variant}
      size="small"
      title=${EXPIRY[row.expiry].label}
    ></sl-status>
    <sl-icon
      variant=${row.acquired ? 'accent' : 'neutral'}
      name=${row.acquired ? 'check-square-fill' : 'square'}
      title=${row.acquired ? 'Accepted' : 'Not accepted yet'}
    ></sl-icon>
    <sl-icon
      variant=${row.closed ? 'success' : 'neutral'}
      name=${row.closed ? 'chat-fill' : 'chat'}
      title=${row.closed ? 'Reviewer tasks closed' : 'Reviewer tasks in progress'}
    ></sl-icon>
    ${row.notified ? html`<sl-icon variant="danger" name="exclamation-lg" title="Notified"></sl-icon>` : ''}
  </span>
`;

export const taskColumns = [
  { id: 'info', header: '', meta: { width: '6rem' }, cell: ({ row }) => quickInfo(row.original) },
  {
    id: 'task',
    accessorKey: 'document',
    header: 'Task',
    enableSorting: true,
    cell: ({ row }) => documentCell(row.original.document, row.original.din, row.original.title)
  },
  { id: 'rev', accessorKey: 'rev', header: 'Rev.', meta: { width: '4rem' } },
  {
    id: 'created',
    accessorKey: 'created',
    header: 'Created',
    enableSorting: true,
    meta: { width: '7rem', nowrap: true }
  },
  { id: 'due', accessorKey: 'due', header: 'Due date', enableSorting: true, meta: { width: '7rem', nowrap: true } },
  { id: 'discipline', accessorKey: 'discipline', header: 'Discipline', meta: { width: '8rem', nowrap: true } },
  { id: 'originator', accessorKey: 'originator', header: 'Originator', meta: { width: '8rem', nowrap: true } }
];

// ------------------------------------------------------------------ Detail panel of test_doc_1_1905-A3

export const reviewers = [
  { name: 'user_test2', initials: 'U2', status: 'Completed', comment: true, last: '16-Jun-2023 17:34' },
  { name: 'user_test1', initials: 'U1', status: 'Completed', comment: false, last: '16-Jun-2023 17:32' }
];

export const reviewerColumns = [
  {
    id: 'name',
    header: 'Reviewer',
    cell: ({ row }) =>
      html`<span class="rs-inline"
        ><sl-avatar shape="circle" initials=${row.original.initials} label=${row.original.name}></sl-avatar> ${row
          .original.name}</span
      >`
  },
  {
    id: 'status',
    header: 'Task status',
    meta: { width: '9rem' },
    cell: ({ row }) => html`
      <span class="rs-inline">
        <sl-status variant="success" size="small">${row.original.status}</sl-status>
        ${row.original.comment ? html`<sl-icon name="file-earmark-pdf" title="Comment uploaded"></sl-icon>` : ''}
      </span>
    `
  },
  { id: 'last', accessorKey: 'last', header: 'Last operation', meta: { width: '9rem', nowrap: true } }
];

export const revisions = [
  {
    document: 'test_doc_1_1905-A3',
    din: 'test_doc_1_1905',
    title: 'test_doc_1_1905',
    code: 'A3',
    current: true,
    format: 'pdf'
  },
  {
    document: 'test_doc_1_1905-A1',
    din: 'test_doc_1_1905',
    title: 'test_doc_1_1905',
    code: 'A1',
    current: false,
    format: 'pdf'
  },
  {
    document: 'test_doc_1_1905-A2',
    din: 'test_doc_1_1905',
    title: 'test_doc_1_1905',
    code: 'A2',
    current: false,
    format: 'pdf'
  }
];

export const revisionColumns = [
  {
    id: 'file',
    header: '',
    meta: { width: '3rem' },
    // The icon of the native file, shown only when the revision has one (here always a PDF).
    cell: ({ row }) =>
      row.original.format === 'pdf' ? html`<sl-icon name="file-earmark-pdf" title="Native file: PDF"></sl-icon>` : ''
  },
  {
    id: 'document',
    header: 'Document',
    cell: ({ row }) => documentCell(row.original.document, row.original.din, row.original.title)
  },
  {
    id: 'code',
    header: 'Revision',
    meta: { width: '7rem' },
    cell: ({ row }) =>
      html`<span class="rs-inline"
        >${row.original.code}
        ${row.original.current ? html`<sl-tag size="small" variant="success">Current</sl-tag>` : ''}</span
      >`
  },
  { id: 'answer', header: 'Client answer', meta: { width: '8rem' }, cell: () => '—' }
];

// ------------------------------------------------------------------ Complete lead review task (screen 13)

export const completion = [
  {
    document: 'test_doc_1_1905-A3',
    missing: true,
    commentDate: null,
    answer: '—',
    rename: 'No',
    binder: '—'
  }
];

export const completionColumns = [
  {
    id: 'state',
    header: 'Consolidated comment',
    meta: { width: '11rem' },
    cell: ({ row }) =>
      row.original.missing
        ? html`<sl-status variant="danger" size="small">Missing</sl-status>`
        : html`<sl-status variant="success" size="small">Uploaded</sl-status>`
  },
  { id: 'document', accessorKey: 'document', header: 'Document', meta: { nowrap: true } },
  {
    id: 'date',
    header: 'Comment date',
    meta: { width: '8rem' },
    cell: ({ row }) => row.original.commentDate ?? '—'
  },
  { id: 'answer', accessorKey: 'answer', header: 'Saipem answer to vendor', meta: { width: '11rem' } },
  { id: 'rename', accessorKey: 'rename', header: 'Rename comment', meta: { width: '8rem' } },
  { id: 'binder', accessorKey: 'binder', header: 'Virtual binder', meta: { width: '8rem' } }
];
