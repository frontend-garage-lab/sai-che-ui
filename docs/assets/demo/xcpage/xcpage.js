/*
 * xCPage review demo.
 *
 * A clickable recreation of the xCPage "Review" flow (Figma: xCPage — rebuilt with Saipem DS) that uses only
 * sai-che-ui web components. Data is mocked in memory; uploads are simulated.
 *
 * Flow: select a task → Take task → Import comment (upload files) → Finish → Complete review task.
 */

import { html } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

const $ = selector => document.querySelector(selector);

const ME = { name: 'Aiello Ciro', initials: 'AC', color: 'primary' };
const TODAY = new Date();
const DAY = 24 * 60 * 60 * 1000;

const tasks = [
  task(1, 'test Foxit_no signature', 'test Foxit_no signature_qrcode', 'Test_DM_27091449_2', 'A1', '2026-02-20', '2026-06-25', '—', 'VDR-20240415'),
  task(2, 'test Foxit_no signature', 'test Foxit_no signature_qrcode', 'Test_DM_27091449_3', 'A1', '2026-02-20', '2026-06-25', '—', 'VDR-20240415'),
  task(3, 'A_TEST 3 INT JOBDOC', 'A_TEST 3 INT JOBDOC VITO_0', 'TEST 3 INT JOBDOC VITO', 'C', '2022-03-15', '2022-07-28', '—', '—', true),
  task(4, 'TEST_AAPC-A2', '989', 'Test9-QRCodeFix-50uly', 'A2', '2021-03-28', '2021-04-21', '—', '—', true),
  task(5, '08-a2', '8', 'Test-PVA-11-09-2020_2', 'a2', '2021-03-28', '2021-04-21', '—', '—', true),
  task(6, '00001-ASDS', '1', 'ASDSHKASDJH', 'ASDS', '2020-10-16', '2020-12-31', 'CIVIL & ARCHITECTURE', '—', true),
  task(7, 'H10-RC-B-21213', 'Piping layout – area 10', 'H10-RC-B-21213_A1', 'A1', '2025-11-03', '2026-01-15', 'TUB-PLANT LAYOUT & PIPING', 'VDR-20240415'),
  task(8, 'H10-RD-A-87165', 'Pump datasheet', 'H10-RD-A-87165_A2', 'A2', '2025-09-12', '2025-12-01', 'MECHANICAL', 'VDR-20240512'),
  task(9, 'R1118111-SARC01', 'Structural arrangement', 'R1118111-SARC01-A', 'A', '2025-06-30', '2025-09-30', 'CIVIL & ARCHITECTURE', 'VDR-20240512'),
  task(10, 'AA-A1-310407', 'Electrical single line diagram', 'AA-A1-310407', 'B', '2025-05-02', '2025-08-14', 'ELECTRICAL', 'VDR-20240415'),
  task(11, '032309-1536608-ME-D-30122', 'PUMP GAD FOR CLOSED LOOP COOLING WATER PUMP 1_2', 'test_review_doc_00090001', 'R00', '2025-04-10', '2025-07-20', 'TUB-PLANT LAYOUT & PIPING', 'VDR-20240415')
];

const SAMPLE_FILES = [
  ['R1118111-SARC01-A.pdf', 2.4],
  ['AA-A1-310407.pdf', 1.1],
  ['H10-RC-B-21213_A1_R.pdf', 3.2],
  ['H10-RD-A-87165_A2_A.pdf', 1.8],
  ['H10-RC-B-21214_A1_I.pdf', 2.7, true] // fails once, so the Retry state can be shown
];

let selectedId = tasks[0].id;
let uploads = [];
let uploadSeq = 0;

function task(id, title, ref1, ref2, rev, created, due, discipline, originator, taken = false) {
  return {
    id: String(id),
    title,
    ref1,
    ref2,
    rev,
    created,
    due,
    discipline,
    originator,
    taken,
    notified: false,
    comments: [],
    lastOperation: taken ? '2026-10-02T13:16:00' : null
  };
}

