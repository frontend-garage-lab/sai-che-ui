//
// Seeds and constraints for the Saipem colour system. Consumed by make-palettes.js.
//
// The two brand colours come from the Saipem logo. Every other value in the theme is
// derived from them, so retuning the brand means editing this file and re-running
// `npm run palettes` — never hand-editing the generated CSS.
//
// The values below were sampled from the logo artwork (pixel average over the petrol and
// orange shapes). They should be replaced with the official codes from the Saipem brand
// manual once available; the rest of the system will follow.
//
export const BRAND = {
  petrol: { hex: '#024354', hue: 192, saturation: 95, lightness: 16 },
  orange: { hex: '#F28531', hue: 26, saturation: 88, lightness: 57 }
};

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Contrast floor for "text sitting on a role's resting fill". WCAG 2.1 AA for body text is
// 4.5; we solve for 4.6 so rounding to one decimal place can't drop us under.
export const CONTRAST_TARGET = 4.6;
export const CONTRAST_FLOOR = 4.5;

// WCAG 2.1 SC 1.4.11: the boundary of a form control must reach 3:1 against its background.
export const NON_TEXT_FLOOR = 3;

// Saturation tapers toward the pale end in the light theme so the 50/100 tints read as
// paper rather than as washed-out colour.
const LIGHT_SATURATION = {
  50: 0.6,
  100: 0.66,
  200: 0.76,
  300: 0.86,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.98,
  800: 0.95,
  900: 0.92,
  950: 0.9
};

// In the dark theme the scale runs the other way — 50 is darkest, 950 lightest — so the
// taper applies to the light end of the ramp instead.
const DARK_SATURATION = {
  50: 1,
  100: 1,
  200: 1,
  300: 1,
  400: 1,
  500: 1,
  600: 1,
  700: 0.95,
  800: 0.85,
  900: 0.7,
  950: 0.5
};

// Shoelace's own dark lightness curve, lifted verbatim from the upstream sky ramp. It was
// already tuned to avoid true black, so there's no reason to invent a different one.
const DARK_LIGHTNESS = [20.9, 28, 30.8, 36.1, 44.3, 47.7, 57.2, 70.5, 82.5, 89.9, 95.5];

// Anchors pin a step to an exact lightness instead of letting the curve decide.
//   `brand`    — this step must contain the literal logo colour.
//   `contrast` — solve this step's lightness so `ink` on it clears CONTRAST_TARGET.
// Everything between anchors is interpolated linearly on the step index; the ends are
// pinned by `endpoints`.
//
// `saturationAnchors` do the same for saturation: they replace role saturation × taper
// on a single step. The petrol needs them because the logo colour is far more saturated
// (95%) than is comfortable for the mid-tone fills that carry most of the UI.
export const ROLES = {
  // 80% keeps the interactive mid-tones a deep petrol rather than the dusty grey-blue a
  // 45% ramp produced, without tipping into the electric cyan of the legacy xCMM buttons.
  primary: { hue: 192, saturation: 80 },
  accent: { hue: 26, saturation: 88 },
  // Hue 162 is a teal-green: a relative of the petrol rather than a generic Tailwind green.
  success: { hue: 162, saturation: 62 },
  // Hue 45: far enough from the orange's 26 that a warning is never mistaken for an accent.
  warning: { hue: 45, saturation: 93 },
  danger: { hue: 6, saturation: 72 }
};

