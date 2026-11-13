---
meta:
  title: Step
  description: Steps are the individual stages of a stepper.
layout: component
---

Steps go in a [stepper](/components/stepper), which works out whether each one is complete, current or upcoming from
its `current` index. Put the label in the default slot and an optional one-line `description` under it.

```html:preview
<sl-stepper current="1">
  <sl-step description="Protocol, subject, organizations">General information</sl-step>
  <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
  <sl-step disabled description="Not available for incoming">Relations</sl-step>
</sl-stepper>
```

```ts:angular
import '@saipem/design-system/%NPMDIR%/components/step/step.js';
import '@saipem/design-system/%NPMDIR%/components/stepper/stepper.js';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-step-example',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sl-stepper current="1">
      <sl-step description="Protocol, subject, organizations">General information</sl-step>
      <sl-step description="Letters, drawings, annexes">Attachments</sl-step>
      <sl-step disabled description="Not available for incoming">Relations</sl-step>
    </sl-stepper>
  `
})
export class StepExampleComponent {}
```
