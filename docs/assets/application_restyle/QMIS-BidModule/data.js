/*
 * QMIS-BidModule — mock data and table setup shared by every screen of the flow.
 * Rows transcribed from application_screenshot/QMIS-BidModule. Truncated legacy values are kept as shown;
 * values hidden in the screenshots are "—".
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { revisionTag, statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Legend (Legend display dialog)

/** Bid status: square badge in the Quick info. */
export const BID_STATUS = {
  O: { label: 'Ongoing', variant: 'warning' },
  S: { label: 'Submitted', variant: 'success' },
  A: { label: 'Awarded', variant: 'primary' },
  OH: { label: 'On hold', variant: 'accent' },
  L: { label: 'Lost', variant: 'danger' },
  C: { label: 'Cancelled', variant: 'neutral' }
};

/** Bid documents status: pill badge in the Quick info. */
export const DOCS_STATUS = {
  W: { label: 'Working', variant: 'warning' },
  I: { label: 'Issued', variant: 'neutral' },
  A: { label: 'Approved', variant: 'success' },
  R: { label: 'Rejected', variant: 'danger' }
};

/** Bid approval milestones reached. */
export const APPROVAL = {
  TE: 'Technical docs approved',
  CO: 'Commercial docs approved',
  PM: 'Bid docs shared with proposal'
};

// ------------------------------------------------------------------ Bids

const bid = (
  status,
  docs,
  approvals,
  businessUnit,
  projectName,
  activityType,
  entity,
  number,
  openDate,
  country = '—',
  client = '—',
  valueSize = '—'
) => ({
  status,
  docs,
  approvals,
  businessUnit,
  projectName,
  activityType,
  entity,
  number,
  openDate,
  country,
  client,
  valueSize
});

/** The bid created in screens 3–8. */
const created = (docs, approvals) =>
  bid(
    'O',
    docs,
    approvals,
    'Robotics&Ind. Sol.',
    'Saipem DEMO',
    'Activity Type - Jul 27 - Edited',
    'HO - Bucharest - EC',
    '2026-BID-000004',
    '15-Oct-2026',
    '—',
    'ABB POWER SYS…'
  );

const adminRows = [
  bid(
    'O',
    'W',
    [],
    'Onshore',
    'SAIPEM Demo',
    'test OWNER_NAME pickli…',
    'GLOBAL PETROPROJ…',
    '2026-BID-000003',
    '15-Oct-2026',
    '—',
    'ABB/MAERSK OIL …'
  ),
  bid(
    'O',
    'A',
    ['PM'],
    'Offshore',
    'Aug 14 - Bid Atta…',
    'Tipo di attività - IT - Edited',
    'BOSCONGO SA',
    '2023-BID-000124',
    '14-Aug-2023',
    'Kuwait',
    'Abu Dhabi Gas Ind…',
    'XL (economic va…'
  ),
  bid(
    'A',
    'W',
    [],
    'Offshore',
    'Dec 13, 2023 Pro…',
    'Tipo di attività - IT - Edited',
    'SERVIZI ENERGIA ITA…',
    '2023-BID-000125',
    '13-Dec-2023',
    'Kuwait',
    'Cadogan Petroleu…',
    'XL (economic va…'
  ),
  bid(
    'O',
    'R',
    ['TE', 'PM'],
    'Robotics&Ind. Sol.',
    'Not Applicable',
    'TestActivity',
    'HO - Chennai - EP(I)C …',
    '2023-BID-000115',
    '12-Jun-2024',
    '—',
    'ABB POWER SYS…'
  ),
  bid(
    'O',
    'A',
    ['TE', 'CO', 'PM'],
    'Onshore',
    'test valeria 2',
    'TestActivity',
    'BOSCONGO SA',
    '2023-BID-000119',
    '21-Jun-2023',
    '—',
    'ABB POWER SYS…'
  ),
  bid(
    'O',
    'I',
    ['CO', 'PM'],
    'Floaters',
    'test valeria SCTA…',
    'TestActivity',
    'BOSCONGO SA',
    '2023-BID-000118',
    '21-Jun-2023',
    '—',
    'ABU DHABI COMP…'
  )
];