//
// Helpers
//

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => `&#${ch.charCodeAt(0)};`);
}

function formatDate(iso, withTime = false) {
  const date = new Date(iso);
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  if (!withTime) return day;
  return `${day} ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

function expiryOf(t) {
  const due = new Date(t.due).getTime();
  if (t.notified) return 'notified';
  if (due < TODAY.getTime()) return 'expired';
  if (due - TODAY.getTime() < 14 * DAY) return 'expiring';
  return 'safe';
}

const EXPIRY_VARIANT = { safe: 'success', expiring: 'warning', expired: 'danger', notified: 'primary' };
function selectedTask() {
  return tasks.find(t => t.id === selectedId) ?? null;
}

function docName(t) {
  return `${t.title}_qrcode_2Copy.pdf`;
}

async function notify(variant, icon, title, message = '') {
  await customElements.whenDefined('sl-alert');
  const alert = Object.assign(document.createElement('sl-alert'), { variant, closable: true, duration: 5000 });
  alert.innerHTML = `
    <sl-icon slot="icon" name="${icon}"></sl-icon>
    <strong>${esc(title)}</strong>${message ? `<br />${esc(message)}` : ''}
  `;
  document.body.append(alert);
  return alert.toast();
}

function avatar(person, slot = '') {
  return `<sl-avatar ${slot ? `slot="${slot}"` : ''} initials="${esc(person.initials)}" label="${esc(person.name)}" class="avatar--${person.color}"></sl-avatar>`;
}

function avatarTemplate(person) {
  return html`<sl-avatar initials=${person.initials} label=${person.name} class="avatar--${person.color}"></sl-avatar>`;
}

function descriptionList(pairs, cols = 2) {
  return `
    <sl-description-list cols="${cols}">
      ${pairs.map(([label, value]) => `<sl-description-list-item label="${esc(label)}">${value}</sl-description-list-item>`).join('')}
    </sl-description-list>
  `;
}

//
// Task list
//

function matchesText(t) {
  const raw = $('#filter-text').value.trim();
  if (!raw) return true;
  const caseSensitive = $('#filter-case').checked;
  const terms = $('#filter-multiple').checked ? raw.split(',').map(s => s.trim()).filter(Boolean) : [raw];
  const haystack = [t.title, t.ref1, t.ref2, t.originator].join(' ');
  const hay = caseSensitive ? haystack : haystack.toLowerCase();
  return terms.some(term => hay.includes(caseSensitive ? term : term.toLowerCase()));
}

function visibleTasks() {
  const originator = $('#filter-originator').value;
  const discipline = $('#filter-discipline').value;
  const expiry = $('#expiry').value;
  return tasks.filter(
    t =>
      matchesText(t) &&
      (originator === 'all' || t.originator === originator) &&
      (discipline === 'all' || t.discipline === discipline) &&
      (!expiry || expiryOf(t) === expiry)
  );
}

// Column definitions are built once and kept stable, since sl-table relies on the reference for memoization.
const TASKS_COLUMNS = [
  {
    id: 'status',
    header: '',
    meta: { width: '10rem' },
    cell: ({ row }) => {
      const t = row.original;
      const expiry = expiryOf(t);
      return html`
        <div class="task__status" style="display: flex; align-items: center; gap: var(--sl-spacing-x-small);">
          <sl-status variant=${EXPIRY_VARIANT[expiry]} size="small" pulse title=${expiry}></sl-status>
          <sl-badge pill variant=${t.taken ? 'success' : 'danger'}>${t.taken ? 'Approver' : 'Reject'}</sl-badge>
          ${t.comments.length
            ? html`<sl-icon-button
                name="file-earmark-pdf"
                label="Comment uploaded"
                variant="danger"
                style="scale: 0.75;"
              ></sl-icon-button>`
            : ''}
        </div>
      `;
    }
  },
  {
    id: 'task',
    header: 'Task',
    enableSorting: true,
    accessorFn: row => row.title,
    cell: ({ row }) => {
      const t = row.original;
      return html`
        <div class="task">
          <div class="task__text">
            <span class="task__title">${t.title}</span>
            <span class="task__ref">${t.ref1}</span>
            <span class="task__ref">${t.ref2}</span>
          </div>
        </div>
      `;
    }
  },
  {
    id: 'rev',
    header: 'Rev.',
    meta: { width: '5rem' },
    cell: ({ row }) => html`<sl-tag size="small" variant="neutral">${row.original.rev}</sl-tag>`
  },
  {
    id: 'created',
    header: 'Created',
    enableSorting: true,
    accessorFn: row => row.created,
    meta: { width: '8rem', nowrap: true },
    cell: ({ row }) => formatDate(row.original.created)
  },
  {
    id: 'due',
    header: 'Due date',
    enableSorting: true,
    accessorFn: row => row.due,
    meta: { width: '8rem', nowrap: true },
    cell: ({ row }) => {
      const t = row.original;
      const expiry = expiryOf(t);
      return html`<span class=${expiry === 'expired' ? 'is-overdue' : ''}>${formatDate(t.due)}</span>`;
    }
  },
  { id: 'discipline', accessorKey: 'discipline', header: 'Discipline', meta: { width: '9rem' } },
  { id: 'originator', accessorKey: 'originator', header: 'Originator', meta: { width: '9rem' } }
];

const COMPLETE_COLUMNS = [
  {
    id: 'document',
    header: 'Document',
    cell: ({ row }) => html`
      <span class="doc"><sl-icon name="file-earmark-pdf"></sl-icon><span class="doc__name">${row.original.title}</span></span>
    `
  },
  {
    id: 'date',
    header: 'Comment date',
    meta: { width: '11rem', nowrap: true },
    cell: ({ row }) => formatDate(row.original.comments.at(-1).date, true)
  }
];

function setupTables() {
  const tasksTable = $('#tasks');
  tasksTable.columns = TASKS_COLUMNS;
  tasksTable.getRowId = row => row.id;

  const completeTable = $('#complete-table');
  completeTable.columns = COMPLETE_COLUMNS;
  completeTable.getRowId = row => row.id;
  completeTable.rowVariant = () => 'success';
}

function renderTable() {
  const table = $('#tasks');
  const rows = visibleTasks();
  if (selectedId && !rows.some(t => t.id === selectedId)) selectedId = null;

  table.data = rows;
  table.setSelection(selectedId ? rows.filter(t => t.id === selectedId) : []);

  $('#task-count').textContent = rows.length;
  $('#count-review').textContent = tasks.length;

  for (const stat of document.querySelectorAll('#expiry sl-stat')) {
    stat.count = tasks.filter(t => expiryOf(t) === stat.value).length;
  }
}

function renderToolbar() {
  const t = selectedTask();
  $('#act-download').disabled = !t;
  $('#act-take').disabled = !t || t.taken;
  $('#act-import').disabled = !t || !t.taken;
  $('#act-release').disabled = !t || !t.taken || t.comments.length > 0;
  $('#act-complete').disabled = !t || t.comments.length === 0;
}

function populateFilterOptions() {
  const fill = (select, values) => {
    select.insertAdjacentHTML(
      'beforeend',
      [...new Set(values)]
        .filter(v => v !== '—')
        .sort()
        .map(v => `<sl-option value="${esc(v)}">${esc(v)}</sl-option>`)
        .join('')
    );
  };
  fill($('#filter-originator'), tasks.map(t => t.originator));
  fill($('#filter-discipline'), tasks.map(t => t.discipline));
}

//
// Details panel
//

function reviewersOf(t) {
  return [
    { ...ME, taken: t.taken, last: t.lastOperation },
    { name: 'Cazzaniga Alice', initials: 'CA', color: 'accent', taken: false, last: null },
    { name: 'page_wsuser', initials: 'PW', color: 'neutral', taken: false, last: null }
  ];
}

function commentsTemplate(t) {
  const importButton = `
    <sl-button slot="action" variant="primary" class="js-import" ${t.taken ? '' : 'disabled'}>
      <sl-icon slot="prefix" name="upload"></sl-icon>
      Import comment
    </sl-button>
  `;

  if (t.comments.length === 0) {
    return `
      <sl-empty-state
        title-text="No results found"
        description="${t.taken ? 'Review comments for the selected task will appear here.' : 'Take the task to import your review comments.'}"
      >
        <sl-icon slot="icon" name="inbox"></sl-icon>
        ${importButton}
      </sl-empty-state>
    `;
  }

  return `
    <div class="stack">
      ${t.comments
        .map(
          c => `
          <sl-comment author="${esc(ME.name)}" date="${esc(formatDate(c.date, true))}">
            ${avatar(ME, 'avatar')}
            ${esc(c.text)} · ${c.files.length} file${c.files.length === 1 ? '' : 's'}
            <sl-tooltip slot="attachment" content="${esc(c.files.join(', '))}">
              <sl-icon-button name="file-earmark-pdf" label="Open attachment" class="is-pdf"></sl-icon-button>
            </sl-tooltip>
          </sl-comment>
        `
        )
        .join('')}
    </div>
  `;
}

function dashboardTemplate(t) {
  const table = document.createElement('sl-table');
  table.label = 'Reviewers';
  table.columns = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => html`
        <span class="person">${avatarTemplate(row.original)}
          <span class=${row.original.taken ? 'task__title' : ''}>${row.original.name}</span></span
        >
      `
    },
    {
      id: 'status',
      header: 'Task status',
      meta: { width: '6rem', align: 'center' },
      cell: ({ row }) => html`
        <sl-icon name=${row.original.taken ? 'check-square' : 'square'} class=${row.original.taken ? 'is-taken' : ''}></sl-icon>
      `
    },
    {
      id: 'last',
      header: 'Last operation',
      meta: { width: '10rem', nowrap: true },
      cell: ({ row }) => (row.original.last ? formatDate(row.original.last, true) : '—')
    }
  ];
  table.data = reviewersOf(t);
  return table;
}

function revisionsTemplate(t) {
  const table = document.createElement('sl-table');
  table.label = 'Revisions';
  table.columns = [
    {
      id: 'document',
      header: 'Document',
      cell: ({ row }) => html`
        <div class="doc">
          <sl-icon name="file-earmark-pdf"></sl-icon>
          <div>
            <div class="doc__name">${docName(row.original)}</div>
            <div class="muted">${row.original.ref1}.pdf_sp_0001 · ${row.original.ref2}</div>
          </div>
        </div>
      `
    },
    {
      id: 'revision',
      header: 'Revision',
      meta: { width: '6rem' },
      cell: ({ row }) => html`<sl-tag size="small" variant="neutral">${row.original.rev}</sl-tag>`
    },
    { id: 'answer', header: 'Client answer', meta: { width: '7rem' }, cell: () => '—' }
  ];
  table.data = [t];
  return table;
}

function propertiesTemplate(t) {
  const expired = expiryOf(t) === 'expired';
  return `
    <div class="stack props">
      <sl-card>
        <h3 slot="header" class="section-title">Document info</h3>
        <div class="doc">
          <sl-icon name="file-earmark-pdf"></sl-icon>
          <div>
            <div class="doc__name">${esc(docName(t))}</div>
            <div class="muted">${esc(t.ref1)}.pdf_sp_0001 · ${esc(t.ref2)}</div>
          </div>
        </div>
        ${descriptionList([
          ['Revision Code', esc(t.rev)],
          ['Discipline', esc(t.discipline)],
          ['Originator', esc(t.originator)],
          ['Document Class', 'External Job Document']
        ])}
      </sl-card>

      <sl-card>
        <h3 slot="header" class="section-title">Task info</h3>
        ${descriptionList([
          ['Lead Reviewer', 'Boffelli Anselmo'],
          ['DP Name', 'test_notify_rdp_2602183626'],
          ['Created on', formatDate(t.created)],
          [
            'Expires on',
            `${formatDate(t.due)} ${t.taken ? '<sl-tag size="small" variant="warning">Acquired</sl-tag>' : ''}
             ${expired ? '<sl-tag size="small" variant="danger">Expired</sl-tag>' : ''}`
          ]
        ])}
      </sl-card>

      <sl-card>
        <h3 slot="header" class="section-title">Review status</h3>
        <div class="status-line">
          ${
            t.comments.length
              ? '<span class="is-success"><sl-icon name="check2-circle"></sl-icon> Comment is ready to be published</span>'
              : '<span class="muted"><sl-icon name="hourglass-split"></sl-icon> No comment uploaded yet</span>'
          }
          <span class="muted"><sl-icon name="info-circle"></sl-icon> Task has not been notified</span>
        </div>
      </sl-card>

      <sl-button size="small" class="js-all-properties">
        <sl-icon slot="prefix" name="box-arrow-up-right"></sl-icon>
        All properties
      </sl-button>
    </div>
  `;
}

function renderDetails() {
  const t = selectedTask();
  $('#details').hidden = !t;
  $('#details-empty').hidden = Boolean(t);
  if (!t) return;

  $('#details-meta').textContent = `${t.title} · Rev. ${t.rev}`;
  $('#panel-comments').innerHTML = commentsTemplate(t);
  $('#panel-dashboard').replaceChildren(dashboardTemplate(t));
  $('#panel-revisions').replaceChildren(revisionsTemplate(t));
  $('#panel-properties').innerHTML = propertiesTemplate(t);
}

function render() {
  renderTable();
  renderToolbar();
  renderDetails();
}

//
// Import comment (simulated uploads)
//

function uploadTemplate(u) {
  const state = u.status === 'done' ? 'uploaded' : u.status;
  const meta = {
    waiting: 'Waiting…',
    uploading: `${Math.round(u.progress)}% · Uploading`,
    uploaded: `<sl-format-bytes value="${u.size}"></sl-format-bytes> · Uploaded`,
    failed: 'Upload failed · Connection lost'
  }[state];

  return `
    <sl-file-upload-item data-id="${u.id}" state="${state}" filename="${esc(u.name)}" progress="${u.progress}">
      <span slot="meta">${meta}</span>
    </sl-file-upload-item>
  `;
}

function renderUploads() {
  $('#upload-list').innerHTML = uploads.map(uploadTemplate).join('');
  updateUploadSummary();
}

function updateUploadSummary() {
  const done = uploads.filter(u => u.status === 'done').length;
  const failed = uploads.filter(u => u.status === 'failed').length;
  $('#upload-summary').textContent = uploads.length
    ? `${done} of ${uploads.length} uploaded${failed ? ` · ${failed} failed` : ''}`
    : 'No files added';
  $('#import-finish').disabled = uploads.length === 0 || done !== uploads.length;
}

function addFiles(files) {
  for (const { name, size, failOnce } of files) {
    if (uploads.some(u => u.name === name)) continue;
    uploads.push({ id: String(++uploadSeq), name, size, failOnce: Boolean(failOnce), status: 'waiting', progress: 0 });
  }
  renderUploads();
  pumpUploads();
}

function pumpUploads() {
  const active = uploads.filter(u => u.status === 'uploading').length;
  uploads
    .filter(u => u.status === 'waiting')
    .slice(0, Math.max(0, 2 - active))
    .forEach(startUpload);
}

function startUpload(u) {
  u.status = 'uploading';
  u.progress = 0;
  renderUploads();

  u.timer = setInterval(() => {
    u.progress = Math.min(100, u.progress + 6 + Math.random() * 10);

    if (u.failOnce && u.progress > 45) {
      u.failOnce = false;
      finishUpload(u, 'failed');
      return;
    }
    if (u.progress >= 100) {
      finishUpload(u, 'done');
      return;
    }

    const item = document.querySelector(`sl-file-upload-item[data-id="${u.id}"]`);
    if (item) {
      item.progress = u.progress;
      item.querySelector('[slot="meta"]').textContent = `${Math.round(u.progress)}% · Uploading`;
    }
  }, 180);
}

function finishUpload(u, status) {
  clearInterval(u.timer);
  u.status = status;
  renderUploads();
  pumpUploads();
}

function resetUploads() {
  uploads.forEach(u => clearInterval(u.timer));
  uploads = [];
  renderUploads();
}

//
// Dialogs
//

function openImport() {
  resetUploads();
  $('#import-dialog').show();
}

function finishImport() {
  const t = selectedTask();
  if (!t) return;
  t.comments.push({ date: new Date().toISOString(), text: 'Submitted for Lead reviewer', files: uploads.map(u => u.name) });
  t.lastOperation = new Date().toISOString();
  $('#import-dialog').hide();
  resetUploads();
  render();
  $('#detail-tabs').show('comments');
  notify('success', 'check2-circle', 'Comment uploaded', 'The review comment has been successfully uploaded.');
}

function openComplete() {
  const ready = tasks.filter(t => t.comments.length > 0);
  const table = $('#complete-table');
  table.data = ready;
  $('#complete-count').textContent = ready.length;
  $('#complete-dialog').show();
}

function confirmComplete() {
  const done = tasks.filter(t => t.comments.length > 0);
  for (const t of done) tasks.splice(tasks.indexOf(t), 1);
  selectedId = visibleTasks()[0]?.id ?? null;
  $('#complete-dialog').hide();
  render();
  notify('success', 'check2-all', 'Review completed', `${done.length} task${done.length === 1 ? '' : 's'} closed.`);
}

function openAllProperties() {
  const t = selectedTask();
  if (!t) return;
  $('#properties-dialog-body').innerHTML = `
    <div class="properties-dialog">
      <div class="doc">
        <sl-icon name="file-earmark-pdf"></sl-icon>
        <div>
          <div class="doc__name">${esc(t.title)} - ${esc(t.ref1)}</div>
          <div class="muted">DIN ${esc(t.ref2)}</div>
        </div>
      </div>
      ${descriptionList(
        [
          ['Revision Code', esc(t.rev)],
          ['Second Revision Code', '—'],
          ['Title', esc(t.ref1)],
          ['Client Answer', '—'],
          ['Issuing Description', 'B - SUBMIT WITH PROPOSAL'],
          ['Revision Status', 'Current']
        ],
        3
      )}
      <sl-tab-group>
        <sl-tab slot="nav" panel="info" active>Info</sl-tab>
        <sl-tab slot="nav" panel="job">Job Document</sl-tab>
        <sl-tab slot="nav" panel="contents">Contents</sl-tab>
        <sl-tab slot="nav" panel="comments">Comments</sl-tab>
        <sl-tab slot="nav" panel="review">Review</sl-tab>
        <sl-tab-panel name="info">
          ${descriptionList(
            [
              ['Client Document Identification', esc(t.ref2)],
              ['Vendor Document Identification', esc(t.ref2)],
              ['Document Type', 'External Job Document'],
              ['Second Issuing Description', 'test_review_doc_0001'],
              ['Superseded By', '—'],
              ['Document Status', 'Received'],
              ['Project Code', '99_PAGE_AM'],
              ['Company Project Code', '123456789'],
              ['Managing Department - Discipline', esc(t.discipline)]
            ],
            3
          )}
        </sl-tab-panel>
        ${['job', 'contents', 'comments', 'review']
          .map(
            name => `
            <sl-tab-panel name="${name}">
              <sl-empty-state title-text="Nothing to show" description="This section has no data for the selected document.">
                <sl-icon slot="icon" name="inbox"></sl-icon>
              </sl-empty-state>
            </sl-tab-panel>
          `
          )
          .join('')}
      </sl-tab-group>
    </div>
  `;
  $('#properties-dialog').show();
}

//
// Wiring
//

function wire() {
  // Selection
  $('#tasks').addEventListener('sl-table-selection-change', event => {
    selectedId = event.detail.selection[0]?.id ?? null;
    renderToolbar();
    renderDetails();
  });

  $('#details').addEventListener('sl-request-close', () => {
    selectedId = null;
    render();
  });

  // Filters
  $('#filters').addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  $('#filter-reset').addEventListener('click', () => {
    $('#filter-text').value = '';
    $('#filter-originator').value = 'all';
    $('#filter-discipline').value = 'all';
    $('#filter-multiple').checked = false;
    $('#filter-case').checked = true;
    $('#expiry').value = '';
    render();
  });
  $('#filter-text').addEventListener('sl-clear', () => render());
  for (const id of ['#filter-originator', '#filter-discipline', '#expiry']) {
    $(id).addEventListener('sl-change', () => render());
  }

  // Toolbar
  $('#act-download').addEventListener('click', () => {
    const t = selectedTask();
    notify('primary', 'download', 'Download started', docName(t));
  });
  $('#act-take').addEventListener('click', () => {
    const t = selectedTask();
    t.taken = true;
    t.lastOperation = new Date().toISOString();
    render();
    notify('success', 'check2-circle', 'Success.', `You took “${t.title}”. You can now import your review comments.`);
  });
  $('#act-release').addEventListener('click', () => {
    const t = selectedTask();
    t.taken = false;
    render();
    notify('neutral', 'arrow-counterclockwise', 'Task released', t.title);
  });
  $('#act-refresh').addEventListener('click', () => {
    render();
    notify('neutral', 'arrow-clockwise', 'List refreshed');
  });
  $('#act-import').addEventListener('click', openImport);
  $('#act-complete').addEventListener('click', openComplete);

  // Delegated actions inside rendered content
  document.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.js-import')) openImport();
    if (target.closest('.js-all-properties')) openAllProperties();
    if (target.closest('[data-close]')) target.closest('sl-dialog').hide();
  });

  $('#upload-list').addEventListener('sl-retry', event => {
    const u = uploads.find(x => x.name === event.target.filename);
    if (!u) return;
    u.status = 'waiting';
    renderUploads();
    pumpUploads();
  });

  $('#upload-list').addEventListener('sl-remove', event => {
    const u = uploads.find(x => x.name === event.target.filename);
    if (!u) return;
    clearInterval(u.timer);
    uploads = uploads.filter(x => x !== u);
    renderUploads();
    pumpUploads();
  });

  // Import dialog
  const fileDrop = $('#file-drop');
  fileDrop.addEventListener('sl-change', () => {
    addFiles(fileDrop.files.map(file => ({ name: file.name, size: file.size })));
    fileDrop.files = [];
  });
  $('#sample-files').addEventListener('click', () => {
    addFiles(SAMPLE_FILES.map(([name, mb, failOnce]) => ({ name, size: Math.round(mb * 1024 * 1024), failOnce })));
  });
  $('#import-finish').addEventListener('click', finishImport);
  $('#import-dialog').addEventListener('sl-after-hide', event => {
    if (event.target.id === 'import-dialog') resetUploads();
  });

  // Complete dialog
  $('#complete-confirm').addEventListener('click', confirmComplete);
}

await Promise.all(['sl-table', 'sl-select', 'sl-stat-group', 'sl-dialog', 'sl-file-drop'].map(tag => customElements.whenDefined(tag)));
setupTables();
populateFilterOptions();
wire();
render();
