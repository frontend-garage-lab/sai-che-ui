#!/usr/bin/env node
//
// Saipem DS helper for AI agents and humans. No dependencies, Node 18+.
//
//   node ds.mjs validate <file|dir>... [--json] [--strict]   check markup against the real DS API
//   node ds.mjs api <tag>                                     print the API of a component
//   node ds.mjs icons <word>...                               search icon names
//   node ds.mjs tokens <word>...                              search design tokens
//
// `validate` reads .html/.htm, .ts/.js/.mjs (Angular `template:` and Lit html`` templates, `styles`), .css/.scss and
// .md (```html and ```ts blocks). It exits with 1 when it finds errors (or warnings, with --strict).
//
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DS = JSON.parse(fs.readFileSync(path.join(here, 'ds-api.json'), 'utf8'));
const PREFIX = DS.prefix;
const TOKENS = new Set(DS.tokens);
const PRIMITIVE_TOKENS = new Set(DS.primitiveColorTokens);
const ICONS = new Set(DS.icons);
const ALL_EVENTS = new Set(Object.values(DS.elements).flatMap(e => e.events));
const ALL_CSS_PROPS = new Set(Object.values(DS.elements).flatMap(e => e.cssProps));

// ---------------------------------------------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------------------------------------------

const GLOBAL_ATTRS = new Set([
  'id',
  'class',
  'style',
  'slot',
  'title',
  'hidden',
  'tabindex',
  'role',
  'lang',
  'dir',
  'inert',
  'part',
  'exportparts',
  'autofocus',
  'draggable',
  'translate',
  'popover',
  'nonce',
  'accesskey',
  'contenteditable',
  'is',
  'key',
  'ref',
  'i18n'
]);

/** Native elements that have a DS equivalent. */
const NATIVE = {
  button: '<sl-button> or <sl-icon-button>',
  select: '<sl-select> with <sl-option>',
  textarea: '<sl-textarea>',
  dialog: '<sl-dialog>',
  table: '<sl-table>',
  details: '<sl-details>',
  progress: '<sl-progress-bar>',
  meter: '<sl-progress-bar>',
  hr: '<sl-divider>'
};
const NATIVE_INPUT = {
  checkbox: '<sl-checkbox>',
  radio: '<sl-radio-group> with <sl-radio>',
  range: '<sl-range>',
  color: '<sl-color-picker>',
  file: '<sl-file-drop>',
  default: '<sl-input>'
};

/** Children that only work inside a given DS parent. */
const REQUIRED_PARENT = {
  'sl-option': ['sl-select'],
  'sl-menu-item': ['sl-menu'],
  'sl-menu-label': ['sl-menu'],
  'sl-tab': ['sl-tab-group'],
  'sl-tab-panel': ['sl-tab-group'],
  'sl-radio': ['sl-radio-group'],
  'sl-radio-button': ['sl-radio-group'],
  'sl-step': ['sl-stepper'],
  'sl-sidebar-group': ['sl-sidebar'],
  'sl-sidebar-item': ['sl-sidebar-group', 'sl-sidebar'],
  'sl-description-list-item': ['sl-description-list'],
  'sl-breadcrumb-item': ['sl-breadcrumb'],
  'sl-tree-item': ['sl-tree', 'sl-tree-item'],
  'sl-carousel-item': ['sl-carousel'],
  'sl-header-item': ['sl-header']
};

/** Native events that have an `sl-` equivalent on form controls. */
const NATIVE_EVENT_HINT = { change: 'sl-change', input: 'sl-input', blur: 'sl-blur', focus: 'sl-focus' };

/** Directives and Angular attributes that are not part of the element's API. */
const KNOWN_DIRECTIVES = new Set([
  'ngModel',
  'ngModelOptions',
  'ngClass',
  'ngStyle',
  'ngIf',
  'ngFor',
  'ngForOf',
  'ngSwitch',
  'ngSwitchCase',
  'ngTemplateOutlet',
  'ngTemplateOutletContext',
  'formControl',
  'formControlName',
  'formGroup',
  'formGroupName',
  'formArrayName',
  'routerLink',
  'routerLinkActive',
  'routerLinkActiveOptions',
  'queryParams',
  'fragment'
]);

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr'
]);
const TRANSPARENT = new Set(['ng-container', 'ng-template', 'template', 'ng-content']);

