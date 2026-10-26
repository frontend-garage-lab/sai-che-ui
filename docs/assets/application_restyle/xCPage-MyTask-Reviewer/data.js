/*
 * xCPage-MyTask-Reviewer — mock data and table setup shared by every screen of the flow.
 *
 * Records are transcribed from application_screenshot/xCPage-MyTask-Reviewer/ and, where the screenshots truncate
 * them, completed from the existing review demo (docs/assets/demo/xcpage/xcpage.js) — see REPORT.md §7.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { documentCell, revisionFileIcon, revisionInfoAction, revisionTag, statusTag } from '../_shared/restyle.js';

export { mountDocumentInfo, mountTable, openHeaderMenu } from '../_shared/restyle.js';

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

// Quick info: expiry dot. Whether the task is acquired is a state (Status column: Working → Acquired). The speech
// bubble (comment uploaded) is Lead Reviewer only, so it is not shown here.
const quickInfo = row => html`
  <span class="rs-quick-info">
    <sl-status
      class="rs-status-dot"
      variant=${EXPIRY[row.expiry].variant}
      size="small"
      title=${EXPIRY[row.expiry].label}
    ></sl-status>
  </span>
`;

export const taskColumns = [
  { id: 'info', header: '', meta: { width: '2.5rem' }, cell: ({ row }) => quickInfo(row.original) },
  {
    id: 'state',
    header: 'Status',
    meta: { width: '7rem' },
    cell: ({ row }) => statusTag(row.original.acquired ? 'Acquired' : 'Working')
  },
  {
    id: 'task',
    accessorKey: 'document',
    header: 'Task',
    enableSorting: true,
    // Never narrower than 12rem: with the sidebar expanded the list scrolls sideways instead of hiding the task
    meta: { width: 'minmax(12rem, 1fr)' },
    cell: ({ row }) => documentCell(row.original.document, row.original.din, row.original.title)
  },
  {
    id: 'rev',
    accessorKey: 'rev',
    header: 'Rev.',
    meta: { width: '4rem' },
    cell: ({ row }) => revisionTag(row.original.rev)
  },
  {
    id: 'created',
    accessorKey: 'created',
    header: 'Created',
    enableSorting: true,
    meta: { width: '8rem', nowrap: true }
  },
  { id: 'due', accessorKey: 'due', header: 'Due date', enableSorting: true, meta: { width: '8rem', nowrap: true } },
  { id: 'discipline', accessorKey: 'discipline', header: 'Discipline', meta: { width: '8rem', nowrap: true } },
  { id: 'originator', accessorKey: 'originator', header: 'Originator', meta: { width: '8rem', nowrap: true } }
];

// ------------------------------------------------------------------ Detail panel of the selected task

export const reviewers = [
  { name: 'Aiello Ciro', initials: 'AC', status: 'acquired', last: '02-Oct-2026 13:16' },
  { name: 'Cazzaniga Alice', initials: 'CA', status: 'not-acquired', last: '—' },
  { name: 'page_wsuser', initials: 'PW', status: 'not-acquired', last: '—' },
  { name: 'Bianchi Marco', initials: 'BM', status: 'completed', file: true, last: '30-Sep-2026 09:42' },
  { name: 'Rossi Laura', initials: 'RL', status: 'refused', last: '28-Sep-2026 16:05' },
  { name: 'Verdi Paolo', initials: 'VP', status: 'aborted', last: '25-Sep-2026 11:20' }
];

// Reviewer task status → label; the colour comes from the shared STATUS_VARIANT catalog.
const reviewerStatus = {
  'not-acquired': 'Not acquired',
  acquired: 'Acquired',
  completed: 'Completed',
  refused: 'Refused',
  aborted: 'Aborted'
};

export const reviewerColumns = [
  {
    id: 'name',
    header: 'Reviewer',
    cell: ({ row }) =>
      html`<span class="rs-inline"
        ><sl-avatar
          shape="circle"
          size="small"
          initials=${row.original.initials}
          label=${row.original.name}
        ></sl-avatar>
        ${row.original.name}</span
      >`
  },
  {
    id: 'status',
    header: 'Task status',
    meta: { width: '11rem' },
    cell: ({ row }) => {
      const label = reviewerStatus[row.original.status];
      return html`<span class="rs-inline"
        >${statusTag(label)}${row.original.file
          ? html`<sl-tooltip content="Download review file"
              ><sl-icon-button name="file-earmark-pdf" label="Download review file"></sl-icon-button
            ></sl-tooltip>`
          : ''}</span
      >`;
    }
  },
  { id: 'last', accessorKey: 'last', header: 'Last operation', meta: { width: '10.5rem', nowrap: true } },
  {
    id: 'actions',
    meta: { actions: true },
    cell: () => html`
      <sl-menu>
        <sl-menu-item value="edit"><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item>
        <sl-divider></sl-divider>
        <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
      </sl-menu>
    `
  }
];

export const revisions = [
  {
    document: 'test Foxit_no signature',
    din: 'test Foxit_no signature_qrcode',
    title: 'Test_DM_27091449_2',
    code: 'A1',
    current: true,
    status: 'Current',
    format: 'pdf'
  },
  {
    document: 'test Foxit_no signature_A',
    din: 'test Foxit_no signature_qrcode',
    title: 'Test_DM_27091449_2',
    code: 'A',
    current: false,
    status: 'Current',
    format: 'pdf',
    clientAnswer: 'Approved'
  },
  {
    document: 'test Foxit_no signature_00B',
    din: 'test Foxit_no signature_qrcode',
    title: 'Test_DM_27091449 – title update',
    code: '00B',
    current: false,
    status: 'Current',
    format: 'docx'
  },
  {
    document: 'test Foxit_no signature_00',
    din: 'test Foxit_no signature_qrcode',
    title: 'Test_DM_27091449',
    code: '00',
    current: false,
    status: 'Current',
    format: 'pdf',
    clientAnswer: 'Commented'
  }
];

export const revisionColumns = [
  {
    id: 'info',
    header: '',
    meta: { width: '3rem' },
    cell: revisionFileIcon
  },
  {
    id: 'document',
    header: 'Document',
    cell: ({ row }) => documentCell(row.original.document, row.original.din, row.original.title)
  },
  {
    id: 'status',
    header: 'Revision status',
    meta: { width: '9rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'code',
    header: 'Revision code',
    meta: { width: '8rem' },
    cell: ({ row }) => html`<span class="rs-inline">${revisionTag(row.original.code)}</span>`
  },
  { id: 'actions', header: '', meta: { width: '3rem', align: 'center' }, cell: revisionInfoAction }
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
        <sl-status filled variant="success" size="small">Uploaded</sl-status>
        <sl-icon name="file-earmark-pdf" title="Review comment (PDF)"></sl-icon>
      </span>
    `
  },
  { id: 'document', accessorKey: 'document', header: 'Document', meta: { nowrap: true } },
  { id: 'date', accessorKey: 'commentDate', header: 'Comment date', meta: { width: '10rem', nowrap: true } }
];

// ------------------------------------------------------------------ Document info dialog (Properties › All metadata)

export const documentInfo = {
  summary: [
    ['Name', 'test Foxit_no signature'],
    ['DIN', 'test Foxit_no signature_qrcode'],
    ['Title', 'Test_DM_27091449_2'],
    ['Revision code', 'A1']
  ],
  sections: [
    {
      title: 'Info',
      groups: [
        {
          title: 'Identification',
          items: [
            ['SP code', '—'],
            ['Document class', 'External Job Document'],
            ['Client document identification', '—'],
            ['Vendor document identification', '—']
          ]
        },
        {
          title: 'Status and ownership',
          items: [
            ['Project code', '99_PAGE_AM'],
            ['Company project code', '—'],
            ['PO number', '—'],
            ['Managing department – discipline', '—'],
            ['Issuing department – discipline', '—'],
            ['Second discipline', '—'],
            ['Originator', 'VDR-20240415'],
            ['Superseded by', '—']
          ]
        }
      ]
    },
    {
      title: 'Job document',
      groups: [
        {
          items: [
            ['Client answer', '—'],
            ['Issuing description', '—']
          ]
        }
      ]
    }
  ]
};
