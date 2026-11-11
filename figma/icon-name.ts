// Shared helper for the Code Connect templates (`figma/*.figma.ts`) that read a nested icon instance.
// Imported with a relative path: `figma connect` bundles it into each template. Not a template itself (no `.figma.ts`).

/** Placeholder emitted when no valid icon name can be found: visible in the snippet, never a plausible-but-wrong icon. */
export const MISSING_ICON_NAME = 'TODO-icon';

/**
 * Name of the sl-icon (Bootstrap Icons) behind a Figma icon instance.
 * Icon components are named "Icon/<name>", matching the sl-icon `name` attribute. Consumer files rename the swapped layer
 * (e.g. "icon"): when it is not "Icon/<name>", the name is read from the icon's own Code Connect snippet
 * (`<sl-icon name="…">`).
 */
export function resolveIconName(icon: { name: string; executeTemplate(): { example: unknown } }): string {
  if (/^Icon\//.test(icon.name)) return icon.name.replace(/^Icon\//, '');
  const match = /name=\\?"([a-z0-9-]+)\\?"/.exec(JSON.stringify(icon.executeTemplate().example));
  return match ? match[1] : MISSING_ICON_NAME;
}