// ---------------------------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------------------------

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

function suggest(word, candidates, max = 3) {
  const w = word.toLowerCase();
  return [...candidates]
    .map(c => ({
      c,
      d: distance(w, c.toLowerCase()) - (c.toLowerCase().includes(w) || w.includes(c.toLowerCase()) ? 2 : 0)
    }))
    .filter(x => x.d <= Math.max(2, Math.floor(w.length / 3)))
    .sort((a, b) => a.d - b.d)
    .slice(0, max)
    .map(x => x.c);
}

const didYouMean = (word, candidates) => {
  const s = suggest(word, candidates);
  return s.length ? ` Did you mean ${s.map(x => `"${x}"`).join(', ')}?` : '';
};

const kebabToCamel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const isDynamic = value => /\{\{|⟦/.test(value || '');

/** Replaces `${...}` interpolations with a marker of the same shape, so line numbers survive. */
function maskInterpolations(text) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$' && text[i + 1] === '{') {
      let depth = 0;
      let j = i + 1;
      for (; j < text.length; j++) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}' && --depth === 0) break;
      }
      const inner = text.slice(i, j + 1);
      out += '⟦' + inner.slice(1, -1).replace(/[^\n]/g, ' ') + '⟧';
      i = j;
    } else {
      out += text[i];
    }
  }
  return out;
}

/** Finds the end of a template literal that starts after `start` (the index right after the opening backtick). */
function templateEnd(src, start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === '\\') {
      i++;
      continue;
    }
    if (depth === 0 && ch === '`') return i;
    if (ch === '$' && src[i + 1] === '{') {
      depth++;
      i++;
    } else if (ch === '{' && depth > 0) depth++;
    else if (ch === '}' && depth > 0) depth--;
    else if (ch === '`' && depth > 0) {
      // Nested template literal inside an interpolation: skip it.
      const end = templateEnd(src, i + 1);
      i = end === -1 ? src.length : end;
    }
  }
  return -1;
}

const lineAt = (src, index) => src.slice(0, index).split('\n').length;

// ---------------------------------------------------------------------------------------------------------------
// HTML tokenizer (tolerant: Angular, Lit and plain HTML)
// ---------------------------------------------------------------------------------------------------------------

