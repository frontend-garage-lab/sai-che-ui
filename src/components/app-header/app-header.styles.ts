import { css } from 'lit';

export default css`
  :host {
    --height: 3.5rem;
    --background: var(--sl-color-brand);
    --color: hsl(0 0% 100%);
    --accent-color: var(--sl-color-brand-accent);

    display: block;
  }

  /* The orange line along the bottom edge is the brand signature carried over from xCMM */
  .app-header {
    display: flex;
    align-items: stretch;
    gap: var(--sl-spacing-large);
    height: var(--height);
    padding-inline: var(--sl-spacing-large);
    border-bottom: solid 3px var(--accent-color);
    background-color: var(--background);
    color: var(--color);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
    box-sizing: content-box;
  }

  .app-header__logo {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    font-size: var(--sl-font-size-large);
    font-weight: var(--sl-font-weight-bold);
    letter-spacing: var(--sl-letter-spacing-dense);
    white-space: nowrap;
  }

  .app-header__logo ::slotted(img),
  .app-header__logo ::slotted(svg) {
    display: block;
    height: calc(var(--height) - var(--sl-spacing-large));
  }

  .app-header__nav {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-3x-small);
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .app-header__nav[hidden] {
    display: none;
  }

  /*
   * Nav links are pills on the brand surface. Colours derive from --color so the links follow
   * the header if it's re-themed; the current page gets a stronger wash and full-strength text.
   *
   * The links live in the light DOM, where the page's own link styles (e.g. \`a { color: … }\`)
   * beat ::slotted() rules. !important here is the intended way out: an important declaration
   * inside a shadow root wins over normal declarations from the page. Without it the links take
   * the page's link colour and disappear against the petrol.
   */
  .app-header__nav ::slotted(a) {
    display: flex;
    align-items: center;
    height: 2rem;
    padding-inline: var(--sl-spacing-small);
    border-radius: var(--sl-border-radius-medium);
    color: color-mix(in srgb, var(--color) 82%, transparent) !important;
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none !important;
    white-space: nowrap;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) background-color;
  }

  .app-header__nav ::slotted(a:hover) {
    color: var(--color) !important;
    background-color: color-mix(in srgb, var(--color) 10%, transparent) !important;
  }

  .app-header__nav ::slotted(a[aria-current='page']) {
    color: var(--color) !important;
    background-color: color-mix(in srgb, var(--color) 16%, transparent) !important;
  }

  .app-header__nav ::slotted(a:focus-visible) {
    outline: solid 2px var(--color);
    outline-offset: -2px;
  }

  .app-header__actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    margin-inline-start: auto;
  }

  /* Icon buttons take the header's colour; their hover wash derives from it */
  .app-header__actions ::slotted(sl-icon-button) {
    color: var(--color);
    font-size: var(--sl-font-size-large);
  }
`;