export const LIGHT = {
  endpoints: { first: 97, last: 12 },
  saturation: LIGHT_SATURATION,
  anchors: {
    // 600 is the resting fill for buttons, checked toggles and the focus ring. Pinning it at
    // 28% (≈7:1 with white) instead of solving for the 4.6 floor gives the primary real
    // weight. 100/200 are pinned so selected rows and tag tints stay pale. 800 is the logo.
    primary: { 100: 93, 200: 85, 600: 28, 800: 16 },
    accent: { 500: 57 },
    success: { 600: 'contrast' },
    warning: { 600: 'contrast' },
    danger: { 600: 'contrast' }
  },
  saturationAnchors: {
    primary: { 800: 95, 900: 90, 950: 85 }
  },
  // Near-neutral greys with a faint cool cast. Keeping the tint low (4–10%) leaves the petrol
  // as the only brand-coloured thing on screen, so it reads as an accent instead of blending
  // into every border and surface. Hand-tuned rather than curve-derived: the neutral ramp
  // carries every surface, border and body-text value, so its steps aren't evenly spaced.
  //   400 — input borders, must clear NON_TEXT_FLOOR on white
  //   500 — placeholder and secondary text, must clear CONTRAST_FLOOR on white
  neutral: {
    hue: 200,
    steps: {
      50: [10, 97.5],
      100: [9, 95.5],
      200: [8, 90],
      300: [7, 81],
      400: [6, 56],
      500: [6, 45],
      600: [7, 36],
      700: [9, 28],
      800: [11, 20],
      900: [14, 14],
      950: [18, 9]
    }
  },
  oneOffs: { 0: [0, 0, 100], 1000: [0, 0, 0] },
  // Light theme: white text on every fill except the brand orange, which would have to
  // darken into brown before white became legible on it.
  ink: {
    primary: 'var(--sl-color-neutral-0)',
    accent: 'var(--sl-color-primary-950)',
    success: 'var(--sl-color-neutral-0)',
    warning: 'var(--sl-color-neutral-0)',
    danger: 'var(--sl-color-neutral-0)',
    neutral: 'var(--sl-color-neutral-0)'
  },
  // Neutral pairings that the theme tokens rely on. [foreground, background, floor, label]
  audit: [
    [700, 0, CONTRAST_FLOOR, 'body text on panel'],
    [700, 100, CONTRAST_FLOOR, 'body text on sunken surface'],
    [500, 0, CONTRAST_FLOOR, 'placeholder on input'],
    [600, 0, CONTRAST_FLOOR, 'help text on panel'],
    [400, 0, NON_TEXT_FLOOR, 'input border on input']
  ]
};

export const DARK = {
  lightness: DARK_LIGHTNESS,
  saturation: DARK_SATURATION,
  anchors: {
    // In the dark ramp the logo petrol is the darkest step; the orange stays on 500.
    primary: { 50: 16 },
    // The logo orange sits at 57%, right where the curve puts 600, so 600 is pushed up to
    // keep the active state (600) visibly different from the resting fill (500).
    accent: { 500: 57, 600: 64 },
    success: {},
    warning: {},
    danger: {}
  },
  saturationAnchors: {
    // Light-on-dark fills glow, so the petrol's mid-tones are pulled back further than in
    // the light theme to avoid a neon cyan.
    primary: { 50: 95, 400: 72, 500: 65, 600: 60, 700: 55, 800: 50, 900: 42, 950: 32 }
  },
  neutral: {
    hue: 200,
    steps: {
      50: [14, 11],
      100: [13, 14],
      200: [12, 18],
      300: [10, 23],
      400: [9, 30],
      500: [8, 42],
      600: [8, 56],
      700: [9, 70],
      800: [10, 82],
      900: [8, 91],
      950: [6, 96]
    }
  },
  oneOffs: { 0: [200, 26, 8], 1000: [0, 0, 100] },
  // Dark theme: the ramps are lightness-inverted, so a role's 600 fill is a *light*
  // colour and neutral-0 (a near-black) is the correct ink for every role.
  ink: {
    primary: 'var(--sl-color-neutral-0)',
    accent: 'var(--sl-color-neutral-0)',
    success: 'var(--sl-color-neutral-0)',
    warning: 'var(--sl-color-neutral-0)',
    danger: 'var(--sl-color-neutral-0)',
    neutral: 'var(--sl-color-neutral-0)'
  },
  audit: [
    [700, 50, CONTRAST_FLOOR, 'body text on panel'],
    [700, 100, CONTRAST_FLOOR, 'body text on sunken surface'],
    [600, 0, CONTRAST_FLOOR, 'placeholder on input'],
    [600, 50, CONTRAST_FLOOR, 'help text on panel'],
    [500, 0, NON_TEXT_FLOOR, 'input border on input']
  ]
};
