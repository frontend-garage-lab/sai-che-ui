# xCPage-UserManagement — report Screenshot → HTML (2026-11-12)

## 1. Pagine

| Pagina | Screenshot | Stato |
| --- | --- | --- |
| 1-Users | main_page, users_search | filtri vuoti, empty state |
| 2-Users-SearchResult | search_result, users_search_result | 10 utenti, nessuna selezione |
| 3-Users-UserInfo | user_details | mrossi selezionato, pannello User info |
| 4-ProjectUsers | project_users | 3 gruppi di progetto |
| 5-Roles | roles | 3 ruoli |
| 6-RoleProperties-Info | role_properties | dialog, tab Info |
| 7-RoleProperties-RoleMappings | role_properties_role_mapping | dialog, tab Role mappings |
| 8-CorporateGroups | corporate_groups | 2 gruppi |

`main.png` (Administrative Tools) non ha pagina: è sostituita dal gruppo sidebar User management.

## 2. Decisioni
Vedi `DECISIONS.md` § xCPage-UserManagement.

## 4. Nuovi elementi non DS
Nessuno. La dual list delle system roles è resa con `sl-select multiple` (eventuale proposta DS: transfer list).

## 5. Scostamenti funzionali
- Starts With di Project users, Roles e Corporate groups spostato nella card Filters (richiesta dell'utente).
- Show all users tolto (regola trasversale: equivale a Reset + Search).
- Previous / Next del dialog Role properties tolti (navigazione con le tab).

## 6. Domande aperte
- Opzioni reali dei select Hierarchy (Roles) e ALL (Corporate groups): negli screenshot si vede solo il valore corrente.
- Nomi, login e indirizzi degli utenti sono oscurati negli screenshot: mock.
- Il gruppo User management va aggiunto anche alla sidebar delle pagine degli altri flussi?

## 7. Lint
`lint_html.py`: 8 file, 0 ERR (WARN: larghezze fisse del menu progetto, dei select di toolbar e del dialog, come negli altri flussi).