/** user_qmis_admin, before the new bid (screens 1–7). */
export const bids = adminRows;
/** user_qmis_admin, new bid created (screens 8–13). */
export const bidsCreated = [created('W', []), ...adminRows];
/** user_qmis_admin, both approvals done (screen 18). */
export const bidsApproved = [created('A', ['TE', 'CO']), ...adminRows];
/** user_qmis_admin, bid shared with the proposal manager (screen 19). */
export const bidsShared = [created('A', ['TE', 'CO', 'PM']), ...adminRows];
/** user_qmis_admin, bid force-approved and shared again (screen 21). */
export const bidsForced = [created('A', ['PM']), ...adminRows];

const testRow = bid(
  'O',
  'A',
  ['TE', 'CO', 'PM'],
  'Offshore',
  'test 31072025',
  'test OWNER_…',
  "DENUKE SOCIETA' C…",
  '2025-BID-000058',
  '31-Jul-2025',
  '—',
  'Abu Dhabi Gas Ind…'
);
const domeRow = bid(
  'O',
  'A',
  [],
  'Corporate',
  'testProjectDome',
  'test OWNER_NAME pickli…',
  'ANDROMEDA CONSU…',
  '2023-BID-000011',
  '20-Jan-2023',
  'Belize',
  'ABB POWER SYS…',
  'L (economic value t…'
);

/** user_qmis_bid_tech_approver, My tasks (screens 14–15). */
export const techApproverBids = [
  created('I', []),
  adminRows[1],
  testRow,
  bid(
    'O',
    'W',
    ['TE', 'PM'],
    'Onshore',
    'test_User Qmis bi…',
    'AT_17',
    'HO - Bucharest - EC',
    '2025-BID-000053',
    '29-Jul-2025',
    '—',
    'ABU DHABI COMP…'
  ),
  bid(
    'S',
    'I',
    ['TE', 'CO', 'PM'],
    'Corporate',
    'Test_BID_Template',
    'TestActivity',
    'ANDROMEDA CONSU…',
    '2023-BID-000093',
    '08-May-2023',
    '—',
    'ABB POWER SYS…'
  ),
  domeRow
];

/** user_qmis_bid_comm_approver, My tasks (screens 16–17). */
export const commApproverBids = [
  created('I', ['TE']),
  testRow,
  bid(
    'O',
    'W',
    ['CO', 'PM'],
    'Onshore',
    'test commercial n…',
    'Test Type',
    '—',
    '—',
    '29-Jul-2025',
    '—',
    'ABB/MAERSK OIL …'
  ),
  bid(
    'O',
    'W',
    ['CO'],
    'Offshore Wind',
    'test OWNER_NA…',
    'test OWNER_NAME pickli…',
    "DENUKE SOCIETA' C…",
    '2025-BID-000054',
    '29-Jul-2025',
    '—',
    'BP America'
  ),
  domeRow,
  bid(
    'O',
    'I',
    [],
    'Drilling',
    'test project bid',
    'Test Type',
    'HO - Milan',
    '2024-BID-000003',
    '11-Jan-2024',
    '—',
    '123456'
  )
];

export const isNewBid = row => row.number === '2026-BID-000004';

// ------------------------------------------------------------------ Columns

/** Quick info: bid status (square), documents status (pill), approvals reached, attachments. */
const quickInfo = ({ row }) => {
  const { status, docs, approvals } = row.original;
  const s = BID_STATUS[status];
  const d = DOCS_STATUS[docs];
  return html`<span class="rs-inline">
    <sl-badge variant=${s.variant} title="Bid status: ${s.label}">${status}</sl-badge>
    <sl-badge variant=${d.variant} pill title="Documents: ${d.label}">${docs}</sl-badge>
    ${approvals.map(a => html`<sl-badge variant="neutral" pill title=${APPROVAL[a]}>${a}</sl-badge>`)}
    <sl-icon name="link-45deg" title="Attachments"></sl-icon>
  </span>`;
};

/**
 * Row menu. `approval` lists the approval actions of the current user (legacy "Actions…" submenu);
 * approvers cannot edit or delete.
 */
const bidMenu =
  ({ approval, canEdit }) =>
  () => html`
    <sl-menu>
      <sl-menu-item value="view"><sl-icon slot="prefix" name="eye"></sl-icon>View</sl-menu-item>
      <sl-menu-item value="edit" ?disabled=${!canEdit}
        ><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item
      >
      <sl-divider></sl-divider>
      <sl-menu-label>Approval</sl-menu-label>
      ${approval.map(
        ({ label, icon }) => html`<sl-menu-item><sl-icon slot="prefix" name=${icon}></sl-icon>${label}</sl-menu-item>`
      )}
      <sl-divider></sl-divider>
      <sl-menu-item value="delete" ?disabled=${!canEdit}
        ><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item
      >
    </sl-menu>
  `;