function parseMarkup(text) {
  const root = { tag: '#root', children: [], attrs: [], parent: null };
  const styles = [];
  let current = root;
  let i = 0;
  let line = 1;
  const advance = to => {
    for (; i < to; i++) if (text[i] === '\n') line++;
  };

  while (i < text.length) {
    if (text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i + 4);
      advance(end === -1 ? text.length : end + 3);
      continue;
    }
    if (text[i] === '<' && text[i + 1] === '/') {
      const m = /^<\/([a-zA-Z][\w:-]*)\s*>/.exec(text.slice(i, i + 200));
      if (m) {
        const tag = m[1].toLowerCase();
        let node = current;
        while (node && node.tag !== tag) node = node.parent;
        if (node && node.parent) current = node.parent;
        advance(i + m[0].length);
        continue;
      }
    }
    if (text[i] === '<' && /[a-zA-Z]/.test(text[i + 1] || '')) {
      const startLine = line;
      let j = i + 1;
      while (j < text.length && /[\w:-]/.test(text[j])) j++;
      const rawTag = text.slice(i + 1, j);
      const tag = rawTag.toLowerCase();
      const attrs = [];
      let selfClosing = false;
      // Attributes
      while (j < text.length) {
        while (j < text.length && /\s/.test(text[j])) {
          if (text[j] === '\n') line++;
          j++;
        }
        if (text[j] === '>') {
          j++;
          break;
        }
        if (text[j] === '/' && text[j + 1] === '>') {
          selfClosing = true;
          j += 2;
          break;
        }
        const nameStart = j;
        while (j < text.length && !/[\s=>]/.test(text[j]) && !(text[j] === '/' && text[j + 1] === '>')) j++;
        const name = text.slice(nameStart, j);
        const attrLine = line;
        let value = null;
        let k = j;
        while (k < text.length && /[ \t]/.test(text[k])) k++;
        if (text[k] === '=') {
          j = k + 1;
          while (j < text.length && /\s/.test(text[j])) {
            if (text[j] === '\n') line++;
            j++;
          }
          const q = text[j];
          if (q === '"' || q === "'") {
            const end = text.indexOf(q, j + 1);
            const stop = end === -1 ? text.length : end;
            value = text.slice(j + 1, stop);
            line += (value.match(/\n/g) || []).length;
            j = stop + 1;
          } else if (text[j] === '⟦') {
            // Unquoted Lit interpolation: attr=${value}
            const end = text.indexOf('⟧', j);
            const stop = end === -1 ? text.length : end + 1;
            value = text.slice(j, stop);
            line += (value.match(/\n/g) || []).length;
            j = stop;
          } else {
            const vs = j;
            while (j < text.length && !/[\s>]/.test(text[j])) j++;
            value = text.slice(vs, j);
          }
        }
        if (name) attrs.push({ name, value, line: attrLine });
        else j++;
      }
      i = j;
      const node = { tag, rawTag, attrs, line: startLine, children: [], parent: current };
      current.children.push(node);
      if (tag === 'style' || tag === 'script') {
        const close = text.toLowerCase().indexOf(`</${tag}`, i);
        const end = close === -1 ? text.length : close;
        if (tag === 'style') styles.push({ css: text.slice(i, end), line });
        advance(end);
        continue;
      }
      if (!selfClosing && !VOID.has(tag)) current = node;
      continue;
    }
    if (text[i] === '\n') line++;
    i++;
  }
  return { root, styles };
}

// ---------------------------------------------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------------------------------------------

