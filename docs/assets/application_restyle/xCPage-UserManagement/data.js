/*
 * xCPage-UserManagement — mock data and table setup shared by every screen of the flow.
 *
 * Transcribed from application_screenshot/xCPage - User Management/ (screenshots + README.md). User names, logins and
 * addresses are redacted in the legacy screenshots: the values here are mock data with realistic lengths; states and
 * last login times are the real ones of the screenshots.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';
import { statusTag } from '../_shared/restyle.js';

export * from '../_shared/restyle.js';

// ------------------------------------------------------------------ Users

const user = (name, login, state, address, lastLogin, group, description) => ({
  name,
  login,
  state,
  address,
  lastLogin,
  group,
  description
});

/** Result of Show all users (legacy page size 50, here 25): states and last logins from the screenshot. */
export const users = [
  user(
    'Rossi Mario',
    'mrossi',
    'Active',
    'mario.rossi@saipem.com',
    '15-Oct-2024 12:30 pm',
    'xcp_users',
    'Document controller'
  ),
  user(
    'Bianchi Laura',
    'lbianchi',
    'Active',
    'laura.bianchi@saipem.com',
    '15-Oct-2024 12:36 pm',
    'xcp_users',
    'Lead reviewer'
  ),
  user(
    'Kuppili Sai Durga',
    'skuppili',
    'Active',
    'saidurga.kuppili@saipem.com',
    '17-Feb-2025 01:20 pm',
    'xcp_admins',
    'Configuration administrator'
  ),
  user(
    'De Angeli Filippo',
    'fdeangeli',
    'Active',
    'filippo.deangeli@saipem.com',
    '17-Feb-2025 01:21 pm',
    'xcp_admins',
    'Configuration administrator'
  ),
  user(
    'Test User',
    'user_test1',
    'Active',
    'user.test1@saipem.com',
    '18-Feb-2020 12:08 pm',
    'xcp_users',
    'user for test purposes'
  ),
  user(
    'Test User 2',
    'user_test2',
    'Active',
    'user.test2@saipem.com',
    '31-Aug-2022 01:04 pm',
    'xcp_users',
    'user for test purposes'
  ),
  user('Ferrari Giulia', 'gferrari', 'Inactive', 'giulia.ferrari@saipem.com', '3-Apr-2016 03:42 pm', 'xcp_users', '—'),
  user('Colombo Andrea', 'acolombo', 'Inactive', 'andrea.colombo@saipem.com', '31-Aug-2022 01:39 pm', 'xcp_users', '—'),
  user('Ricci Paolo', 'pricci', 'Inactive', 'paolo.ricci@saipem.com', '3-Apr-2016 03:32 pm', 'xcp_users', '—'),
  user('Marino Elena', 'emarino', 'Inactive', 'elena.marino@saipem.com', '2-Oct-2018 04:25 am', 'xcp_users', '—')
];

export const selectedUser = users[0];
export const isSelectedUser = row => row.login === selectedUser.login;

const truncate =
  key =>
  ({ row }) =>
    html`<span class="rs-truncate" title=${row.original[key]}>${row.original[key]}</span>`;

const userMenu = () => html`
  <sl-menu>
    <sl-menu-item value="info"><sl-icon slot="prefix" name="info-circle"></sl-icon>User info</sl-menu-item>
  </sl-menu>
`;

export const userColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'User name',
    enableSorting: true,
    meta: { width: 'minmax(10rem, 1fr)' },
    cell: ({ row }) =>
      html`<span class="rs-inline"
        ><sl-icon name="person-fill"></sl-icon
        ><span class="rs-truncate" title=${row.original.name}>${row.original.name}</span></span
      >`
  },
  { id: 'login', accessorKey: 'login', header: 'User login name', enableSorting: true, meta: { width: '10rem' } },
  {
    id: 'state',
    accessorKey: 'state',
    header: 'User state',
    enableSorting: true,
    meta: { width: '8rem' },
    cell: ({ row }) => statusTag(row.original.state)
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'User address',
    enableSorting: true,
    meta: { width: 'minmax(12rem, 1fr)' },
    cell: truncate('address')
  },
  { id: 'group', accessorKey: 'group', header: 'Group', enableSorting: true, meta: { width: '8rem' } },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    meta: { width: 'minmax(10rem, 1fr)' },
    cell: truncate('description')
  },
  {
    id: 'lastLogin',
    accessorKey: 'lastLogin',
    header: 'Last login (UTC)',
    enableSorting: true,
    meta: { width: '12.5rem', nowrap: true }
  },
  { id: 'actions', meta: { actions: true }, cell: userMenu }
];

/** With the User info panel open the table is narrower: Group and Description stay in the panel. */
export const userColumnsWithPanel = userColumns.filter(c => !['group', 'description'].includes(c.id));

// ------------------------------------------------------------------ Groups and roles (Name · Description lists)

const named = (name, description = '—') => ({ name, description });

export const projectGroups = [
  named('first_project_group', 'Organization Group for First Project'),
  named('second_project_group', 'Organization Group for Second Project'),
  named('third_project_group', 'Organization Group for Third Project')
];

export const roles = [
  named('example_role_first', 'Example Role First'),
  named('example_role_second', 'Example Role Second'),
  named('example_role_third', 'Example Role Third')
];

export const corporateGroups = [named('admins', 'Configuration Admin Group for all Projects'), named('managers')];

const roleMenu = () => html`
  <sl-menu>
    <sl-menu-item value="properties"><sl-icon slot="prefix" name="pencil"></sl-icon>Properties</sl-menu-item>
  </sl-menu>
`;

const nameColumns = (icon, menu) => [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    meta: { width: 'minmax(14rem, 1fr)' },
    cell: ({ row }) => html`<span class="rs-inline"><sl-icon name=${icon}></sl-icon>${row.original.name}</span>`
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    enableSorting: true,
    meta: { width: 'minmax(16rem, 2fr)' },
    cell: truncate('description')
  },
  ...(menu ? [{ id: 'actions', meta: { actions: true }, cell: menu }] : [])
];

const groupMenu = () => html`
  <sl-menu>
    <sl-menu-item value="properties"><sl-icon slot="prefix" name="pencil"></sl-icon>Properties</sl-menu-item>
  </sl-menu>
`;

export const projectGroupColumns = nameColumns('briefcase', groupMenu);
export const roleColumns = nameColumns('shield-lock', roleMenu);
export const corporateGroupColumns = nameColumns('building', groupMenu);

// ------------------------------------------------------------------ Role properties

export const editedRole = {
  name: 'my_project_role_admins',
  owner: 'owner_admins',
  administrator: 'owner_admins'
};

/** Application role mappings: none defined in the screenshot (empty state). */
export const roleMappings = [];

export const roleMappingColumns = [
  { id: 'type', accessorKey: 'type', header: 'Type', meta: { width: '8rem' } },
  { id: 'roles', accessorKey: 'roles', header: 'Roles', meta: { width: 'minmax(10rem, 1fr)' } },
  { id: 'checks', accessorKey: 'checks', header: 'Checks', meta: { width: 'minmax(10rem, 1fr)' } },
  { id: 'append', accessorKey: 'append', header: 'Append members', meta: { width: '11.5rem' } },
  {
    id: 'actions',
    meta: { actions: true },
    cell: () => html`
      <sl-menu>
        <sl-menu-item value="edit"><sl-icon slot="prefix" name="pencil"></sl-icon>Edit</sl-menu-item>
        <sl-menu-item value="remove"><sl-icon slot="prefix" name="trash"></sl-icon>Remove</sl-menu-item>
      </sl-menu>
    `
  }
];
