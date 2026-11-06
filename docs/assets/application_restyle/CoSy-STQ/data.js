/*
 * CoSy-STQ — mock data of the Site Technical Query list (application_screenshot/CoSy STQ, screens 7 onwards).
 * Rows, versions and statuses transcribed from the screenshots; values cut or hidden there are "—".
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

import { documentFileCell, statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';
export { render } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

const stq = (name, version, subject = '—', status = null, title = '—') => ({ name, version, subject, status, title });

/** Screen 7: folder 000001 › Site Technical Queries, two versions of 8325_00 (no approval status column). */
export const stq8325_00 = [stq('STQ-TS-AUT-8325_00', '0.1', 'test'), stq('STQ-TS-AUT-8325_00', '0.2', 'test')];

/** Folder AUT - Automation › TESTSUBCO, all versions: 120-T01234 and the latest version follow the workflow, 0.1 stays Draft. */
export const stqRows = (status, firstStatus = status) => [
  stq('120-T01234', '0.1', '—', firstStatus),
  stq('STQ-TS-AUT-8325_01', '0.1', 'test', 'Draft'),
  stq('STQ-TS-AUT-8325_01', '0.2', 'test', status)
];

/** Screens 8–10. */
export const stqTestSubco = stqRows('Draft');

/** Workflow actions (legacy "Actions…" submenu) by STQ status. */
export const WORKFLOW = {
  Draft: [
    { label: 'Send for verification', icon: 'check-square' },
    { label: 'Send to FEM for approval', icon: 'send' },
    { label: 'Send to FEM for Discipline check', icon: 'clipboard-check' },
    { label: 'Promote directly to Closed', icon: 'lock' },
    { label: 'Mark as cancelled', icon: 'x-circle' }
  ],
  'Issued for verification': [
    { label: 'Verify STQ', icon: 'check-square' },
    { label: 'Return STQ to FSE in Draft', icon: 'arrow-counterclockwise' },
    { label: 'Mark as cancelled', icon: 'x-circle' }
  ],
  'Issued to FEM': [
    { label: 'Approve STQ', icon: 'check2-circle' },
    { label: 'Reject STQ and return to FSE', icon: 'exclamation-octagon' },
    { label: 'Mark as cancelled', icon: 'x-circle' },
    { label: 'Return STQ to Draft', icon: 'arrow-counterclockwise' }
  ],
  'Issued to DS & QA/QC': [
    { label: 'Acknowledge by DS', icon: 'check2-circle' },
    { label: 'Acknowledge by QA/QC', icon: 'check2-circle' },
    { label: 'Mark as cancelled', icon: 'x-circle' }
  ],
  'Ready for issue': [
    { label: 'Issue to Subco', icon: 'send' },
    { label: 'Mark as cancelled', icon: 'x-circle' },
    { label: 'Return to Draft', icon: 'arrow-counterclockwise' }
  ],
  'Issued to Subco': [
    { label: 'Promote to Closed', icon: 'lock' },
    { label: 'Return to Ready for issue', icon: 'arrow-counterclockwise' },
    { label: 'Mark as cancelled', icon: 'x-circle' }
  ],
  Closed: [
    { label: 'Return to Ready for issue', icon: 'arrow-counterclockwise' },
    { label: 'Mark as cancelled', icon: 'x-circle' }
  ]
};

/** Legacy menu differences by status: no "Import attachment…" while with DS & QA/QC; "Create new revision…" once ready for issue. */
const NO_ATTACHMENT = ['Issued to DS & QA/QC'];
const CREATE_REVISION = ['Ready for issue', 'Issued to Subco', 'Closed'];

