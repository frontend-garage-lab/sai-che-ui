---
meta:
  title: Typography
  description: Typography tokens are used to maintain a consistent set of font styles throughout your app.
---

# Typography Tokens

Typography tokens are used to maintain a consistent set of font styles throughout your app.

## Font Family

The sans font is **Inter**, the same family as the Saipem DS in Figma, with the system stack as fallback. The theme only names the font: load it in your app, for example with [`@fontsource/inter`](https://fontsource.org/fonts/inter) (weights 300, 400, 500 and 700, the ones the font weight tokens use).

| Token             | Value                                                                                                                                                  | Example                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `--sl-font-sans`  | 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' | <span style="font-family: var(--sl-font-sans)">The quick brown fox jumped over the lazy dog.</span>  |
| `--sl-font-serif` | Georgia, 'Times New Roman', serif                                                                                                                      | <span style="font-family: var(--sl-font-serif)">The quick brown fox jumped over the lazy dog.</span> |
| `--sl-font-mono`  | SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;                                                                                         | <span style="font-family: var(--sl-font-mono)">The quick brown fox jumped over the lazy dog.</span>  |

## Font Size

Font sizes use `rem` units so they scale with the base font size. The pixel values displayed are based on a 16px font size.

| Token                     | Value           | Example                                                         |
| ------------------------- | --------------- | --------------------------------------------------------------- |
| `--sl-font-size-2x-small` | 0.625rem (10px) | <span style="font-size: var(--sl-font-size-2x-small)">Aa</span> |
| `--sl-font-size-x-small`  | 0.75rem (12px)  | <span style="font-size: var(--sl-font-size-x-small)">Aa</span>  |
| `--sl-font-size-small`    | 0.875rem (14px) | <span style="font-size: var(--sl-font-size-small)">Aa</span>    |
| `--sl-font-size-medium`   | 1rem (16px)     | <span style="font-size: var(--sl-font-size-medium)">Aa</span>   |
| `--sl-font-size-large`    | 1.25rem (20px)  | <span style="font-size: var(--sl-font-size-large)">Aa</span>    |
| `--sl-font-size-x-large`  | 1.5rem (24px)   | <span style="font-size: var(--sl-font-size-x-large)">Aa</span>  |
| `--sl-font-size-2x-large` | 2.25rem (36px)  | <span style="font-size: var(--sl-font-size-2x-large)">Aa</span> |
| `--sl-font-size-3x-large` | 3rem (48px)     | <span style="font-size: var(--sl-font-size-3x-large)">Aa</span> |
| `--sl-font-size-4x-large` | 4.5rem (72px)   | <span style="font-size: var(--sl-font-size-4x-large)">Aa</span> |

## Font Weight

| Token                       | Value | Example                                                                                                         |
| --------------------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| `--sl-font-weight-light`    | 300   | <span style="font-weight: var(--sl-font-weight-light);">The quick brown fox jumped over the lazy dog.</span>    |
| `--sl-font-weight-normal`   | 400   | <span style="font-weight: var(--sl-font-weight-normal);">The quick brown fox jumped over the lazy dog.</span>   |
| `--sl-font-weight-semibold` | 500   | <span style="font-weight: var(--sl-font-weight-semibold);">The quick brown fox jumped over the lazy dog.</span> |
| `--sl-font-weight-bold`     | 700   | <span style="font-weight: var(--sl-font-weight-bold);">The quick brown fox jumped over the lazy dog.</span>     |

## Letter Spacing

| Token                        | Value    | Example                                                                                                             |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `--sl-letter-spacing-denser` | -0.03em  | <span style="letter-spacing: var(--sl-letter-spacing-denser);">The quick brown fox jumped over the lazy dog.</span> |
| `--sl-letter-spacing-dense`  | -0.015em | <span style="letter-spacing: var(--sl-letter-spacing-dense);">The quick brown fox jumped over the lazy dog.</span>  |
| `--sl-letter-spacing-normal` | normal   | <span style="letter-spacing: var(--sl-letter-spacing-normal);">The quick brown fox jumped over the lazy dog.</span> |
| `--sl-letter-spacing-loose`  | 0.075em  | <span style="letter-spacing: var(--sl-letter-spacing-loose);">The quick brown fox jumped over the lazy dog.</span>  |
| `--sl-letter-spacing-looser` | 0.15em   | <span style="letter-spacing: var(--sl-letter-spacing-looser);">The quick brown fox jumped over the lazy dog.</span> |

## Line Height

| Token                     | Value | Example                                                                                                                                                                                                       |
| ------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sl-line-height-denser` | 1     | <div style="line-height: var(--sl-line-height-denser);">The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.</div> |
| `--sl-line-height-dense`  | 1.4   | <div style="line-height: var(--sl-line-height-dense);">The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.</div>  |
| `--sl-line-height-normal` | 1.5   | <div style="line-height: var(--sl-line-height-normal);">The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.</div> |
| `--sl-line-height-loose`  | 2.2   | <div style="line-height: var(--sl-line-height-loose);">The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.</div>  |
| `--sl-line-height-looser` | 2.6   | <div style="line-height: var(--sl-line-height-looser);">The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.<br>The quick brown fox jumped over the lazy dog.</div> |

## Text Styles

Utility classes in `themes/_utility.css` that combine the tokens above into the text styles of the Saipem DS in Figma. They set the font only: colour and margins stay with the context.

| Class              | Figma text style | Size                      | Weight                      | Line height               |
| ------------------ | ---------------- | ------------------------- | --------------------------- | ------------------------- |
| `.sl-heading-1`    | Heading/H1       | `--sl-font-size-2x-large` | `--sl-font-weight-bold`     | `--sl-line-height-dense`  |
| `.sl-heading-2`    | Heading/H2       | `--sl-font-size-x-large`  | `--sl-font-weight-bold`     | `--sl-line-height-dense`  |
| `.sl-heading-3`    | Heading/H3       | `--sl-font-size-large`    | `--sl-font-weight-semibold` | `--sl-line-height-dense`  |
| `.sl-heading-4`    | Heading/H4       | `--sl-font-size-medium`   | `--sl-font-weight-semibold` | `--sl-line-height-normal` |
| `.sl-heading-5`    | Heading/H5       | `--sl-font-size-small`    | `--sl-font-weight-semibold` | `--sl-line-height-dense`  |
| `.sl-body-medium`  | Body/Medium      | `--sl-font-size-medium`   | `--sl-font-weight-normal`   | `--sl-line-height-normal` |
| `.sl-body-small`   | Body/Small       | `--sl-font-size-small`    | `--sl-font-weight-normal`   | `--sl-line-height-normal` |
| `.sl-label-medium` | Label/Medium     | `--sl-font-size-small`    | `--sl-font-weight-semibold` | `--sl-line-height-dense`  |
| `.sl-label-small`  | Label/Small      | `--sl-font-size-x-small`  | `--sl-font-weight-semibold` | `--sl-line-height-dense`  |
| `.sl-caption`      | Caption          | `--sl-font-size-x-small`  | `--sl-font-weight-normal`   | `--sl-line-height-dense`  |

```html
<h2 class="sl-heading-4">Reviewer comments</h2>
<p class="sl-caption">2 reviewers</p>
```
