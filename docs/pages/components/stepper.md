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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-stepper-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-stepper label="Create outgoing correspondence" current="1">
      <sl-step description="Protocol, subject, organizations">General information</sl-step>
      <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
      <sl-step description="Replies and references">Relations</sl-step>
    </sl-stepper>
  `
})
export class StepperExampleComponent {}
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

{% raw %}

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/button/button.js';
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, computed, signal } from '@angular/core';

@Component({
  selector: 'app-stepper-driving-a-wizard-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-stepper
      label="Create outgoing correspondence"
      [current]="current()"
      (sl-step-change)="handleStepChange($event)"
    >
      @for (step of steps; track step) {
        <sl-step>{{ step }}</sl-step>
      }
    </sl-stepper>

    <p style="margin-block: 1.5rem;">{{ panel() }}</p>

    <sl-button (click)="previous()">Back</sl-button>
    <sl-button variant="primary" (click)="next()">Next</sl-button>
  `
})
export class StepperDrivingAWizardExampleComponent {
  readonly steps = ['General information', 'Attachments', 'Relations'];

  /** Set `current` to the number of steps to show the whole process as complete. */
  readonly current = signal(0);

  readonly panel = computed(() =>
    this.current() === this.steps.length
      ? 'Done: the correspondence has been created.'
      : `Step ${this.current() + 1} of ${this.steps.length}`
  );

  next() {
    this.current.update(index => Math.min(index + 1, this.steps.length));
  }

  previous() {
    this.current.update(index => Math.max(index - 1, 0));
  }

  // Writing to `current` does not emit sl-step-change, but clicking a completed step does. Mirror that index
  // back into the signal so the two never drift apart.
  handleStepChange(event: Event) {
    this.current.set((event as CustomEvent<{ index: number; previousIndex: number }>).detail.index);
  }
}
```

{% endraw %}

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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-stepper-linear-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-stepper current="2" linear>
      <sl-step>Recipients</sl-step>
      <sl-step>Message</sl-step>
      <sl-step>Distribute</sl-step>
    </sl-stepper>
  `
})
export class StepperLinearExampleComponent {}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-stepper-errors-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-stepper current="2">
      <sl-step>General information</sl-step>
      <sl-step error description="Signed version missing">Attachments</sl-step>
      <sl-step>Relations</sl-step>
    </sl-stepper>
  `
})
export class StepperErrorsExampleComponent {}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-stepper-vertical-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-stepper orientation="vertical" current="1" style="max-width: 20rem;">
      <sl-step description="Protocol, subject, organizations">General information</sl-step>
      <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
      <sl-step description="Replies and references">Relations</sl-step>
      <sl-step description="Recipients and message">Distribution</sl-step>
    </sl-stepper>
  `
})
export class StepperVerticalExampleComponent {}
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

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-stepper-localization-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-stepper label="Crea corrispondenza in uscita" current="1" complete-label="Completato" error-label="Errore">
      <sl-step>Informazioni generali</sl-step>
      <sl-step>Allegati</sl-step>
      <sl-step>Relazioni</sl-step>
    </sl-stepper>
  `
})
export class StepperLocalizationExampleComponent {}
```
