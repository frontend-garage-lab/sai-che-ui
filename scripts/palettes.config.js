//
// Seeds and constraints for the Saipem colour system. Consumed by make-palettes.js.
//
// The two brand colours come from the Saipem logo. Every other value in the theme is
// derived from them, so retuning the brand means editing this file and re-running
// `npm run palettes` — never hand-editing the generated CSS.
//
export const BRAND = {
  petrol: { hex: '#224C5A', hue: 195, saturation: 45, lightness: 24 },
  orange: { hex: '#F08A04', hue: 34, saturation: 97, lightness: 48 }
};

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Contrast floor for "text sitting on a role's resting fill". WCAG 2.1 AA for body text is
// 4.5; we solve for 4.6 so rounding to one decimal place can't drop us under.
export const CONTRAST_TARGET = 4.6;
export const CONTRAST_FLOOR = 4.5;

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
export const ROLES = {
  primary: { hue: 195, saturation: 45 },
  accent: { hue: 34, saturation: 97 },
  // Hue 162 is a teal-green: a relative of the petrol rather than a generic Tailwind green.
  success: { hue: 162, saturation: 62 },
  // Hue 45 rather than the orange's 34, so a warning is never mistaken for an accent.
  warning: { hue: 45, saturation: 93 },
  danger: { hue: 6, saturation: 72 }
};

export const LIGHT = {
  endpoints: { first: 97, last: 12 },
  saturation: LIGHT_SATURATION,
  anchors: {
    primary: { 600: 'contrast', 800: 24 },
    accent: { 500: 48 },
    success: { 600: 'contrast' },
    warning: { 600: 'contrast' },
    danger: { 600: 'contrast' }
  },
  // Petrol-tinted greys. Hand-tuned rather than curve-derived: the neutral ramp carries
  // every surface, border and body-text value, so its steps aren't evenly spaced.
  neutral: {
    hue: 200,
    steps: {
      50: [20, 98],
      100: [18, 96],
      200: [15, 90],
      300: [13, 80],
      400: [11, 64],
      500: [11, 50],
      600: [12, 41],
      700: [14, 33],
      800: [16, 25],
      900: [20, 17],
      950: [24, 11]
    }
  },
  oneOffs: { 0: 'hsl(0 0% 100%)', 1000: 'hsl(0 0% 0%)' },
  // Light theme: white text on every fill except the brand orange, which would have to
  // darken into brown before white became legible on it.
  ink: {
    primary: 'var(--sl-color-neutral-0)',
    accent: 'var(--sl-color-primary-950)',
    success: 'var(--sl-color-neutral-0)',
    warning: 'var(--sl-color-neutral-0)',
    danger: 'var(--sl-color-neutral-0)',
    neutral: 'var(--sl-color-neutral-0)'
  }
};

export const DARK = {
  lightness: DARK_LIGHTNESS,
  saturation: DARK_SATURATION,
  anchors: {
    // In the dark ramp the logo petrol is the darkest step; the orange stays on 500.
    primary: { 50: 24 },
    accent: { 500: 48 },
    success: {},
    warning: {},
    danger: {}
  },
  neutral: {
    hue: 200,
    steps: {
      50: [24, 11],
      100: [22, 14],
      200: [20, 18],
      300: [17, 23],
      400: [14, 30],
      500: [12, 42],
      600: [13, 56],
      700: [15, 70],
      800: [17, 82],
      900: [14, 91],
      950: [10, 96]
    }
  },
  oneOffs: { 0: 'hsl(200 26% 8%)', 1000: 'hsl(0 0% 100%)' },
  // Dark theme: the ramps are lightness-inverted, so a role's 600 fill is a *light*
  // colour and neutral-0 (a near-black) is the correct ink for every role.
  ink: {
    primary: 'var(--sl-color-neutral-0)',
    accent: 'var(--sl-color-neutral-0)',
    success: 'var(--sl-color-neutral-0)',
    warning: 'var(--sl-color-neutral-0)',
    danger: 'var(--sl-color-neutral-0)',
    neutral: 'var(--sl-color-neutral-0)'
  }
};