function checkCss(css, baseLine, report, where = 'CSS') {
  const lines = css.split('\n');
  lines.forEach((text, idx) => {
    const line = baseLine + idx;
    const clean = text.replace(/\/\*.*?\*\//g, '');
    for (const m of clean.matchAll(/var\(\s*(--sl-[a-z0-9-]+)/g)) {
      const token = m[1];
      if (!TOKENS.has(token) && !ALL_CSS_PROPS.has(token)) {
        report('ERR', line, `${where}: token ${token} does not exist.${didYouMean(token, TOKENS)}`);
      } else if (PRIMITIVE_TOKENS.has(token)) {
        report(
          'WARN',
          line,
          `${where}: ${token} is a primitive palette colour: use a semantic token (primary, neutral, success…).`
        );
      }
    }
    const literal = clean.replace(/var\([^)]*\)/g, '').match(/#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(/);
    if (literal)
      report('ERR', line, `${where}: hard-coded colour "${literal[0]}": use a --sl-color-* or --sl-surface-* token.`);
    const spacing = clean.match(
      /\b(margin|padding|gap|row-gap|column-gap|inset|top|left|right|bottom)[a-z-]*\s*:\s*[^;]*\b\d*\.?\d+(px|rem)\b/
    );
    if (spacing && !/\b0(px|rem)\b/.test(spacing[0])) {
      report('WARN', line, `${where}: fixed spacing "${spacing[0].trim()}": use --sl-spacing-* tokens.`);
    }
    const font = clean.match(/\bfont-(size|weight|family)\s*:\s*(?!var\()[^;]+/);
    if (font) report('WARN', line, `${where}: "${font[0].trim()}": use the --sl-font-* tokens.`);
    if (/::part\(/.test(clean)) {
      report(
        'WARN',
        line,
        `${where}: ::part() override. Do not restyle DS components: a missing look is a missing variant.`
      );
    }
  });
}

function checkAttribute(node, def, attr, report, descendants) {
  const { name, value, line } = attr;
  const tag = node.tag;
  const attrNames = Object.keys(def.attrs);
  const propNames = new Set(def.props);
  for (const a of Object.values(def.attrs)) if (a.prop) propNames.add(a.prop);

  // Events: (event), on-event, @event (Lit/Vue)
  let ev = name.match(/^\(([^)]+)\)$/)?.[1] || name.match(/^on-(.+)$/)?.[1] || name.match(/^@(.+)$/)?.[1];
  if (ev && !name.startsWith('[')) {
    ev = ev.split('.')[0];
    if (ev.startsWith(PREFIX)) {
      if (def.events.includes(ev)) return;
      if (!ALL_EVENTS.has(ev)) {
        report(
          'ERR',
          line,
          `<${tag}> event "${ev}" does not exist.${didYouMean(ev, def.events.length ? def.events : ALL_EVENTS)}`
        );
      } else if (!descendants.some(d => DS.elements[d]?.events.includes(ev))) {
        const emitters = Object.keys(DS.elements).filter(t => DS.elements[t].events.includes(ev));
        report(
          'ERR',
          line,
          `<${tag}> does not emit "${ev}" (only ${emitters.map(t => `<${t}>`).join(', ')} do, and none is inside it).` +
            ` Its events: ${def.events.join(', ') || 'none'}.${didYouMean(ev, def.events)}`
        );
      }
    } else if (NATIVE_EVENT_HINT[ev] && def.events.includes(NATIVE_EVENT_HINT[ev])) {
      report(
        'WARN',
        line,
        `<${tag}> listens to native "${ev}": use "${NATIVE_EVENT_HINT[ev]}", the event the component documents.`
      );
    }
    return;
  }

  // Two-way binding
  const banana = name.match(/^\[\((.+)\)\]$/)?.[1];
  if (banana) {
    if (banana !== 'ngModel') {
      report(
        'ERR',
        line,
        `<${tag}> [(${banana})] does not work on DS components: bind [${banana}] and listen to the sl- event.`
      );
    }
    return;
  }

  // Property / attribute bindings
  const bound = name.match(/^\[([^\]]+)\]$/)?.[1] || name.match(/^bind-(.+)$/)?.[1] || name.match(/^[.:](.+)$/)?.[1];
  if (bound) {
    if (/^(class|style|ngClass|ngStyle)$/.test(bound) || /^(class|style)\./.test(bound)) return;
    if (bound.startsWith('attr.')) {
      const attrName = bound.slice(5);
      if (!def.attrs[attrName] && !GLOBAL_ATTRS.has(attrName) && !/^(aria|data)-/.test(attrName)) {
        report('ERR', line, `<${tag}> has no attribute "${attrName}".${didYouMean(attrName, attrNames)}`);
      }
      return;
    }
    if (name.startsWith(':') && !propNames.has(bound)) {
      // Vue: `:attr` binds an attribute or a property.
      if (!def.attrs[bound] && !GLOBAL_ATTRS.has(bound)) {
        report(
          'ERR',
          line,
          `<${tag}> has no attribute or property "${bound}".${didYouMean(bound, [...attrNames, ...propNames])}`
        );
      }
      return;
    }
    if (propNames.has(bound) || KNOWN_DIRECTIVES.has(bound) || GLOBAL_ATTRS.has(bound)) return;
    if (def.attrs[bound] && def.attrs[bound].prop && def.attrs[bound].prop !== bound) {
      report(
        'ERR',
        line,
        `<${tag}> [${bound}] binds a property that does not exist: the property is "${def.attrs[bound].prop}" ([${def.attrs[bound].prop}]="…").`
      );
      return;
    }
    const camel = kebabToCamel(bound);
    if (propNames.has(camel)) {
      report('ERR', line, `<${tag}> [${bound}]: the property is "${camel}".`);
      return;
    }
    const near = suggest(bound, propNames);
    if (near.length)
      report('ERR', line, `<${tag}> has no property "${bound}". Did you mean ${near.map(n => `"${n}"`).join(', ')}?`);
    else report('WARN', line, `<${tag}> has no property "${bound}" (fine only if it is an Angular directive input).`);
    return;
  }

  // Lit boolean attribute
  const litBool = name.match(/^\?(.+)$/)?.[1];
  if (litBool) {
    if (!def.attrs[litBool] && !GLOBAL_ATTRS.has(litBool)) {
      report('ERR', line, `<${tag}> has no attribute "${litBool}".${didYouMean(litBool, attrNames)}`);
    }
    return;
  }

  // Angular-only syntax that is not an API attribute
  if (/^[#*]/.test(name) || /^let-/.test(name) || /^i18n-/.test(name) || /^(aria|data)-/.test(name)) return;
  if (GLOBAL_ATTRS.has(name)) return;

  const a = def.attrs[name];
  if (!a) {
    const lower = name.toLowerCase();
    const kebab = name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    if (def.attrs[kebab] || def.attrs[lower]) {
      const right = def.attrs[kebab] ? kebab : lower;
      report(
        'ERR',
        line,
        `<${tag}> attribute "${name}" should be written "${right}" (HTML attributes are kebab-case).`
      );
    } else if (propNames.has(name)) {
      report(
        'ERR',
        line,
        `<${tag}> "${name}" is a property without an attribute: set it from code or with [${name}]="…".`
      );
    } else if (/[A-Z]/.test(name) || KNOWN_DIRECTIVES.has(name)) {
      // Probably an Angular directive (ngModel, formControlName, routerLink…).
    } else {
      report('ERR', line, `<${tag}> has no attribute "${name}".${didYouMean(name, attrNames)}`);
    }
    return;
  }

  if (value === null || isDynamic(value)) {
    if (isDynamic(value) && /\{\{/.test(value)) {
      if (a.boolean) {
        report(
          'ERR',
          line,
          `<${tag} ${name}="${value}">: interpolation turns the boolean into a string ("false" is truthy). Use [${a.prop || name}]="…".`
        );
      } else if (name.includes('-')) {
        report(
          'ERR',
          line,
          `<${tag} ${name}="{{…}}"> binds a property called "${name}" that does not exist. Use [${a.prop}]="…" or [attr.${name}]="…".`
        );
      }
    }
    return;
  }
  if (a.boolean) {
    if (value !== '' && value !== name) {
      report(
        'ERR',
        line,
        `<${tag} ${name}="${value}">: boolean attributes are on whenever present${value === 'false' ? ', so "false" means true' : ''}. Remove it or bind [${a.prop || name}].`
      );
    }
    return;
  }
  if (a.values && !a.open && !a.values.includes(value)) {
    report(
      'ERR',
      line,
      `<${tag} ${name}="${value}">: allowed values are ${a.values.map(v => `"${v}"`).join(', ')}.${didYouMean(value, a.values.filter(Boolean))}`
    );
  }
}

function validateMarkup(text, baseLine, report, ctx) {
  const { root, styles } = parseMarkup(text);
  const at = l => baseLine + l - 1;
  let primaryButtons = 0;

  const walk = (node, ancestors) => {
    for (const child of node.children) {
      const r = (level, line, msg) => report(level, at(line), msg);
      checkElement(child, ancestors, r);
      walk(child, TRANSPARENT.has(child.tag) ? ancestors : [child, ...ancestors]);
    }
  };

  const descendantsOf = node => {
    const out = [];
    const visit = n => n.children.forEach(c => (out.push(c.tag), visit(c)));
    visit(node);
    return out;
  };

  function checkElement(node, ancestors, r) {
    const tag = node.tag;
    const attrs = Object.fromEntries(node.attrs.map(a => [a.name, a.value]));
    const style = node.attrs.find(a => a.name === 'style');
    if (style?.value && !isDynamic(style.value)) checkCss(style.value, node.line, r, `<${tag} style>`);

    if (tag.startsWith('wa-')) {
      r(
        'ERR',
        node.line,
        `<${tag}> is Web Awesome. This project uses Saipem DS: <${PREFIX}${tag.slice(3)}> if it exists (see catalog).`
      );
      return;
    }

    if (NATIVE[tag]) {
      r('ERR', node.line, `native <${tag}>: use ${NATIVE[tag]}.`);
    } else if (tag === 'input') {
      const type = (attrs.type || 'text').toLowerCase();
      if (type !== 'hidden')
        r('ERR', node.line, `native <input type="${type}">: use ${NATIVE_INPUT[type] || NATIVE_INPUT.default}.`);
    }

    // Slots: any element (DS or not) placed in a named slot of its DS parent
    const slot = node.attrs.find(a => a.name === 'slot');
    if (slot?.value && !isDynamic(slot.value) && ancestors[0]?.tag.startsWith(PREFIX)) {
      const parentDef = DS.elements[ancestors[0].tag];
      if (parentDef && !parentDef.slots.includes(slot.value)) {
        const named = parentDef.slots.filter(Boolean);
        r(
          'ERR',
          node.line,
          `<${ancestors[0].tag}> has no slot "${slot.value}" (slots: ${named.join(', ') || 'default only'}).${didYouMean(slot.value, named)}`
        );
      }
    }

    if (!tag.startsWith(PREFIX)) return;
    ctx.usedTags.add(tag);
    const def = DS.elements[tag];
    if (!def) {
      r(
        'ERR',
        node.line,
        `<${tag}> does not exist in Saipem DS.${didYouMean(tag, Object.keys(DS.elements))} See references/catalog.md.`
      );
      return;
    }

    for (const attr of node.attrs) checkAttribute(node, def, attr, r, descendantsOf(node));

    for (const child of node.children) {
      const childSlot = child.attrs.find(a => a.name === 'slot');
      if (childSlot || TRANSPARENT.has(child.tag)) continue;
      if (!def.slots.includes('') && def.slots.length && !child.tag.startsWith('#')) {
        r(
          'WARN',
          child.line,
          `<${tag}> has no default slot: <${child.tag}> will not be shown. Use slot="${def.slots.join('|')}".`
        );
      }
    }

    // Parent
    const parents = REQUIRED_PARENT[tag];
    if (parents && ancestors.length && !ancestors.some(a => parents.includes(a.tag))) {
      r('WARN', node.line, `<${tag}> works only inside ${parents.map(p => `<${p}>`).join(' or ')}.`);
    }

    // Icons
    if ((tag === 'sl-icon' || tag === 'sl-icon-button') && ICONS.size) {
      const iconName = attrs.name;
      if (iconName && !isDynamic(iconName) && !('library' in attrs) && !('src' in attrs) && !ICONS.has(iconName)) {
        r(
          'ERR',
          node.line,
          `icon "${iconName}" is not in the DS icon set.${didYouMean(iconName, ICONS)} Search with: ds.mjs icons <word>.`
        );
      }
    }

    if (tag === 'sl-button' && attrs.variant === 'primary') primaryButtons++;
    if (/\bngModel\b|formControl/.test(node.attrs.map(a => a.name).join(' '))) ctx.usesForms = true;
  }

  walk(root, []);
  for (const s of styles) checkCss(s.css, at(s.line), report, '<style>');
  if (primaryButtons > 1) {
    report(
      'WARN',
      baseLine,
      `${primaryButtons} primary buttons in this template: at most one variant="primary" per region (page, card, dialog, toolbar).`
    );
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------------------------------------------

function validateSource(src, ext, report) {
  const ctx = { usedTags: new Set(), usesForms: false };

  if (ext === '.css' || ext === '.scss' || ext === '.less') {
    checkCss(src, 1, report);
    return;
  }

  if (ext === '.md') {
    const re = /^```(html|ts|js|css)[^\n]*\n([\s\S]*?)^```/gm;
    for (const m of src.matchAll(re)) {
      const line = lineAt(src, m.index) + 1;
      const blockCtx = { usedTags: new Set(), usesForms: false };
      if (m[1] === 'html') validateMarkup(m[2], line, report, blockCtx);
      else if (m[1] === 'css') checkCss(m[2], line, report);
      else validateScript(m[2], line, report, blockCtx);
    }
    return;
  }

  if (['.ts', '.js', '.mjs', '.cjs', '.tsx', '.jsx'].includes(ext)) {
    validateScript(src, 1, report, ctx);
    return;
  }

  validateMarkup(src, 1, report, ctx);
}

function validateScript(src, baseLine, report, ctx) {
  const at = idx => baseLine + lineAt(src, idx) - 1;
  const isAngular = /@Component\s*\(/.test(src);
  const before = ctx.usedTags.size;

  // Angular inline templates and Lit html`` templates
  for (const m of src.matchAll(/(\btemplate\s*:\s*|\bhtml\s*)`/g)) {
    const start = m.index + m[0].length;
    const end = templateEnd(src, start);
    if (end === -1) continue;
    validateMarkup(maskInterpolations(src.slice(start, end)), at(start), report, ctx);
  }
  for (const m of src.matchAll(/\btemplate\s*:\s*(['"])([\s\S]*?)\1/g)) {
    validateMarkup(m[2], at(m.index), report, ctx);
  }
  // Inline styles
  for (const m of src.matchAll(/(\bstyles\s*:\s*\[?\s*|\bcss\s*)`/g)) {
    const start = m.index + m[0].length;
    const end = templateEnd(src, start);
    if (end !== -1) checkCss(maskInterpolations(src.slice(start, end)), at(start), report, 'styles');
  }
  // Element APIs used from code: document.createElement / querySelector are not checked, imports are.
  for (const m of src.matchAll(/['"]([^'"]*\/components\/([a-z-]+)\/\2(?:\.component)?\.js)['"]/g)) {
    const tag = PREFIX + m[2];
    if (!DS.elements[tag]) report('ERR', at(m.index), `import of "${m[1]}": <${tag}> does not exist in Saipem DS.`);
  }

  const usedHere = ctx.usedTags.size > before || /<sl-[a-z]/.test(src);
  if (isAngular && usedHere) {
    if (!/CUSTOM_ELEMENTS_SCHEMA/.test(src)) {
      report('ERR', baseLine, 'Angular component renders DS tags without schemas: [CUSTOM_ELEMENTS_SCHEMA].');
    }
    if (ctx.usesForms && !/ValueAccessor|NG_VALUE_ACCESSOR/.test(src)) {
      report(
        'WARN',
        baseLine,
        'ngModel / formControl on DS controls needs the value accessor directive (references/angular.md#forms) in imports.'
      );
    }
    const autoloader = /shoelace-autoloader|shoelace\.js['"]/.test(src);
    if (!autoloader) {
      for (const tag of ctx.usedTags) {
        const name = tag.slice(PREFIX.length);
        if (DS.elements[tag] && !new RegExp(`/components/${name}/${name}\\.js`).test(src)) {
          report(
            'INFO',
            baseLine,
            `<${tag}> is not imported in this file (fine if it is registered elsewhere): import '${DS.elements[tag].import}';`
          );
        }
      }
    }
  }
}

function collect(target, files) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      if (['node_modules', '.git', 'dist', 'cdn', '.angular'].includes(entry)) continue;
      collect(path.join(target, entry), files);
    }
  } else if (/\.(html?|ts|js|mjs|cjs|css|scss|less|md)$/.test(target) && !/\.(spec|test|d)\.ts$/.test(target)) {
    files.push(target);
  }
}

function validate(targets, { json = false, strict = false } = {}) {
  const files = [];
  for (const t of targets) collect(t, files);
  const results = [];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const seen = new Set();
    validateSource(src, path.extname(file).toLowerCase(), (level, line, message) => {
      const key = `${level}:${line}:${message}`;
      if (seen.has(key)) return;
      seen.add(key);
      results.push({ file, line, level, message });
    });
  }
  const count = level => results.filter(r => r.level === level).length;
  const summary = { files: files.length, errors: count('ERR'), warnings: count('WARN'), info: count('INFO') };
  if (json) {
    console.log(JSON.stringify({ summary, results }, null, 2));
  } else {
    for (const r of results) console.log(`${r.file}:${r.line}  ${r.level.padEnd(4)} ${r.message}`);
    console.log(
      `\n${summary.files} file(s): ${summary.errors} error(s), ${summary.warnings} warning(s), ${summary.info} info.`
    );
  }
  return summary.errors > 0 || (strict && summary.warnings > 0) ? 1 : 0;
}

// ---------------------------------------------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------------------------------------------

function printApi(input) {
  const tag = input.startsWith(PREFIX) ? input : PREFIX + input;
  const def = DS.elements[tag];
  if (!def) {
    console.log(`<${tag}> does not exist in Saipem DS.${didYouMean(tag, Object.keys(DS.elements))}`);
    return 1;
  }
  const attrs = Object.entries(def.attrs).map(([n, a]) => {
    const values = a.values
      ? `=${a.values.map(v => `'${v}'`).join('|')}${a.open ? '|string' : ''}`
      : a.boolean
        ? ' (boolean)'
        : '';
    return `  ${n}${values}${a.prop && a.prop !== n ? `  [property: ${a.prop}]` : ''}`;
  });
  const attrProps = new Set(Object.values(def.attrs).map(a => a.prop));
  const propsOnly = def.props.filter(p => !attrProps.has(p));
  console.log(
    `<${tag}>  (${def.fork === 'new' ? 'only in Saipem DS' : def.fork === 'modified' ? 'customized in Saipem DS' : 'same API as upstream'})`
  );
  console.log(`import '${def.import}';`);
  console.log(`attributes:\n${attrs.join('\n') || '  —'}`);
  console.log(`properties without attribute: ${propsOnly.join(', ') || '—'}`);
  console.log(`events: ${def.events.join(', ') || '—'}`);
  console.log(`slots: ${def.slots.map(s => s || '(default)').join(', ') || '—'}`);
  console.log(`css parts: ${def.parts.join(', ') || '—'}`);
  console.log(`css custom properties: ${def.cssProps.join(', ') || '—'}`);
  console.log(`full reference: references/components/${tag.slice(PREFIX.length)}.md`);
  return 0;
}

function search(list, words, label) {
  const terms = words.map(w => w.toLowerCase());
  const hits = list.filter(item => terms.every(t => item.toLowerCase().includes(t)));
  console.log(hits.length ? hits.join('\n') : `No ${label} matches "${words.join(' ')}".`);
  return hits.length ? 0 : 1;
}

// ---------------------------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------------------------

const [command, ...args] = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const rest = args.filter(a => !a.startsWith('--'));
let code = 0;

switch (command) {
  case 'validate':
    if (!rest.length) {
      console.error('Usage: ds.mjs validate <file|dir>... [--json] [--strict]');
      code = 2;
    } else {
      code = validate(rest, { json: flags.has('--json'), strict: flags.has('--strict') });
    }
    break;
  case 'api':
    code = rest.length ? printApi(rest[0]) : (console.log(Object.keys(DS.elements).join('\n')), 0);
    break;
  case 'icons':
    code = search(DS.icons, rest, 'icon');
    break;
  case 'tokens':
    code = search(DS.tokens, rest, 'token');
    break;
  default:
    console.log(
      'Usage:\n  ds.mjs validate <file|dir>... [--json] [--strict]\n  ds.mjs api [tag]\n  ds.mjs icons <word>...\n  ds.mjs tokens <word>...'
    );
    code = command ? 2 : 0;
}

process.exitCode = code;
