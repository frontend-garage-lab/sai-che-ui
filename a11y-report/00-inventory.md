# Inventario componenti — audit a11y

Generato il 2026-11-12. Base class comune: `ShoelaceElement` ([src/internal/shoelace-element.ts](../src/internal/shoelace-element.ts)) → `LitElement`. Story/docs: `docs/pages/components/<nome>.md`. Test: `src/components/<nome>/<nome>.test.ts` ("axe" = contiene `expect(el).to.be.accessible()` di @open-wc/testing).

Revisione v2 (2026-11-12): tutti i 77 report riscritti con verifica runtime, vedi [99-summary.md](99-summary.md).

Totale componenti rilevati: **77** (ricerca `ShoelaceElement.define`/`customElements.define` in `src/components/*/<nome>.ts`; esclusi 3 elementi definiti solo nei test: `dialog.test.ts`, `dropdown.test.ts`, `radio-group.test.ts`, che registrano fixture di test e non componenti del DS).

| # | Componente | tag | file | base class/mixin | story | test | Stato |
|---|---|---|---|---|---|---|---|
| 1 | alert | `sl-alert` | src/components/alert/alert.component.ts | SlAlert → ShoelaceElement + HasSlotController+LocalizeController | docs/pages/components/alert.md | sì (axe) | ☑ fatto |
| 2 | animated-image | `sl-animated-image` | src/components/animated-image/animated-image.component.ts | SlAnimatedImage → ShoelaceElement | docs/pages/components/animated-image.md | sì (axe) | ☑ fatto |
| 3 | animation | `sl-animation` | src/components/animation/animation.component.ts | SlAnimation → ShoelaceElement | docs/pages/components/animation.md | sì (axe) | ☑ fatto |
| 4 | avatar | `sl-avatar` | src/components/avatar/avatar.component.ts | SlAvatar → ShoelaceElement | docs/pages/components/avatar.md | sì (axe) | ☑ fatto |
| 5 | badge | `sl-badge` | src/components/badge/badge.component.ts | SlBadge → ShoelaceElement | docs/pages/components/badge.md | sì (axe) | ☑ fatto |
| 6 | breadcrumb-item | `sl-breadcrumb-item` | src/components/breadcrumb-item/breadcrumb-item.component.ts | SlBreadcrumbItem → ShoelaceElement + HasSlotController | docs/pages/components/breadcrumb-item.md | sì (axe) | ☑ fatto |
| 7 | breadcrumb | `sl-breadcrumb` | src/components/breadcrumb/breadcrumb.component.ts | SlBreadcrumb → ShoelaceElement + LocalizeController | docs/pages/components/breadcrumb.md | sì (axe) | ☑ fatto |
| 8 | button-group | `sl-button-group` | src/components/button-group/button-group.component.ts | SlButtonGroup → ShoelaceElement | docs/pages/components/button-group.md | sì (axe) | ☑ fatto |
| 9 | button | `sl-button` | src/components/button/button.component.ts | SlButton → ShoelaceElement + FormControlController+HasSlotController+LocalizeController | docs/pages/components/button.md | sì (axe) | ☑ fatto |
| 10 | card | `sl-card` | src/components/card/card.component.ts | SlCard → ShoelaceElement + HasSlotController | docs/pages/components/card.md | sì (axe) | ☑ fatto |
| 11 | carousel-item | `sl-carousel-item` | src/components/carousel-item/carousel-item.component.ts | SlCarouselItem → ShoelaceElement | docs/pages/components/carousel-item.md | sì (axe) | ☑ fatto |
| 12 | carousel | `sl-carousel` | src/components/carousel/carousel.component.ts | SlCarousel → ShoelaceElement + AutoplayController+LocalizeController | docs/pages/components/carousel.md | sì (axe) | ☑ fatto |
| 13 | checkbox | `sl-checkbox` | src/components/checkbox/checkbox.component.ts | SlCheckbox → ShoelaceElement + FormControlController+HasSlotController | docs/pages/components/checkbox.md | sì (axe) | ☑ fatto |
| 14 | color-picker | `sl-color-picker` | src/components/color-picker/color-picker.component.ts | SlColorPicker → ShoelaceElement + FormControlController+LocalizeController | docs/pages/components/color-picker.md | sì (no axe) | ☑ fatto |
| 15 | comment | `sl-comment` | src/components/comment/comment.component.ts | SlComment → ShoelaceElement + HasSlotController | docs/pages/components/comment.md | sì (axe) | ☑ fatto |
| 16 | copy-button | `sl-copy-button` | src/components/copy-button/copy-button.component.ts | SlCopyButton → ShoelaceElement + LocalizeController | docs/pages/components/copy-button.md | sì (axe) | ☑ fatto |
| 17 | description-list-item | `sl-description-list-item` | src/components/description-list-item/description-list-item.component.ts | SlDescriptionListItem → ShoelaceElement | — | sì (axe) | ☑ fatto |
| 18 | description-list | `sl-description-list` | src/components/description-list/description-list.component.ts | SlDescriptionList → ShoelaceElement | docs/pages/components/description-list.md | sì (axe) | ☑ fatto |
| 19 | detail-panel | `sl-detail-panel` | src/components/detail-panel/detail-panel.component.ts | SlDetailPanel → ShoelaceElement + LocalizeController | docs/pages/components/detail-panel.md | sì (axe) | ☑ fatto |
| 20 | details | `sl-details` | src/components/details/details.component.ts | SlDetails → ShoelaceElement + LocalizeController | docs/pages/components/details.md | sì (axe) | ☑ fatto |
| 21 | dialog | `sl-dialog` | src/components/dialog/dialog.component.ts | SlDialog → ShoelaceElement + HasSlotController+LocalizeController | docs/pages/components/dialog.md | sì (no axe) | ☑ fatto |
| 22 | divider | `sl-divider` | src/components/divider/divider.component.ts | SlDivider → ShoelaceElement | docs/pages/components/divider.md | sì (axe) | ☑ fatto |
| 23 | drawer | `sl-drawer` | src/components/drawer/drawer.component.ts | SlDrawer → ShoelaceElement + HasSlotController+LocalizeController | docs/pages/components/drawer.md | sì (no axe) | ☑ fatto |
| 24 | dropdown | `sl-dropdown` | src/components/dropdown/dropdown.component.ts | SlDropdown → ShoelaceElement + LocalizeController | docs/pages/components/dropdown.md | sì (no axe) | ☑ fatto |
| 25 | empty-state | `sl-empty-state` | src/components/empty-state/empty-state.component.ts | SlEmptyState → ShoelaceElement + HasSlotController | docs/pages/components/empty-state.md | sì (axe) | ☑ fatto |
| 26 | file-drop | `sl-file-drop` | src/components/file-drop/file-drop.component.ts | SlFileDrop → ShoelaceElement + HasSlotController | docs/pages/components/file-drop.md | sì (axe) | ☑ fatto |
| 27 | file-upload-item | `sl-file-upload-item` | src/components/file-upload-item/file-upload-item.component.ts | SlFileUploadItem → ShoelaceElement | docs/pages/components/file-upload-item.md | sì (axe) | ☑ fatto |
| 28 | format-bytes | `sl-format-bytes` | src/components/format-bytes/format-bytes.component.ts | SlFormatBytes → ShoelaceElement + LocalizeController | docs/pages/components/format-bytes.md | sì (no axe) | ☑ fatto |
| 29 | format-date | `sl-format-date` | src/components/format-date/format-date.component.ts | SlFormatDate → ShoelaceElement + LocalizeController | docs/pages/components/format-date.md | sì (no axe) | ☑ fatto |
| 30 | format-number | `sl-format-number` | src/components/format-number/format-number.component.ts | SlFormatNumber → ShoelaceElement + LocalizeController | docs/pages/components/format-number.md | sì (no axe) | ☑ fatto |
| 31 | header-item | `sl-header-item` | src/components/header-item/header-item.component.ts | SlHeaderItem → ShoelaceElement + HasSlotController | docs/pages/components/header-item.md | sì (axe) | ☑ fatto |
| 32 | header | `sl-header` | src/components/header/header.component.ts | SlHeader → ShoelaceElement + HasSlotController | docs/pages/components/header.md | sì (axe) | ☑ fatto |
| 33 | icon-button | `sl-icon-button` | src/components/icon-button/icon-button.component.ts | SlIconButton → ShoelaceElement | docs/pages/components/icon-button.md | sì (no axe) | ☑ fatto |
| 34 | icon | `sl-icon` | src/components/icon/icon.component.ts | SlIcon → ShoelaceElement | docs/pages/components/icon.md | sì (axe) | ☑ fatto |
| 35 | image-comparer | `sl-image-comparer` | src/components/image-comparer/image-comparer.component.ts | SlImageComparer → ShoelaceElement + LocalizeController | docs/pages/components/image-comparer.md | sì (no axe) | ☑ fatto |
| 36 | include | `sl-include` | src/components/include/include.component.ts | SlInclude → ShoelaceElement | docs/pages/components/include.md | sì (no axe) | ☑ fatto |
| 37 | input | `sl-input` | src/components/input/input.component.ts | SlInput → ShoelaceElement + FormControlController+HasSlotController+LocalizeController | docs/pages/components/input.md | sì (axe) | ☑ fatto |
| 38 | menu-item | `sl-menu-item` | src/components/menu-item/menu-item.component.ts | SlMenuItem → ShoelaceElement + HasSlotController+LocalizeController+SubmenuController | docs/pages/components/menu-item.md | sì (axe) | ☑ fatto |
| 39 | menu-label | `sl-menu-label` | src/components/menu-label/menu-label.component.ts | SlMenuLabel → ShoelaceElement | docs/pages/components/menu-label.md | sì (axe) | ☑ fatto |
| 40 | menu | `sl-menu` | src/components/menu/menu.component.ts | SlMenu → ShoelaceElement | docs/pages/components/menu.md | sì (no axe) | ☑ fatto |
| 41 | mutation-observer | `sl-mutation-observer` | src/components/mutation-observer/mutation-observer.component.ts | SlMutationObserver → ShoelaceElement | docs/pages/components/mutation-observer.md | sì (no axe) | ☑ fatto |
| 42 | option | `sl-option` | src/components/option/option.component.ts | SlOption → ShoelaceElement + LocalizeController | docs/pages/components/option.md | sì (axe) | ☑ fatto |
| 43 | popup | `sl-popup` | src/components/popup/popup.component.ts | SlPopup → ShoelaceElement + LocalizeController | docs/pages/components/popup.md | sì (no axe) | ☑ fatto |
| 44 | progress-bar | `sl-progress-bar` | src/components/progress-bar/progress-bar.component.ts | SlProgressBar → ShoelaceElement + LocalizeController | docs/pages/components/progress-bar.md | sì (axe) | ☑ fatto |
| 45 | progress-ring | `sl-progress-ring` | src/components/progress-ring/progress-ring.component.ts | SlProgressRing → ShoelaceElement + LocalizeController | docs/pages/components/progress-ring.md | sì (axe) | ☑ fatto |
| 46 | qr-code | `sl-qr-code` | src/components/qr-code/qr-code.component.ts | SlQrCode → ShoelaceElement | docs/pages/components/qr-code.md | sì (axe) | ☑ fatto |
| 47 | radio-button | `sl-radio-button` | src/components/radio-button/radio-button.component.ts | SlRadioButton → ShoelaceElement + HasSlotController | docs/pages/components/radio-button.md | sì (no axe) | ☑ fatto |
| 48 | radio-group | `sl-radio-group` | src/components/radio-group/radio-group.component.ts | SlRadioGroup → ShoelaceElement + FormControlController+HasSlotController | docs/pages/components/radio-group.md | sì (no axe) | ☑ fatto |
| 49 | radio | `sl-radio` | src/components/radio/radio.component.ts | SlRadio → ShoelaceElement | docs/pages/components/radio.md | sì (no axe) | ☑ fatto |
| 50 | range | `sl-range` | src/components/range/range.component.ts | SlRange → ShoelaceElement + FormControlController+HasSlotController+LocalizeController | docs/pages/components/range.md | sì (axe) | ☑ fatto |
| 51 | rating | `sl-rating` | src/components/rating/rating.component.ts | SlRating → ShoelaceElement + LocalizeController | docs/pages/components/rating.md | sì (axe) | ☑ fatto |
| 52 | relative-time | `sl-relative-time` | src/components/relative-time/relative-time.component.ts | SlRelativeTime → ShoelaceElement + LocalizeController | docs/pages/components/relative-time.md | sì (axe) | ☑ fatto |
| 53 | resize-observer | `sl-resize-observer` | src/components/resize-observer/resize-observer.component.ts | SlResizeObserver → ShoelaceElement | docs/pages/components/resize-observer.md | no | ☑ fatto |
| 54 | select | `sl-select` | src/components/select/select.component.ts | SlSelect → ShoelaceElement + FormControlController+HasSlotController+LocalizeController | docs/pages/components/select.md | sì (axe) | ☑ fatto |
| 55 | selectable-item | `sl-selectable-item` | src/components/selectable-item/selectable-item.component.ts | SlSelectableItem → ShoelaceElement | docs/pages/components/selectable-item.md | sì (axe) | ☑ fatto |
| 56 | sidebar-group | `sl-sidebar-group` | src/components/sidebar-group/sidebar-group.component.ts | SlSidebarGroup → ShoelaceElement | docs/pages/components/sidebar-group.md | sì (axe) | ☑ fatto |
| 57 | sidebar-item | `sl-sidebar-item` | src/components/sidebar-item/sidebar-item.component.ts | SlSidebarItem → ShoelaceElement + HasSlotController | docs/pages/components/sidebar-item.md | sì (axe) | ☑ fatto |
| 58 | sidebar | `sl-sidebar` | src/components/sidebar/sidebar.component.ts | SlSidebar → ShoelaceElement + HasSlotController | docs/pages/components/sidebar.md | sì (axe) | ☑ fatto |
| 59 | skeleton | `sl-skeleton` | src/components/skeleton/skeleton.component.ts | SlSkeleton → ShoelaceElement | docs/pages/components/skeleton.md | sì (axe) | ☑ fatto |
| 60 | spinner | `sl-spinner` | src/components/spinner/spinner.component.ts | SlSpinner → ShoelaceElement + LocalizeController | docs/pages/components/spinner.md | sì (axe) | ☑ fatto |
| 61 | split-panel | `sl-split-panel` | src/components/split-panel/split-panel.component.ts | SlSplitPanel → ShoelaceElement + LocalizeController | docs/pages/components/split-panel.md | sì (axe) | ☑ fatto |
| 62 | stat-group | `sl-stat-group` | src/components/stat-group/stat-group.component.ts | SlStatGroup → ShoelaceElement | docs/pages/components/stat-group.md | sì (axe) | ☑ fatto |
| 63 | stat | `sl-stat` | src/components/stat/stat.component.ts | SlStat → ShoelaceElement + LocalizeController | docs/pages/components/stat.md | sì (axe) | ☑ fatto |
| 64 | status | `sl-status` | src/components/status/status.component.ts | SlStatus → ShoelaceElement | docs/pages/components/status.md | sì (axe) | ☑ fatto |
| 65 | step | `sl-step` | src/components/step/step.component.ts | SlStep → ShoelaceElement | docs/pages/components/step.md | sì (no axe) | ☑ fatto |
| 66 | stepper | `sl-stepper` | src/components/stepper/stepper.component.ts | SlStepper → ShoelaceElement | docs/pages/components/stepper.md | sì (axe) | ☑ fatto |
| 67 | switch | `sl-switch` | src/components/switch/switch.component.ts | SlSwitch → ShoelaceElement + FormControlController+HasSlotController | docs/pages/components/switch.md | sì (axe) | ☑ fatto |
| 68 | tab-group | `sl-tab-group` | src/components/tab-group/tab-group.component.ts | SlTabGroup → ShoelaceElement + LocalizeController | docs/pages/components/tab-group.md | sì (axe) | ☑ fatto |
| 69 | tab-panel | `sl-tab-panel` | src/components/tab-panel/tab-panel.component.ts | SlTabPanel → ShoelaceElement | docs/pages/components/tab-panel.md | sì (axe) | ☑ fatto |
| 70 | tab | `sl-tab` | src/components/tab/tab.component.ts | SlTab → ShoelaceElement + LocalizeController | docs/pages/components/tab.md | sì (axe) | ☑ fatto |
| 71 | table | `sl-table` | src/components/table/table.component.ts | SlTable → ShoelaceElement + LocalizeController | docs/pages/components/table.md | sì (axe) | ☑ fatto |
| 72 | tag | `sl-tag` | src/components/tag/tag.component.ts | SlTag → ShoelaceElement + LocalizeController | docs/pages/components/tag.md | sì (no axe) | ☑ fatto |
| 73 | textarea | `sl-textarea` | src/components/textarea/textarea.component.ts | SlTextarea → ShoelaceElement + FormControlController+HasSlotController | docs/pages/components/textarea.md | sì (axe) | ☑ fatto |
| 74 | tooltip | `sl-tooltip` | src/components/tooltip/tooltip.component.ts | SlTooltip → ShoelaceElement + LocalizeController | docs/pages/components/tooltip.md | sì (no axe) | ☑ fatto |
| 75 | tree-item | `sl-tree-item` | src/components/tree-item/tree-item.component.ts | SlTreeItem → ShoelaceElement + LocalizeController | docs/pages/components/tree-item.md | sì (no axe) | ☑ fatto |
| 76 | tree | `sl-tree` | src/components/tree/tree.component.ts | SlTree → ShoelaceElement + LocalizeController | docs/pages/components/tree.md | sì (axe) | ☑ fatto |
| 77 | visually-hidden | `sl-visually-hidden` | src/components/visually-hidden/visually-hidden.component.ts | SlVisuallyHidden → ShoelaceElement | docs/pages/components/visually-hidden.md | sì (no axe) | ☑ fatto |