const col = (id, header, width, extra = {}) => ({
  id,
  accessorKey: id,
  header,
  meta: { width, nowrap: true },
  ...extra
});

const columns = menu => [
  { id: 'info', header: 'Quick info', meta: { width: '14rem' }, cell: quickInfo },
  col('number', 'Bid number', '10rem', { enableSorting: true }),
  col('projectName', 'Project name', 'minmax(10rem, 1fr)', { enableSorting: true }),
  col('businessUnit', 'Business unit', '9rem'),
  col('activityType', 'Activity type', '12rem'),
  col('entity', 'Saipem bidding entity', '12rem'),
  col('openDate', 'Bid open date', '8rem', { enableSorting: true }),
  col('country', 'Project country', '8rem'),
  col('client', 'Client', '10rem'),
  col('valueSize', 'Project value size', '9rem'),
  { id: 'actions', meta: { actions: true }, cell: bidMenu(menu) }
];

export const bidColumns = columns({
  canEdit: true,
  approval: [
    { label: 'Send for approval', icon: 'send' },
    { label: 'Force approval', icon: 'check2-all' },
    { label: 'Share with proposal manager', icon: 'person-check' }
  ]
});
export const techApproverColumns = columns({
  canEdit: false,
  approval: [{ label: 'Technical approval', icon: 'shield-check' }]
});
export const commApproverColumns = columns({
  canEdit: false,
  approval: [{ label: 'Commercial approval', icon: 'shield-check' }]
});

// ------------------------------------------------------------------ Attachments

const attachmentColumns = [
  col('name', 'Name', 'minmax(12rem, 1fr)'),
  col('title', 'Title', '8rem'),
  {
    id: 'version',
    header: 'Version code',
    meta: { width: '9rem' },
    cell: ({ row }) =>
      html`<span class="rs-inline"
        >${row.original.version}<sl-tag size="small" variant="success">Current</sl-tag></span
      >`
  },
  col('cls', 'Class', '8rem'),
  col('type', 'Type', '7rem'),
  {
    id: 'status',
    header: 'Status',
    meta: { width: '8rem' },
    cell: ({ row }) => html`<sl-status filled size="small" variant="warning">${row.original.status}</sl-status>`
  },
  col('date', 'Status date', '8rem')
];
export { attachmentColumns };

export const attachments = [
  {
    name: 'CommercialAttachment.docx',
    title: '—',
    version: '1.0',
    cls: 'Commercial',
    type: '—',
    status: 'Working',
    date: '15-Oct-2026'
  }
];

export const approvalAttachmentColumns = [
  col('name', 'Attachment name', 'minmax(12rem, 1fr)'),
  col('title', 'Document title', '9rem'),
  col('type', 'Attachment type', '9rem'),
  col('status', 'Approval status', '9rem'),
  {
    id: 'actions',
    meta: { actions: true },
    cell: () => html`
      <sl-menu>
        <sl-menu-item value="download"><sl-icon slot="prefix" name="download"></sl-icon>Download</sl-menu-item>
        <sl-menu-item value="remove"><sl-icon slot="prefix" name="trash"></sl-icon>Remove</sl-menu-item>
      </sl-menu>
    `
  }
];
export const technicalAttachments = [{ name: 'TechnicalAttachment.docx', title: '—', type: '—', status: '—' }];
export const commercialAttachments = [{ name: 'CommercialAttachment.docx', title: '—', type: '—', status: '—' }];

// ------------------------------------------------------------------ View bid: approval and revision history

/** Approval history of 2026-BID-000004 (screen 22): the last row is cut in the legacy screenshot. */
export const approvalHistoryColumns = [
  col('number', 'Bid number', '10rem'),
  {
    id: 'revision',
    header: 'Revision code',
    meta: { width: '10rem' },
    cell: ({ row }) => revisionTag(row.original.revision)
  },
  col('date', 'Action date', '11rem'),
  col('action', 'Action type', 'minmax(14rem, 1fr)'),
  col('user', 'User name', '12rem'),
  col('notes', 'Action notes', 'minmax(12rem, 1fr)')
];
const history = (date, action, notes = '—', user = 'user_qmis_admin') => ({
  number: '2026-BID-000004',
  revision: '01',
  date: `15-Oct-2026 ${date}`,
  action,
  user,
  notes
});
export const approvalHistory = [
  history('10:12 am', 'Shared to proposal manager', 'No issuing notes'),
  history('10:12 am', 'Force approval'),
  history('10:11 am', 'Return to working'),
  history('10:11 am', 'Shared to proposal manager', 'Sharing with PM for review'),
  history('10:08 am', 'Commercial approval: Appro…', 'Attachment is fine, approved', 'user_qmis_bid_comm_appro…'),
  history('10:07 am', 'Sent for commercial appro…', 'Attachment version fixed, review ar…')
];

