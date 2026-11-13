//
// Shared helpers that turn a Custom Elements Manifest into the compact API used by the Saipem DS skill.
//

/** Splits a TypeScript union into its string literals. Returns `null` when the type is not a plain union. */
export function parseUnion(typeText) {
  if (!typeText || /=>|[<>{}[\]()]/.test(typeText)) return null;
  const parts = typeText
    .split('|')
    .map(part => part.trim())
    .filter(Boolean);
  const values = [];
  let open = false;
  let literals = 0;
  for (const part of parts) {
    const literal = part.match(/^'([^']*)'$|^"([^"]*)"$/);
    if (literal) {
      values.push(literal[1] ?? literal[2]);
      literals++;
    } else if (part !== 'undefined' && part !== 'null') {
      open = true;
    }
  }
  if (literals === 0) return null;
  return { values, open };
}

const clean = text => (text || '').replace(/\s+/g, ' ').trim();

/** Returns every custom element declared in the manifest, keyed by tag name. */
export function elementsOf(manifest) {
  const out = {};
  for (const mod of manifest.modules || []) {
    for (const decl of mod.declarations || []) {
      if (decl.tagName) out[decl.tagName] = { ...decl, modulePath: mod.path };
    }
  }
  return out;
}

/** Compact, validator-friendly description of one element. */
export function compactElement(decl) {
  const attrs = {};
  for (const attr of decl.attributes || []) {
    if (!attr.name) continue;
    const typeText = clean(attr.type?.text);
    const union = parseUnion(typeText);
    attrs[attr.name] = {
      prop: attr.fieldName || null,
      type: typeText,
      ...(union ? { values: union.values, open: union.open } : {}),
      ...(typeText === 'boolean' ? { boolean: true } : {}),
      ...(attr.default !== undefined ? { default: attr.default } : {}),
      description: clean(attr.description)
    };
  }

  const props = {};
  const methods = [];
  for (const member of decl.members || []) {
    if (member.privacy === 'private' || member.privacy === 'protected' || member.static) continue;
    if (member.name.startsWith('_') || member.name.startsWith('#')) continue;
    if (member.kind === 'field') {
      props[member.name] = {
        attr: member.attribute || null,
        type: clean(member.type?.text),
        ...(member.readonly ? { readonly: true } : {}),
        description: clean(member.description)
      };
    } else if (member.kind === 'method' && member.description) {
      methods.push({
        name: member.name,
        params: (member.parameters || []).map(p => ({
          name: p.name,
          type: clean(p.type?.text),
          ...(p.optional ? { optional: true } : {})
        })),
        description: clean(member.description)
      });
    }
  }

  return {
    summary: clean(decl.summary),
    status: decl.status || null,
    since: decl.since || null,
    module: decl.modulePath,
    attrs,
    props,
    methods,
    events: (decl.events || [])
      .filter(e => e.name)
      .map(e => ({ name: e.name, detail: clean(e.type?.text), description: clean(e.description) })),
    slots: (decl.slots || []).map(s => ({ name: s.name || '', description: clean(s.description) })),
    parts: (decl.cssParts || []).map(p => ({ name: p.name, description: clean(p.description) })),
    cssProps: (decl.cssProperties || []).map(c => ({
      name: c.name,
      description: clean(c.description),
      ...(c.default !== undefined ? { default: c.default } : {})
    })),
    dependencies: decl.dependencies || []
  };
}

/** The minimal shape stored for the upstream baseline: just enough to compute what the fork changed. */
export function baselineElement(decl) {
  const full = compactElement(decl);
  return {
    attrs: Object.fromEntries(
      Object.entries(full.attrs).map(([name, a]) => [name, a.values ? { values: a.values, open: a.open } : {}])
    ),
    events: full.events.map(e => e.name),
    slots: full.slots.map(s => s.name),
    parts: full.parts.map(p => p.name),
    cssProps: full.cssProps.map(c => c.name)
  };
}
