/*
 * xCPage-CreateTransmittal — mock data and table setup shared by every screen of the flow.
 *
 * Documents and recipients of the "add" steps are transcribed from the legacy screenshots. The legacy list of
 * transmittals is empty, so its rows are made up on the same shape — see REPORT.md §7.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { documentCell } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Transmittals list (Outgoing)

const trm = (name, identification, created, creator, assignedTo, state = 'Working') => ({
  entity: 'transmittal',
  type: 'Outgoing Transmittal',
  name,
  identification,
  created,
  creator,
  assignedTo,
  state
});

export const transmittals = [
  trm('FEPCO kick-off documents', 'TRM-OUT-0003', '14-Oct-2026', 'Aiello Ciro', 'Aiello Ciro'),
  trm('Vendor datasheets', 'TRM-OUT-0002', '12-Oct-2026', 'Cazzaniga Alice', '—', 'Ready'),
  trm('As-built package', 'TRM-OUT-0001', '30-Sep-2026', 'Aiello Ciro', 'user_test1', 'Issued')
];

/** The transmittal created at the end of the flow (screen 9). */
export const createdTransmittal = trm('New outgoing transmittal', 'TRM-OUT-0004', '15-Oct-2026', 'Aiello Ciro', '—');

// State letters as in the legacy Quick info: W(orking), R(eady), Is(sued).
const STATE_BADGE = {
  Working: { letter: 'W', variant: 'neutral' },
  Ready: { letter: 'R', variant: 'warning' },
  Issued: { letter: 'Is', variant: 'success' }
};

/** Row menu of a transmittal: Operations (state-driven, see `operationsFor`), then the edit and derive actions. */
const transmittalMenu = ({ row }) => html`
  <sl-menu>
    <sl-menu-item value="operations" ?disabled=${row.original.state === 'Issued'}
      ><sl-icon slot="prefix" name="gear"></sl-icon>Operations</sl-menu-item
    >
    <sl-menu-item value="edit" ?disabled=${row.original.state === 'Issued'}
      ><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item
    >
    <sl-menu-item value="download"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-menu-item>
    <sl-divider></sl-divider>
    <sl-menu-item value="dp"
      ><sl-icon slot="prefix" name="arrow-right"></sl-icon>Create DP from transmittal</sl-menu-item
    >
  </sl-menu>
`;

export const transmittalColumns = [
  {
    id: 'info',
    header: 'Quick info',
    meta: { width: '6rem' },
    cell: ({ row }) => {
      const { letter, variant } = STATE_BADGE[row.original.state];
      return html`<span class="rs-inline">
        <sl-badge variant=${variant} pill title=${row.original.state}>${letter}</sl-badge>
        <sl-icon name="download" title="Download"></sl-icon>
      </span>`;
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => documentCell(row.original.name, row.original.identification)
  },
  {
    id: 'identification',
    accessorKey: 'identification',
    header: 'Transmittal identification',
    meta: { width: '12rem', nowrap: true }
  },
  {
    id: 'created',
    accessorKey: 'created',
    header: 'Created',
    enableSorting: true,
    meta: { width: '8rem', nowrap: true }
  },
  { id: 'creator', accessorKey: 'creator', header: 'Creator', meta: { width: '9rem', nowrap: true } },
  { id: 'assignedTo', accessorKey: 'assignedTo', header: 'Assigned to', meta: { width: '9rem', nowrap: true } },
  { id: 'actions', meta: { actions: true }, cell: transmittalMenu }
];

// ------------------------------------------------------------------ Step 2: documents to relate

const searchDoc = (document, din, title, revision, flag) => ({ document, din, title, revision, flag });

export const searchResults = [
  searchDoc('00-BG-E-83001.pdf', 'test', 'test', 'G', 'Not flagged'),
  searchDoc(
    '000-ZA-E-73175_Test',
    '000-ZA-E-73175_Test_sp_0001',
    'MANUFACTURING RECORD BOOK FOR KNPC/…',
    'B',
    'Flagged'
  ),
  searchDoc('002OT', 'Test External Doc', '—', 'RR', 'Not flagged'),
  searchDoc('003OT', 'Test-17toct', '—', 'ss', 'Current revision'),
  searchDoc('004OT', 'Test Doc', '—', '1234', 'Current revision')
];

export const searchColumns = [
  {
    id: 'info',
    header: 'Quick info',
    meta: { width: '7rem' },
    cell: ({ row }) => html`
      <span class="rs-inline">
        <sl-icon name="flag" title=${row.original.flag}></sl-icon>
        <sl-icon name="file-earmark-pdf" title="Native file: PDF"></sl-icon>
        <sl-icon name="file-earmark-text" title="Has attachments"></sl-icon>
      </span>
    `
  },
  {
    id: 'document',
    accessorKey: 'document',
    header: 'Document',
    cell: ({ row }) =>
      documentCell(row.original.document, ...[row.original.din, row.original.title].filter(line => line !== '—'))
  },
  { id: 'revision', accessorKey: 'revision', header: 'Rev. code', meta: { width: '6rem' } }
];

/** Columns of the documents already related to the transmittal (step 2): empty until documents are added. */
export const relatedColumns = [
  { id: 'info', header: 'Quick info', meta: { width: '7rem' } },
  { id: 'document', header: 'Document' },
  { id: 'revision', header: 'Rev. code', meta: { width: '6rem' } },
  { id: 'answer', header: 'Certifying body answer', meta: { width: '11rem', nowrap: true } },
  { id: 'client', header: 'Client answer', meta: { width: '9rem', nowrap: true } },
  { id: 'reason', header: 'Issuing reason', meta: { width: '9rem', nowrap: true } }
];

// ------------------------------------------------------------------ Step 3: recipients

const person = (name, email) => ({ name, email });

export const people = [
  person('saxt0140', 'PAGE_APPLICATION_MANAGEMENT@saipem.com'),
  person('user_test1', 's.manukonda@accenture.com'),
  person('Cazzaniga Alice', 'Alice.Cazzaniga@saipem.com'),
  person('Cappelluti Davide', 'Davide.Cappelluti@saipem.com'),
  person('Vailati Facchini Francesca', 'Francesca.VailatiFacchini@saipem.com'),
  person('MARTYNOV Cecile', 'Cecile.MARTYNOV@saipem.com'),
  person('De Angeli Filippo', 'Filippo.DeAngeli@saipem.com'),
  person('Benhassen Naila', 'Naila.Benhassen@saipem.com'),
  person('Coulson Nick', 'nick.coulson@saipem.com'),
  person('Bizzarro Stefano', 'Stefano.Bizzarro@saipem.com'),
  person('ALICOT Pierre', 'Pierre.ALICOT@saipem.com'),
  person('Mitchell Lesley', 'Lesley.Mitchell@saipem.com')
];

export const isUserTest1 = row => row.name === 'user_test1';

export const peopleColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    meta: { width: '16rem' },
    cell: ({ row }) => html`<span class="rs-subheading">${row.original.name}</span>`
  },
  { id: 'email', accessorKey: 'email', header: 'Email', meta: { nowrap: true } }
];

/** Columns of the recipients already added to the transmittal (step 3): empty until recipients are added. */
export const recipientColumns = [
  { id: 'name', header: 'Name', meta: { width: '14rem' } },
  { id: 'email', header: 'Email' },
  { id: 'reason', header: 'Reason', meta: { width: '12rem', nowrap: true } },
  { id: 'delivery', header: 'Delivery method', meta: { width: '12rem', nowrap: true } }
];
