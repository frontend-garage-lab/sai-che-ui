/*
 * xCPage-MyTask-PVA — mock data and table setup shared by every screen of the flow.
 *
 * Records are transcribed from application_screenshot/xCPage-MyTask-PVA/ (task names, documents, DINs, users).
 * Where the screenshots are cut off, the list is completed with records of the same shape — see REPORT.md §7.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import {
  documentCell,
  documentColumns,
  openDocumentInfo,
  revisionQuickInfo,
  revisionTag,
  statusTag
} from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Tasks (PVA stage, 22 tasks)

const FULL = 'PVA Process (Full)';
const A_ONLY = 'PVA Process (A Only)';

const ao = (din, date) => ({
  pvaStatus: 'Active',
  kind: 'P',
  task: `AO-OO-02-02-10E_A01-10E-${din}-PVA-${date}`,
  document: 'TEST_AAPC-A0',
  din: `AO-OO-02-02-10E_A01-10E-${din}`,
  type: FULL,
  performers: 'Aiello Ciro'
});

const task = (kind, name, document, din, type = FULL, performers = 'Aiello Ciro', pvaStatus = 'Active') => ({
  pvaStatus,
  kind,
  task: name,
  document,
  din,
  type,
  performers
});

export const tasks = [
  ao(14580, '13-gen-2022'),
  ao(14578, '13-gen-2022'),
  ao(14577, '13-gen-2022'),
  ao(14576, '13-gen-2022'),
  ao(14575, '13-gen-2022'),
  ao(14573, '13-Jan-2022'),
  ao(14572, '13-Jan-2022'),
  ao(14571, '13-Jan-2022'),
  ao(14570, '13-Jan-2022'),
  ao(14569, '13-Jan-2022'),
  task('P', 'test_aug33-PVA-23-Feb-2022', 'test_aug33-a2', 'test_aug33'),
  task('P', 'test_aug12-PVA-23-Feb-2022', 'test_aug12-a1', 'test_aug12'),
  task('P', 'test_July_89-PVA-23-Feb-2022', 'test_July_89-A2', 'test_July_89'),
  task('P', 'sdaSDSDA-PVA-23-Feb-2022', 'sdaSDSDA-A2', 'sdaSDSDA'),
  task('P', 'test_aug25-PVA-23-Feb-2022', 'test_aug25-a2', 'test_aug25'),
  task('V', '007-20-4-PVA-10-Jul-2021', 'TEST_AAPC-a1', '007-20-4'),
  task('V', '0989-PVA-10-Jul-2021', 'TEST_AAPC-A2', '0989'),
  task('P', 'sdsASDA-PVA-10-Jul-2021', 'sdsASDA-A2', 'sdsASDA', FULL, 'Aiello Ciro', 'Promoting'),
  task('A', 'rwar-PVA-04-Feb-2021', 'rwar-1', 'rwar'),
  task('P', 'test3-PVA-18-Nov-2020', 'test3-A', 'test3'),
  task('A', 'AA-PVA-13-Oct-2020', 'TEST_AAPC-U6', 'AA'),
  task('A', 'testmanasa_12July-PVA-12-Jul-2020', 'testmanasa_12July-A1', 'testmanasa_12July', A_ONLY, 'user_test1')
];

/**
 * A task whose PVA process is "Promoting" (the queue is still being processed) can't be acted on: its row is disabled
 * until the process goes back to Active (SUD 3.0 §PVA Task).
 */
export const isPromoting = row => row.pvaStatus === 'Promoting';

/** The task the user opens in screens 3–8. */
export const isSelectedTask = row => row.document === 'rwar-1';

// The legacy list flags every task with a coloured letter. Its meaning isn't visible in the screenshots (REPORT §7),
// so the badge keeps the letter and the colour, and says what it is in a tooltip.
const KIND_VARIANT = { P: 'warning', V: 'primary', A: 'success' };

// Active → next recipient has the task; Promoting → queue being processed; Complete → process finished.

export const taskColumns = [
  {
    id: 'kind',
    header: '',
    meta: { width: '3rem', align: 'center' },
    cell: ({ row }) =>
      html`<sl-badge variant=${KIND_VARIANT[row.original.kind]} title="Task kind ${row.original.kind}"
        >${row.original.kind}</sl-badge
      >`
  },
  {
    id: 'task',
    accessorKey: 'document',
    header: 'Task',
    enableSorting: true,
    cell: ({ row }) => documentCell(row.original.document, row.original.task, row.original.din)
  },
  {
    id: 'status',
    header: 'PVA status',
    meta: { width: '8rem' },
    cell: ({ row }) => statusTag(row.original.pvaStatus)
  },
  { id: 'type', accessorKey: 'type', header: 'Type', enableSorting: true, meta: { width: '11rem' } },
  {
    id: 'performers',
    accessorKey: 'performers',
    header: 'Possible performers',
    enableSorting: true,
    meta: { width: '10rem' }
  }
];