/** Revision history of 2026-BID-000004 (screens 23): revision 02 created in screen 21. */
export const revisionHistoryColumns = [
  {
    id: 'status',
    header: 'Revision status',
    meta: { width: '10rem' },
    cell: ({ row }) => statusTag(row.original.status)
  },
  {
    id: 'revision',
    header: 'Revision code',
    meta: { width: '10rem' },
    cell: ({ row }) => revisionTag(row.original.revision)
  },
  col('date', 'Revision date', '9rem'),
  col('reason', 'Revision reason', 'minmax(12rem, 1fr)'),
  col('user', 'Revision user', '12rem')
];
export const revisionHistory = [
  { status: 'Current', revision: '02', date: '15-Oct-2026', reason: 'Revision for demo', user: 'user_qmis_admin' },
  { status: 'Superseded', revision: '01', date: '15-Oct-2026', reason: 'FIRST REVISION', user: 'user_qmis_admin' }
];

// ------------------------------------------------------------------ Send mail notice (screens 24–25)

const personCol = (id, header) => col(id, header, 'minmax(10rem, 1fr)');
export const recipientColumns = [personCol('name', 'User name'), personCol('email', 'Email address')];
/** Available users: names truncated in the legacy are kept as shown. */
export const availableRecipients = [
  { name: 'Account Service (SA…', email: 'SAXT01431@saipem.com' },
  { name: 'Boffelli Anselmo (Ans…', email: 'Anselmo.Boffelli.Guest@saipem.com' },
  { name: 'Candura Andrea (And…', email: 'Andrea.candura@it.ey.com' },
  { name: 'Castro Tomas (Tomas…', email: 'Tomas.Castro.Guest@saipem.com' },
  { name: 'Ceccolini Simone (Si…', email: 'Simone.Ceccolini@saipem.com' },
  { name: 'Dangelo Alessandro', email: 'Alessandro.Dangelo@saipem.com' },
  { name: 'Dango Tamunotonye (…', email: 'Tamunotonye.Dango@saipem.com' }
];
export const selectedRecipients = [
  { name: 'Aakula JyothirLatha (…', email: 'ACNXAA002503@xa.saipem.com' },
  { name: 'Amit Kumar Mandal (…', email: 'Mandal.AmitKumar.Guest@saipem.com' }
];

// ------------------------------------------------------------------ Advanced query (screens 27–28)

/** List after the bid was deleted (screen 27): rows in the legacy order, the three new ones transcribed. */
export const bidsAdvanced = [
  adminRows[0],
  adminRows.find(row => row.number === '2023-BID-000118'),
  adminRows.find(row => row.number === '2023-BID-000119'),
  bid(
    'O',
    'A',
    ['TE', 'CO', 'PM'],
    'Drilling',
    'QWERTY',
    'Activity Type - Jul 27 - Ed…',
    'GLOBAL PETROPROJEC…',
    '2026-BID-000002',
    '16-Mar-2026'
  ),
  bid('O', 'W', [], 'Drilling', 'wert', 'AT_17', 'HO - Bucharest - EC', '2026-BID-000001', '06-Mar-2026'),
  bid(
    'O',
    'A',
    ['TE', 'CO'],
    'Offshore',
    'test 31072025',
    'AT_17',
    "DENUKE SOCIETA' CONS…",
    '2025-BID-000057',
    '31-Jul-2025'
  )
].filter(Boolean);
/** Business unit Drilling + Product line Downstream Refining & Petrochemicals (screen 28). */
export const bidsFiltered = [
  bid(
    'O',
    'W',
    [],
    'Drilling',
    '300424',
    'TestActivity',
    'ANDROMEDA CONSULT…',
    '2024-BID-000004',
    '30-Apr-2024',
    '—',
    'ABB POWER SYSTEMS'
  )
];
