import { css } from 'lit';

export default css`
  :host {
    --icon-size: var(--sl-input-height-small);

    display: block;
  }

  .sidebar-group__divider {
    --spacing: var(--sl-spacing-small);
  }

  :host(:last-of-type) .sidebar-group__divider {
    display: none;
  }

  .sidebar-group__header {
    display: flex;
    align-items: center;
    gap: var(--sl-spacing-small);
    min-height: var(--sl-input-height-medium);
    padding-inline: var(--sl-spacing-x-small);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .sidebar-group__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size);
    height: var(--icon-size);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-medium);
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) background-color;
  }

  /* The group holding the current page gets the brand tile, so it's recognisable in the collapsed rail too */
  .sidebar-group--current .sidebar-group__icon {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .sidebar-group__items {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-3x-small);
  }

  .sidebar-group__icon:not(:has(::slotted(*))) {
    display: none;
  }

  .sidebar-group__label {
    flex: 1 1 auto;
    min-width: 0;
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-x-small);
    font-weight: var(--sl-font-weight-bold);
    letter-spacing: var(--sl-letter-spacing-loose);
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-group--current .sidebar-group__label {
    color: var(--sl-color-neutral-900);
  }

  .sidebar-group__count::part(base) {
    background-color: transparent;
    color: var(--sl-color-neutral-400);
    font-variant-numeric: tabular-nums;
  }

  /* Collapsed: only the icon tile remains, centred in the rail */
  .sidebar-group--collapsed .sidebar-group__header {
    justify-content: center;
    padding-inline: 0;
    margin-bottom: 0;
  }

  .sidebar-group--collapsed .sidebar-group__label,
  .sidebar-group--collapsed .sidebar-group__count {
    display: none;
  }
`;
