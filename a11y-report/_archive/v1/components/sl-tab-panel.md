## Tab Panel (`sl-tab-panel` – src/components/tab-panel/tab-panel.component.ts)
**Pattern APG di riferimento:** Tabs (elemento `tabpanel`)
**Esito sintetico:** ⚠️ Parzialmente conforme — nessun difetto rilevato nel codice (con suggerimenti); restano verifiche "NON VERIFICABILE" (vedi sezione dedicata), quindi non dichiarabile conforme finché non sono eseguite.
**Conteggio finding:** Blocker 0 · Alta 0 · Media 0 · Bassa 0 · Suggerimento 2

### Checklist
| # | Area | Esito | Note |
|---|------|-------|------|
| 1 | Semantica e ruoli | ✅ | `role="tabpanel"` sull'host (r. 38), ID generato se assente (r. 37). |
| 2 | Nome, descrizione, stato | ✅ | Nome via `aria-labelledby` impostato da `sl-tab-group` (tab-group.component.ts:330). `aria-hidden` ridondante con `display:none` (02). |
| 3 | Shadow DOM e riferimenti ARIA | ✅ | Ruolo e riferimenti sull'host light DOM. |
| 4 | Tastiera e focus | ⚠️ | Il pannello non è focusabile: APG raccomanda `tabindex="0"` quando il pannello non contiene elementi focusabili (01); il consumer può comunque aggiungerlo sull'host. |
| 5 | Form e validazione | N/A | — |
| 6 | Live region | N/A | — |
| 7 | Aspetti visivi | ✅ | Nessun colore proprio; `--padding` in rem. |
| 8 | API pubblica a11y | ✅ | `tabindex`/`aria-*` del consumer restano sull'host, che porta il ruolo: funzionano. |
| 9 | Documentazione e test | ✅ | axe statico (test r. 6-9), test su `aria-hidden` e ID (r. 11-45). |

### Findings
| ID | Severità | Area | Problema | Evidenza (file:riga/snippet) | Criterio (WCAG/APG) | Fix proposto |
|----|----------|------|----------|------------------------------|---------------------|--------------|
| SL-TAB-PANEL-01 | Suggerimento | Tastiera | Il pannello attivo non è raggiungibile con Tab se non contiene elementi focusabili (contenuto solo testo): APG prevede `tabindex="0"` sul tabpanel in questo caso. Il consumer può aggiungerlo sull'host. | tab-panel.component.ts:35-39 (nessun `tabindex`) | APG Tabs (tabpanel tabindex=0) | Opzione `focusable` o `tabindex=0` automatico sul pannello attivo se privo di tabbable; documentarlo. |
| SL-TAB-PANEL-02 | Suggerimento | Stato | `aria-hidden="true"/"false"` duplica `display:none` di `:host` / `:host([active])`; `aria-hidden="false"` è superfluo. | tab-panel.component.ts:41-44; tab-panel.styles.ts:4-12 | ARIA 1.2 (aria-hidden "false" sconsigliato) | Rimuovere `aria-hidden` (o rimuovere l'attributo quando attivo) e affidarsi a `display:none`/`hidden`. |

### API pubbliche ARIA
| Property/Attribute | Presente | Propagata correttamente | Note / Da aggiungere |
|--------------------|----------|-------------------------|----------------------|
| `aria-labelledby` | Sì (dal gruppo) | Sì | — |
| `tabindex` | Consumer sull'host | Sì | Documentare il caso pannello senza focusabili. |
| `aria-hidden` | Sì (da `active`) | Sì | Ridondante (02). |

### Fix proposti
```ts
@watch('active')
handleActiveChange() {
  this.toggleAttribute('hidden', !this.active); // al posto di aria-hidden true/false
}
```

### Non verificabile
- Annuncio del nome del pannello (da `aria-labelledby`) entrando nel contenuto con NVDA/VoiceOver.
