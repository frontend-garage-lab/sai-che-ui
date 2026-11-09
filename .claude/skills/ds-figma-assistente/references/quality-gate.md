# Quality gate

Per ogni gate registra esito ed evidenza: percorso:riga, URL del nodo, screenshot o proprietà letta. Se manca un dato
l'esito è `NON VERIFICABILE`, mai `PASS` per deduzione.

## Componenti (G01–G12)

| Gate | Cosa verificare | Esempio di FAIL |
| --- | --- | --- |
| G01 Identità | corrispondenza 1→1 tra tag e master con node-id; distinguere set, varianti, istanze, frame | solo un frame, oppure due master omonimi |
| G02 Fedeltà visiva | stesso stato, tema, viewport, font: misure, padding, bordi, ombre, icone, colori | altezza del bottone diversa |
| G03 Modificabilità | testi e vettori editabili, non raster | testo convertito in immagine |
| G04 Varianti | proprietà coerenti con l'API del codice, solo se esistono nel codice | stati mancanti o inventati |
| G05 Proprietà e slot | testo, boolean, instance swap e slot configurabili | label fissa, slot assente |
| G06 Layout | auto-layout e hug/fill coerenti col comportamento del browser | dimensione fissa che taglia il testo |
| G07 Token | variabili Figma = custom property CSS, binding al posto di valori fissi | `#123456` al posto del token |
| G08 Tipografia e asset | font, peso, line-height, SVG esatti | font di fallback con a capo diverso |
| G09 Accessibilità | contrasto, focus visibile | focus invisibile |
| G10 Code Connect | template valido, nodo giusto, proprietà e attributi corretti, stato del publish separato | binding a un attributo inesistente |
| G11 Sicurezza del riuso | master già usati: id e proprietà in uso preservati | proposta di eliminare un master con istanze |
| G12 Copertura | stati e varianti ispezionati rispetto a quelli esistenti | "tutto ok" verificando solo il default |

## Release (R01–R08)

| Gate | Prima di dichiarare completato | Blocca se |
| --- | --- | --- |
| R01 Provenienza | file A e B identificati e distinti | modifica nel file sbagliato |
| R02 Richieste | annotazioni pertinenti catalogate o `QUESTION` | annotazioni non lette dichiarate risolte |
| R03 Qualità | G01–G12 sugli asset in release, nessun P0 | componenti frame, proprietà rotte |
| R04 Compatibilità | node-id, key, varianti, contratto proprietà misurati | delete + create senza piano |
| R05 Publish | asset pubblicati in modo verificabile | "pronto per il publish" dichiarato "pubblicato" |
| R06 Consumer | B usa istanze vere importate e aggiornate | cloni locali spacciati per istanze |
| R07 Override e annotazioni | override, annidamenti, testi, pin preservati | detach o swap senza rilettura |
| R08 Chiusura e Code Connect | richieste verificate nel target; stato del publish di Code Connect riportato a parte | template solo locale dichiarato pubblicato |

R05 o R06 `UNVERIFIED` impediscono lo stato `READY`.

## Confronto visivo

1. Nel browser: stessa variante esposta in Figma; aspetta font, `updateComplete` e asset. Annota dimensione e DPR.
2. In Figma: screenshot del solo nodo, non della pagina intera.
3. Allinea dimensioni e ritaglio a mano, senza ridimensionamenti automatici che nascondono i difetti.
4. Anti-aliasing e font creano falsi positivi: guarda le regioni, non solo le percentuali.
5. Verifica testo lungo, viewport stretta e stati non di default.