// ------------------------------------------------------------------ Revisions of rwar-1

export const revisions = [
  {
    document: 'rwar-1',
    din: 'rwar',
    title: 'rwar',
    status: 'Working',
    code: '1',
    version: '1.0',
    current: true,
    format: 'pdf'
  },
  {
    document: 'rwar-0',
    din: 'rwar',
    title: 'rwar – draft',
    status: 'Verified',
    code: '0',
    version: '0.2',
    current: false,
    format: 'docx',
    clientAnswer: 'Approved'
  }
];

/** Row menu of a revision: every metadata (same "Metadata" dialog as Properties › All metadata), edit or delete it. */
const revisionMenu = () => html`
  <sl-menu>
    <sl-menu-item value="info" @click=${openDocumentInfo}
      ><sl-icon slot="prefix" name="info-circle"></sl-icon>Document info</sl-menu-item
    >
    <sl-divider></sl-divider>
    <sl-menu-item value="edit"><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
  </sl-menu>
`;

export const revisionColumns = [
  {
    id: 'info',
    header: '',
    meta: { width: '4rem' },
    cell: revisionQuickInfo
  },
  {
    id: 'document',
    header: 'Document',
    cell: ({ row }) => documentCell(row.original.document, row.original.din, row.original.title)
  },
  {
    id: 'status',
    header: 'Revision status',
    meta: { width: '8rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: 'Revision code',
    meta: { width: '7rem' },
    cell: ({ row }) => revisionTag(row.original.code)
  },
  {
    id: 'version',
    header: 'Version',
    meta: { width: '7rem' },
    cell: ({ row }) => html`<span class="rs-inline">${row.original.version}</span>`
  },
  { id: 'actions', meta: { actions: true }, cell: revisionMenu }
];

// ------------------------------------------------------------------ Progress tab (screen 4b)

export const weights = [
  { step: 'Step 1', company: 'SAIPEM', planned: '4-Jan-2026', actual: '10-Jan-2026', forecast: '12-Jan-2026' },
  { step: 'Step 2', company: 'SAIPEM', planned: '9-Jan-2026', actual: '15-Jan-2026', forecast: '17-Jan-2026' }
];

export const weightColumns = [
  { id: 'step', header: 'Description', cell: ({ row }) => documentCell(row.original.step) },
  { id: 'company', accessorKey: 'company', header: 'Company', meta: { width: '5.5rem' } },
  { id: 'planned', accessorKey: 'planned', header: 'Planned date', meta: { width: '7.5rem', nowrap: true } },
  { id: 'actual', accessorKey: 'actual', header: 'Actual date', meta: { width: '7.5rem', nowrap: true } },
  { id: 'forecast', accessorKey: 'forecast', header: 'Forecast date', meta: { width: '7.5rem', nowrap: true } }
];

export const locations = [
  { name: 'AA-AI-1', path: 'C:\\Users\\nomeutente\\Documents' },
  { name: 'AA-AI-2', path: 'C:\\Users\\nomeutente\\Documents' }
];

export const locationColumns = [
  { id: 'name', header: 'Name', meta: { width: '7rem' }, cell: ({ row }) => documentCell(row.original.name) },
  { id: 'path', accessorKey: 'path', header: 'Path' }
];

// ------------------------------------------------------------------ Users (Choose user, 44 users)

const user = (name, description) => ({ name, description });

export const users = [
  user('saxt0140', 'saxt0140 (saxt0140 saxt0140)'),
  user('user_test1', 'user_test1 (user_test1 user for test purposes)'),
  user('Cazzaniga Alice', 'alice.cazzaniga@saipem.com'),
  user('Cappelluti Davide', 'davide.cappelluti@saipem.com'),
  user('Vailati Facchini Francesca', 'francesca.vailatifacchini@saipem.com'),
  user('MARTYNOV Cecile', 'cecile.martynov@saipem.com'),
  user('De Angeli Filippo', 'filippo.deangeli@saipem.com'),
  user('Benhassen Naila', 'naila.benhassen@saipem.com'),
  user('Coulson Nick', 'nick.coulson@saipem.com'),
  user('Bizzarro Stefano', 'stefano.bizzarro@saipem.com'),
  user('ALICOT Pierre', 'pierre.alicot@saipem.com'),
  user('Mitchell Lesley', 'lesley.mitchell.guest@saipem.com'),
  user('GOUSSARD Isabelle', 'isabelle.goussard@saipem.com'),
  user('Ongis Mauro', 'mauro.ongis2@saipem.com'),
  user('PAGE AM', 'PAGE AM (page_am)'),
  user("Vigano' Luca Edoardo", 'lucaedoardo.vigano@saipem.com'),
  user('Romanò Andrea', 'andrea.romano@saipem.com'),
  user('Aiello Ciro', 'ciro.aiello@saipem.com'),
  user('Bianchi Marco', 'marco.bianchi@saipem.com'),
  user('Colombo Giulia', 'giulia.colombo@saipem.com'),
  user('DUPONT Laurent', 'laurent.dupont@saipem.com'),
  user('Esposito Luca', 'luca.esposito@saipem.com'),
  user('Ferrari Chiara', 'chiara.ferrari@saipem.com'),
  user('Galli Roberto', 'roberto.galli@saipem.com'),
  user('HASSAN Omar', 'omar.hassan@saipem.com'),
  user('Lombardi Sara', 'sara.lombardi@saipem.com'),
  user('Mancini Paolo', 'paolo.mancini@saipem.com'),
  user('Moretti Elena', 'elena.moretti@saipem.com'),
  user('NGUYEN Thi', 'thi.nguyen.guest@saipem.com'),
  user('Orlando Matteo', 'matteo.orlando@saipem.com'),
  user('Pellegrini Anna', 'anna.pellegrini@saipem.com'),
  user('Ricci Federico', 'federico.ricci@saipem.com'),
  user('Rinaldi Valentina', 'valentina.rinaldi@saipem.com'),
  user('ROSSI Giovanni', 'giovanni.rossi@saipem.com'),
  user('Russo Martina', 'martina.russo@saipem.com'),
  user('SCHMIDT Anke', 'anke.schmidt@saipem.com'),
  user('Serra Davide', 'davide.serra@saipem.com'),
  user('Silva João', 'joao.silva@saipem.com'),
  user('Testa Lorenzo', 'lorenzo.testa@saipem.com'),
  user('Valentini Ilaria', 'ilaria.valentini@saipem.com'),
  user('Villa Simone', 'simone.villa@saipem.com'),
  user('WILSON James', 'james.wilson@saipem.com'),
  user('Zanetti Paola', 'paola.zanetti@saipem.com'),
  user('Zito Antonio', 'antonio.zito@saipem.com')
];

export const userColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    meta: { width: '15rem' },
    cell: ({ row }) => html`<span class="rs-subheading">${row.original.name}</span>`
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Email / description',
    meta: { nowrap: true },
    cell: ({ row }) => html`<span title=${row.original.description}>${row.original.description}</span>`
  }
];

