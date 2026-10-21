import { css } from 'lit';

export default css`
  :host {
    --width: calc(var(--sl-spacing-medium) * 20);
    --collapsed-width: calc(var(--sl-input-height-small) + 4 * var(--sl-spacing-x-small));

    display: block;
    height: 100%;
  }

  .sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--width);
    height: 100%;
    border-inline-end: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
    background-color: var(--sl-color-neutral-0);
    color: var(--sl-color-neutral-700);
    overflow: hidden;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    transition: var(--sl-transition-medium) width;
  }

  .sidebar--collapsed {
    width: var(--collapsed-width);
  }

  .sidebar__nav {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: var(--sl-spacing-x-small);
  }

  .sidebar__header[hidden],
  .sidebar__footer[hidden] {
    display: none;
  }

  .sidebar__header,
  .sidebar__footer {
    padding: var(--sl-spacing-small);
  }

  .sidebar__header {
    border-bottom: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
  }

  .sidebar__footer {
    border-top: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
  }

  /* Collapse toggle pinned to the bottom of the sidebar */
  .sidebar__toggle {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-small);
    border-top: solid var(--sl-panel-border-width) var(--sl-color-neutral-200);
    font-size: var(--sl-font-size-large);
  }

  .sidebar--collapsed .sidebar__toggle {
    justify-content: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .sidebar {
      transition: none;
    }
  }
`;
