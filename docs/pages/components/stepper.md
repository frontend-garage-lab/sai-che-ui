---
meta:
  title: Stepper
  description: Steppers show where the user is in a multi-step process.
layout: component
---

Steppers hold a list of [steps](/components/step). Set `current` to the zero-based index of the step the user is on;
the steps before it are shown as complete.

```html:preview
<sl-stepper label="Create outgoing correspondence" current="1">
  <sl-step description="Protocol, subject, organizations">General information</sl-step>
  <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
  <sl-step description="Replies and references">Relations</sl-step>
</sl-stepper>
```

## Examples

### Driving a wizard

Call `next()` and `previous()` from your wizard's buttons. Users can also go back by clicking a completed step. Both
emit `sl-step-change`, so you only need one listener to show the right panel.

```html:preview
<div class="stepper-wizard">
  <sl-stepper label="Create outgoing correspondence">
    <sl-step>General information</sl-step>
    <sl-step>Attachments</sl-step>
    <sl-step>Relations</sl-step>
  </sl-stepper>

  <p class="stepper-wizard__panel" style="margin-block: 1.5rem;">Step 1 of 3</p>

  <sl-button class="stepper-wizard__back">Back</sl-button>
  <sl-button class="stepper-wizard__next" variant="primary">Next</sl-button>
</div>

<script>
  const wizard = document.querySelector('.stepper-wizard');
  const stepper = wizard.querySelector('sl-stepper');
  const panel = wizard.querySelector('.stepper-wizard__panel');
  const total = stepper.getSteps().length;

  wizard.querySelector('.stepper-wizard__back').addEventListener('click', () => stepper.previous());
  wizard.querySelector('.stepper-wizard__next').addEventListener('click', () => stepper.next());

  stepper.addEventListener('sl-step-change', event => {
    const { index } = event.detail;
    panel.textContent = index === total ? 'Done: the correspondence has been created.' : `Step ${index + 1} of ${total}`;
  });
</script>
```

:::tip
Set `current` to the number of steps to show the whole process as complete.
:::

### Linear

Add `linear` when users must not jump back, e.g. once a distribution has been sent.

```html:preview
<sl-stepper current="2" linear>
  <sl-step>Recipients</sl-step>
  <sl-step>Message</sl-step>
  <sl-step>Distribute</sl-step>
</sl-stepper>
```

### Errors

Add `error` to a step when the part of the form it represents has a problem. Its indicator switches to an error mark
and screen readers announce the error after the label.

```html:preview
<sl-stepper current="2">
  <sl-step>General information</sl-step>
  <sl-step error description="Signed version missing">Attachments</sl-step>
  <sl-step>Relations</sl-step>
</sl-stepper>
```

### Vertical

Use `orientation="vertical"` in narrow places such as a drawer or a side panel.

```html:preview
<sl-stepper orientation="vertical" current="1" style="max-width: 20rem;">
  <sl-step description="Protocol, subject, organizations">General information</sl-step>
  <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
  <sl-step description="Replies and references">Relations</sl-step>
  <sl-step description="Recipients and message">Distribution</sl-step>
</sl-stepper>
```

### Localization

The stepper announces "Completed" and "Error" after the relevant labels. Set `complete-label` and `error-label` to
translate them.

```html:preview
<sl-stepper label="Crea corrispondenza in uscita" current="1" complete-label="Completato" error-label="Errore">
  <sl-step>Informazioni generali</sl-step>
  <sl-step>Allegati</sl-step>
  <sl-step>Relazioni</sl-step>
</sl-stepper>
```
