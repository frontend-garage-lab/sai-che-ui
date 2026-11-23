# Notification panel — revisione 2026-11-23

Codice: `sl-notification-item` con `variant` (icona d'esito), `heading`, `project`, `section`, `read`, slot `actions`;
`sl-notification-panel` con `description`, `manual-read`, conteggio delle sole non lette, 26rem, lista 32rem.

Figma (Saipem DS, pagina Notification Panel `1745:2`), modifiche in place:

- **Notification Item**: `1745:3` → variante `State=Read` del nuovo set `1764:344` (+ `State=New` `1764:330`).
  ID delle proprietà cambiati con la combinazione (`Message#1764:4`…): override delle 6 istanze conservati.
  Rimosso Read Button. Nuove proprietà Title, Origin, Show Origin, Show Action; Icon di default `info-circle`.
- **Notification Popup** `1748:12`: 416px, Description + Show Description, Items maxHeight 512, Footer visibile con
  testo di retention, 4 item d'esempio come la pagina 1b (il 4°, Review assigned, senza azione: la lista scorre come nell'HTML). Accanto al set, colonna "Without action" (Read e New con Show Action off).
- Pagina doc: testi allineati a `notification-panel.md` / `notification-item.md`, esempio "Icons" → "Read and unread".
- Code Connect: `notification-item.figma.ts` → `node-id=1764-344`; `notification-popup.figma.ts` emette
  `description`. **Da pubblicare** (libreria + `figma connect publish`).
