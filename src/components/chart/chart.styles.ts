import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
    height: 20rem;
  }

  .chart {
    position: relative;
    width: 100%;
    height: 100%;
  }

  canvas {
    display: block;
  }

  .chart__fallback {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;
