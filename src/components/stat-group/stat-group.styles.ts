import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .stat-group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sl-spacing-small);
  }
`;
