/*
 * xCPage-MyTask-Reviewer — mock data and table setup shared by every screen of the flow.
 *
 * Records are transcribed from application_screenshot/xCPage-MyTask-Reviewer/ and, where the screenshots truncate
 * them, completed from the existing review demo (docs/assets/demo/xcpage/xcpage.js) — see REPORT.md §7.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { documentCell } from '../_shared/restyle.js';

export { mountTable, openHeaderMenu } from '../_shared/restyle.js';

// The comment actions sit in the detail panel header, so they follow the Review comments tab only.
document.addEventListener('sl-tab-show', ({ detail }) => {
  document.querySelectorAll('[data-comment-action]').forEach(action => (action.hidden = detail.name !== 'comments'));
});

// ------------------------------------------------------------------ Review tasks (11, all expired)

const task = (
  document,
  din,
  title,
  rev,
  created,
  due,
  { discipline = '—', originator = '—', acquired = true } = {}
) => ({
  document,
  din,
  title,
  rev,
  created,
  due,
  discipline,
  originator,
  acquired,
  expiry: 'expired',
  comment: false
});

export const tasks = [
  task(
    'test Foxit_no signature',
    'test Foxit_no signature_qrcode',
    'Test_DM_27091449_2',
    'A1',
    '20-Feb-2026',
    '25-Jun-2026',
    {
      originator: 'VDR-20240415',
      acquired: false
    }
  ),
  task(
    'test Foxit_no signature',
    'test Foxit_no signature_qrcode',
    'Test_DM_27091449_3',
    'A1',
    '20-Feb-2026',
    '25-Jun-2026',
    {
      originator: 'VDR-20240415',
      acquired: false
    }
  ),
  task(
    'A_TEST 3 INT JOBDOC',
    'A_TEST 3 INT JOBDOC VITO_0',
    'TEST 3 INT JOBDOC VITO',
    'C',
    '15-Mar-2022',
    '28-Jul-2022'
  ),
  task('TEST_AAPC-A2', '0989', 'Test9-QRCodeFix-9July', 'A2', '28-Mar-2021', '21-Apr-2021'),
  task('08-a2', '08', 'Test-PVA-11-09-2020_2', 'a2', '28-Mar-2021', '21-Apr-2021'),
  task('00001-ASDS', '00001', 'ASJKDHKASJLDH', 'ASDS', '16-Oct-2020', '31-Dec-2020', {
    discipline: 'Civil & Architectural'
  }),
  task('TEST_AAPC-A2', '0989', '0989', 'A2', '22-Sep-2021', '9-Oct-2021'),
  task('H10-RC-B-21213', 'Piping layout – area 10', 'H10-RC-B-21213_A1', 'A1', '03-Nov-2025', '15-Jan-2026', {
    discipline: 'Plant layout & Piping',
    originator: 'VDR-20240415'
  }),
  task('H10-RD-A-87165', 'Pump datasheet', 'H10-RD-A-87165_A2', 'A2', '12-Sep-2025', '01-Dec-2025', {
    discipline: 'Mechanical',
    originator: 'VDR-20240512'
  }),
  task('R1118111-SARC01', 'Structural arrangement', 'R1118111-SARC01-A', 'A', '30-Jun-2025', '30-Sep-2025', {
    discipline: 'Civil & Architectural',
    originator: 'VDR-20240512'
  }),
  task('AA-A1-310407', 'Electrical single line diagram', 'AA-A1-310407', 'B', '02-May-2025', '14-Aug-2025', {
    discipline: 'Electrical',
    originator: 'VDR-20240415'
  })
];

/** The task the reviewer works on in every screen. */
export const isSelectedTask = row => tasks.indexOf(row) === 0;

/** Task states along the flow: accepted (screen 3 →), comment uploaded (screen 5 →). */
export function setProgress({ accepted = false, commented = false } = {}) {
  tasks[0].acquired = accepted;
  tasks[0].comment = commented;
}

const EXPIRY = {
  safe: { variant: 'success', label: 'Safe' },
  expiring: { variant: 'warning', label: 'Expiring' },
  expired: { variant: 'danger', label: 'Expired' }
};

// Quick info as in the legacy list: expiry dot, accepted checkbox (lit by Accept → accent) and speech bubble (comment
// uploaded → success). Unlit markers are neutral.
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
      variant=${row.comment ? 'success' : 'neutral'}
      name=${row.comment ? 'chat-fill' : 'chat'}
      title=${row.comment ? 'Review comment uploaded' : 'No review comment yet'}
    ></sl-icon>
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

// ------------------------------------------------------------------ Detail panel of the selected task

export const reviewers = [
  { name: 'Aiello Ciro', initials: 'AC', acquired: true, last: '02-Oct-2026 13:16' },
  { name: 'Cazzaniga Alice', initials: 'CA', acquired: false, last: '—' },
  { name: 'page_wsuser', initials: 'PW', acquired: false, last: '—' }
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
    cell: ({ row }) =>
      row.original.acquired
        ? html`<sl-status variant="warning" size="small">Acquired</sl-status>`
        : html`<sl-status variant="neutral" size="small">Not acquired</sl-status>`
  },
  { id: 'last', accessorKey: 'last', header: 'Last operation', meta: { width: '9rem', nowrap: true } }
];

export const revisions = [
  {
    document: 'test Foxit_no signature',
    din: 'test Foxit_no signature_qrcode',
    title: 'Test_DM_27091449_2',
    code: 'A1',
    current: true,
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
  }
];

// ------------------------------------------------------------------ Complete review task (screen 7)

export const completion = [{ document: 'test Foxit_no signature_qrcode', commentDate: '02-Oct-2026 13:17' }];

export const completionColumns = [
  {
    id: 'state',
    header: 'Review comment',
    meta: { width: '10rem' },
    cell: () => html`
      <span class="rs-inline">
        <sl-status variant="success" size="small">Uploaded</sl-status>
        <sl-icon name="file-earmark-pdf" title="Review comment (PDF)"></sl-icon>
      </span>
    `
  },
  { id: 'document', accessorKey: 'document', header: 'Document', meta: { nowrap: true } },
  { id: 'date', accessorKey: 'commentDate', header: 'Comment date', meta: { width: '10rem', nowrap: true } }
];
