import { css } from 'lit';

export default css`
  :host {
    /* Falls back to the header's own defaults when used outside of <sl-header> */
    --color: hsl(0 0% 100%);

    display: contents;
  }

  /*
   * Nav items are pills on the header surface. Colours derive from --color (inherited from the host <sl-header>, or
   * the fallback above) so items follow the header if it's re-themed. The current page gets a stronger wash and
   * full-strength text.
   */
  .header-item {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-x-small);
    height: 2rem;
    padding-inline: var(--sl-spacing-small);
    border: none;
    border-radius: var(--sl-border-radius-medium);
    background: none;
    color: color-mix(in srgb, var(--color) 82%, transparent);
    font: inherit;
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) background-color;
  }

  .header-item:hover {
    color: var(--color);
    background-color: color-mix(in srgb, var(--color) 10%, transparent);
  }

  .header-item[aria-current='page'] {
    color: var(--color);
    background-color: color-mix(in srgb, var(--color) 16%, transparent);
  }

  .header-item:focus-visible {
    outline: solid 2px var(--color);
    outline-offset: -2px;
  }

  .header-item__chevron {
    flex: 0 0 auto;
    font-size: 0.75em;
  }

  .header-item--has-menu[aria-expanded='true'] .header-item__chevron {
    rotate: 180deg;
  }
`;