/** Row menu: same items and order as the legacy context menu; "Actions…" is a submenu with the workflow actions of the status. */
const stqMenu = ({ row }) => {
  const workflow = WORKFLOW[row.original.status] ?? [];
  return html`
    <sl-menu>
      <sl-menu-item value="view"><sl-icon slot="prefix" name="eye"></sl-icon>View</sl-menu-item>
      <sl-divider></sl-divider>
      ${NO_ATTACHMENT.includes(row.original.status)
        ? ''
        : html`<sl-menu-item value="attachment"
              ><sl-icon slot="prefix" name="link-45deg"></sl-icon>Import attachment…</sl-menu-item
            >
            <sl-divider></sl-divider>`}
      ${CREATE_REVISION.includes(row.original.status)
        ? html`<sl-menu-item value="create-revision"
            ><sl-icon slot="prefix" name="file-earmark-plus"></sl-icon>Create new revision…</sl-menu-item
          >`
        : ''}
      <sl-menu-item value="revision"
        ><sl-icon slot="prefix" name="upload"></sl-icon>Import new revision from Subco…</sl-menu-item
      >
      <sl-divider></sl-divider>
      <sl-menu-item value="version"
        ><sl-icon slot="prefix" name="cloud-arrow-up"></sl-icon>Import new version…</sl-menu-item
      >
      <sl-divider></sl-divider>
      <sl-menu-item value="export"><sl-icon slot="prefix" name="download"></sl-icon>Export…</sl-menu-item>
      <sl-divider></sl-divider>
      <sl-menu-item value="locate"><sl-icon slot="prefix" name="geo-alt"></sl-icon>Locate</sl-menu-item>
      <sl-menu-item value="mail"><sl-icon slot="prefix" name="envelope"></sl-icon>Send mail</sl-menu-item>
      <sl-divider></sl-divider>
      <sl-menu-item value="actions"
        ><sl-icon slot="prefix" name="diagram-3"></sl-icon>Actions…
        ${workflow.length
          ? html`<sl-menu slot="submenu">
              ${workflow.map(
                ({ label, icon }) =>
                  html`<sl-menu-item><sl-icon slot="prefix" name=${icon}></sl-icon>${label}</sl-menu-item>`
              )}
            </sl-menu>`
          : ''}</sl-menu-item
      >
      <sl-divider></sl-divider>
      <sl-menu-item value="delete"><sl-icon slot="prefix" name="trash"></sl-icon>Delete</sl-menu-item>
      <sl-divider></sl-divider>
      <sl-menu-item value="properties"><sl-icon slot="prefix" name="info-circle"></sl-icon>Properties</sl-menu-item>
    </sl-menu>
  `;
};

const nameCell = ({ row }) => documentFileCell('pdf', row.original.name);

const name = { id: 'name', header: 'Name', meta: { width: 'minmax(16rem, 1fr)' }, cell: nameCell };
const subject = {
  id: 'subject',
  accessorKey: 'subject',
  header: 'Subject',
  meta: { width: '10rem' },
  enableSorting: true
};
const status = {
  id: 'status',
  header: 'Approval status',
  meta: { width: '15rem', nowrap: true },
  cell: ({ row }) => statusTag(row.original.status)
};
const version = { id: 'version', accessorKey: 'version', header: 'Ver.', enableSorting: true, meta: { width: '5rem' } };
const title = { id: 'title', accessorKey: 'title', header: 'Title', meta: { width: '12rem' } };
const actions = { id: 'actions', meta: { actions: true }, cell: stqMenu };

/** Screen 7 has only Name and Subject. */
export const stqColumnsBasic = [name, subject, version, actions];
export const stqColumns = [name, subject, status, title, version, actions];

export const isLatest = stqName => row => row.name === stqName && row.version === '0.2';

/** Opens the row menu (⋮) of the n-th row and its "Actions…" submenu, as in the screenshots that show it open. */
export async function openRowActions(selector, index) {
  const { openRowMenu } = await import('../_shared/restyle.js');
  await openRowMenu(selector, index);
  const table = document.querySelector(selector);
  await new Promise(resolve => setTimeout(resolve, 200));
  const menus = table.shadowRoot.querySelectorAll('.table__action-menu');
  const item = menus[index]?.querySelector('sl-menu-item[value="actions"]');
  item?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
}

/** Legacy "Doclist ▾" menu, shown open in screen 26: same items, order and separators. */
export const listOptionsMenu = html`<sl-menu>
  <sl-menu-item value="columns"><sl-icon slot="prefix" name="table"></sl-icon>Columns…</sl-menu-item>
  <sl-menu-item value="excel"><sl-icon slot="prefix" name="file-earmark-excel"></sl-icon>Export to Excel</sl-menu-item>
  <sl-divider></sl-divider>
  <sl-menu-item value="refresh"><sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>Refresh</sl-menu-item>
  <sl-divider></sl-divider>
  <sl-menu-item value="expand"><sl-icon slot="prefix" name="arrow-left-right"></sl-icon>Expand</sl-menu-item>
</sl-menu>`;

/** Attachments of STQ-TS-AUT-8325_01 (legacy Attachments panel, screen 8). */
export const stqAttachments = [
  { name: '120-T01234', format: 'pdf', title: '—', version: '0.1', current: false, cls: '—' }
];

/** Versions of STQ-TS-AUT-8325_01 shown in the detail panel (latest first). */
export const stqVersions = latestStatus => [
  { name: 'STQ-TS-AUT-8325_01', format: 'pdf', version: '0.2', current: true, status: latestStatus },
  { name: 'STQ-TS-AUT-8325_01', format: 'pdf', version: '0.1', current: false, status: 'Draft' }
];
