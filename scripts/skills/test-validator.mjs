//
// Self-test of skills/saipem-ds/scripts/ds.mjs: every typical hallucination must be caught, and correct markup must
// pass clean. Run with `npm run skills:test` (after `npm run skills:build`).
//
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const ds = path.resolve('skills/saipem-ds/scripts/ds.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-validator-'));

/** `expect`: regexes that must match an ERR/WARN message. `clean`: no ERR and no WARN allowed. */
const cases = [
  {
    name: 'unknown component',
    src: '<sl-datepicker label="Due"></sl-datepicker>',
    expect: [/ERR.*sl-datepicker> does not exist/]
  },
  { name: 'Web Awesome tag', src: '<wa-button>Save</wa-button>', expect: [/ERR.*Web Awesome/] },
  {
    name: 'invented variant',
    src: '<sl-button variant="secondary">Save</sl-button>',
    expect: [/ERR.*variant="secondary".*allowed/]
  },
  {
    name: 'upstream-only size',
    src: '<sl-icon-button name="x-lg" size="medium" label="Close"></sl-icon-button>',
    expect: [/ERR.*size="medium"/]
  },
  { name: 'status variant', src: '<sl-status variant="info">Open</sl-status>', expect: [/ERR.*variant="info"/] },
  {
    name: 'dialog variant',
    src: '<sl-dialog label="Done" variant="primary"></sl-dialog>',
    expect: [/ERR.*variant="primary"/]
  },
  {
    name: 'boolean false',
    src: '<sl-button disabled="false">Save</sl-button>',
    expect: [/ERR.*boolean.*"false" means true/]
  },
  {
    name: 'invented attribute',
    src: '<sl-input label="Name" helper="Max 20"></sl-input>',
    expect: [/ERR.*no attribute "helper"/]
  },
  {
    name: 'camelCase attribute',
    src: '<sl-input label="Name" helpText="Max 20"></sl-input>',
    expect: [/ERR.*"helpText" should be written "help-text"/]
  },
  {
    name: 'property as attribute',
    src: '<sl-table data="rows"></sl-table>',
    expect: [/ERR.*"data" is a property without an attribute/]
  },
  {
    name: 'wrong slot',
    src: '<sl-card><div slot="actions">x</div></sl-card>',
    expect: [/ERR.*sl-card> has no slot "actions"/]
  },
  { name: 'unknown icon', src: '<sl-icon name="trash-can"></sl-icon>', expect: [/ERR.*icon "trash-can"/] },
  {
    name: 'invented token',
    src: '<div style="color: var(--sl-color-primary)">x</div>',
    expect: [/ERR.*--sl-color-primary does not exist/]
  },
  { name: 'hex colour', src: '<style>.x { color: #0e6a81; }</style>', expect: [/ERR.*hard-coded colour/] },
  {
    name: 'primitive colour',
    src: '<style>.x { color: var(--sl-color-teal-600); }</style>',
    expect: [/WARN.*primitive palette/]
  },
  {
    name: 'part override',
    src: '<style>sl-button::part(base) { border-radius: 0; }</style>',
    expect: [/WARN.*::part/]
  },
  { name: 'native button', src: '<button type="button">Save</button>', expect: [/ERR.*native <button>/] },
  { name: 'native checkbox', src: '<input type="checkbox">', expect: [/ERR.*sl-checkbox/] },
  {
    name: 'orphan option',
    src: '<div><sl-option value="a">A</sl-option></div>',
    expect: [/WARN.*sl-option> works only inside/]
  },
  {
    name: 'two primaries',
    src: '<sl-button variant="primary">A</sl-button><sl-button variant="primary">B</sl-button>',
    expect: [/WARN.*2 primary/]
  },
  {
    name: 'Angular binding mistakes',
    ext: '.ts',
    src: `import { Component } from '@angular/core';
@Component({
  selector: 'app-x',
  template: \`
    <sl-button disabled="{{ busy }}">Save</sl-button>
    <sl-input [help-text]="hint" (change)="onChange($event)"></sl-input>
    <sl-switch [(checked)]="on"></sl-switch>
    <sl-table [data]="rows" (sl-selection-change)="onSelect($event)"></sl-table>
  \`
})
export class XComponent {}`,
    expect: [
      /ERR.*CUSTOM_ELEMENTS_SCHEMA/,
      /ERR.*interpolation turns the boolean/,
      /ERR.*\[help-text\].*helpText/,
      /WARN.*native "change".*sl-change/,
      /ERR.*\[\(checked\)\]/,
      /ERR.*does not emit "sl-selection-change".*sl-table-selection-change/
    ]
  },
  {
    name: 'correct Angular component',
    ext: '.ts',
    clean: true,
    src: `import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/status/status.js';
import '@shoelace-style/shoelace/dist/components/empty-state/empty-state.js';

@Component({
  selector: 'app-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <sl-card>
      <div slot="header">Filters</div>
      <sl-input label="Search" type="search" size="small" clearable [value]="term()" (sl-input)="onInput($event)"></sl-input>
      <sl-status variant="success" size="small" filled>Distributed</sl-status>
      <sl-empty-state title-text="No documents" description="Change the filters to see more results."></sl-empty-state>
      <div slot="footer">
        <sl-button variant="text" [disabled]="!term()">Reset</sl-button>
        <sl-button variant="primary"><sl-icon slot="prefix" name="search"></sl-icon>Search</sl-button>
      </div>
    </sl-card>
  \`,
  styles: \`
    :host { display: block; padding: var(--sl-spacing-large); background: var(--sl-surface-panel); }
  \`
})
export class SearchComponent {
  readonly term = signal('');
  onInput(event: Event) {
    this.term.set((event.target as HTMLInputElement).value);
  }
}`
  },
  {
    name: 'correct Lit template',
    ext: '.js',
    clean: true,
    src: `import { html } from 'lit';
export const view = (rows, columns, busy) => html\`
  <sl-table label="Documents" selection="multiple" .data=\${rows} .columns=\${columns} @sl-table-selection-change=\${e => e}>
    <sl-button slot="toolbar" size="small" ?disabled=\${busy}>Export</sl-button>
    <sl-empty-state slot="empty" title-text="No documents"></sl-empty-state>
  </sl-table>
\`;`
  }
];

let failures = 0;
for (const [index, testCase] of cases.entries()) {
  const file = path.join(tmp, `case-${index}${testCase.ext || '.html'}`);
  fs.writeFileSync(file, testCase.src);
  let output;
  try {
    output = execFileSync('node', [ds, 'validate', file, '--json'], { encoding: 'utf8' });
  } catch (err) {
    output = err.stdout;
  }
  const { results } = JSON.parse(output);
  const lines = results.filter(r => r.level !== 'INFO').map(r => `${r.level} ${r.message}`);
  const problems = [];
  for (const re of testCase.expect || []) if (!lines.some(l => re.test(l))) problems.push(`missing ${re}`);
  if (testCase.clean && lines.length) problems.push(...lines.map(l => `unexpected: ${l}`));
  if (problems.length) {
    failures++;
    console.log(`✗ ${testCase.name}\n    ${problems.join('\n    ')}\n    got: ${lines.join(' | ') || '(nothing)'}`);
  } else {
    console.log(`✓ ${testCase.name}`);
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${cases.length - failures}/${cases.length} passed`);
process.exitCode = failures ? 1 : 0;
