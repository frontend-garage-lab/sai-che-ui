# QMIS-BidModule — report Screenshot → HTML (2026-10-29)

Source: `application_screenshot/QMIS-BidModule/` (18 screenshots, renamed after their page on 2026-10-29). Output: one page per
screenshot, numbered in time order (1-BidList … 18-ShareWithProposalManager). Shared data in `data.js`.

## Job

Bid owner creates a bid, attaches technical/commercial documents, sends it for approval; technical and commercial
approvers approve from their task list; the owner shares the approved bid with the proposal manager.

## Functional changes vs legacy

- Toolbar: 4 buttons + "More" (Print notice, Send notice) + Delete last, per DECISIONS "Più di 5 azioni".
- Row menu "Actions… ›" submenu flattened into an "Approval" group; "Share with proposal manager" added to the
  admin group (legacy entry point of screen 18 is not in the screenshots: assumption).
- Add bid validation: the legacy red fields become one `sl-alert danger` listing the 5 required fields.
- Client toggle next to Client → `sl-switch` "Client from CRM" (meaning inferred from Include CRM: to confirm).
- Proposal manager select + search button → read-only input + "Choose user".
- "Send Mail" → "Send email".

## New elements outside the DS

None.

## States to design (not in the screenshots)

Development, Post, Approval history, Revision history tabs (empty panels); Legend opened from the dialog; field-level
errors of the Add form; Force approval.

## Open questions

- Meaning of the Client toggle; entry point of "Share with proposal manager".
- Hidden values in screen 16 (row "test commercial n…": entity and bid number) are "—".

## Revision 2 (2026-10-29, user feedback)

- Row menu: the legacy opens it with a right click on the row; here it opens from the ⋮ button of the row
  (`sl-table` actions column), as in every flow. No context menu on right click.
- Bid form (Add / Edit) in sections: General · Client and project · Organization · Activity and dates · Bid team; View
  uses the same sections with `sl-description-list cols="3"`.
- Approval details and Send for approval: Technical and Commercial side by side (6/6), each with its status.
- Details panel of a selected bid: title + bid number · client, key data, Approval (documents, owners, technical,
  commercial as `sl-status`), Attachments with counter.

## Revision 3 (2026-10-30): screens 19–23

- 19-ReturnToWorking, 20-ForceApproval: confirmations as `sl-dialog variant="warning"` (new DS variant, DECISIONS
  "Dialog di conferma / esito"); Yes/No and Ok/Cancel → Cancel + verb ("Return to working", "Force approval").
- 21-CreateNewRevision: bid number as description list, required "Revision reason" `sl-textarea`; OK → "Create revision".
- 22/23: same View dialog as screen 9 (revision 02, Working) with the Approval history (`sl-switch` "All revisions" in
  the table toolbar) and Revision history (`selection="single"`, "View revision", pagination) tabs. Revision status
  "Superseded" added to `STATUS_VARIANT` as neutral.
- Action types in sentence case; values truncated in the legacy kept with "…".

### Open questions

- Screens 19–20 name 2026-BID-000003 in the dialog text, but the approval history (screen 22) records Return to
  working and Force approval on 2026-BID-000004: the pages use 2026-BID-000004. To confirm.
- After Force approval, Technical / Commercial show "—" (skipped): no legacy screen shows the panel in that state.