// ------------------------------------------------------------------ Document info dialog (Revisions › info action)

export const documentInfo = {
  summary: [
    ['Name', 'rwar-1'],
    ['DIN', 'rwar'],
    ['Title', 'rwar'],
    ['Revision code', '1']
  ],
  sections: [
    {
      title: 'Info',
      groups: [
        {
          title: 'Identification',
          items: [
            ['SP code', '—'],
            ['Document class', 'Internal Job Document'],
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
            ['Originator', '—'],
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

// ------------------------------------------------------------------ Documents (Main page)

const DOCUMENT_FILE_ICON = {
  pdf: { name: 'file-earmark-pdf', title: 'Native file: PDF' },
  text: { name: 'file-earmark-text', title: 'Native file: text' },
  docx: { name: 'file-earmark-word', title: 'Native file: Word' }
};

/** Quick info without the current-revision flag: the Status column carries it. */
const documentQuickInfo = ({ row }) => {
  const record = row.original;
  const file = DOCUMENT_FILE_ICON[record.format ?? 'pdf'];
  return html`
    <span class="rs-inline">
      ${record.checkedOut ? html`<sl-icon name="lock" title="Checked out"></sl-icon>` : ''}
      ${file ? html`<sl-icon name=${file.name} title=${file.title}></sl-icon>` : ''}
    </span>
  `;
};

/** Documents table of the main page: a Status column, Current for the approved document, Working for the others. */
export const mainDocumentColumns = documentColumns.flatMap(column => {
  if (column.id === 'info') return [{ ...column, header: '', meta: { width: '5rem' }, cell: documentQuickInfo }];
  if (column.id !== 'document') return [column];
  return [
    column,
    {
      id: 'status',
      header: 'Status',
      meta: { width: '10rem' },
      cell: ({ row }) => statusTag(row.original.state === 'Working' ? 'Working' : 'Current')
    }
  ];
});
