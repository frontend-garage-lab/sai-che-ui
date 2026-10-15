// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=847-44
// source=src/components/stepper/stepper.component.ts
// component=SlStepper
import figma from 'figma';
const instance = figma.selectedInstance;

// The Stepper is a row of real "Step" instances; render each one through its own Code Connect template,
// interpolated individually (not .map().join()), as the Tab Group, Dropdown and Stat Group mappings do.
const steps = instance.findConnectedInstances(() => true);
const step1 = steps[0] && steps[0].type === 'INSTANCE' ? steps[0].executeTemplate().example : '';
const step2 = steps[1] && steps[1].type === 'INSTANCE' ? steps[1].executeTemplate().example : '';
const step3 = steps[2] && steps[2].type === 'INSTANCE' ? steps[2].executeTemplate().example : '';
const step4 = steps[3] && steps[3].type === 'INSTANCE' ? steps[3].executeTemplate().example : '';
const step5 = steps[4] && steps[4].type === 'INSTANCE' ? steps[4].executeTemplate().example : '';
const step6 = steps[5] && steps[5].type === 'INSTANCE' ? steps[5].executeTemplate().example : '';

// `current` is the zero-based index of the step in State=current; the steps before it are complete. When no step is
// current (every step complete) it equals the number of steps, which shows the whole process as complete.
const states = steps.map(step =>
  step.type === 'INSTANCE'
    ? step.getEnum('State', { complete: 'complete', current: 'current', upcoming: 'upcoming', disabled: 'disabled' })
    : 'upcoming'
);
const currentIndex = states.indexOf('current');
const current = currentIndex >= 0 ? currentIndex : states.every(state => state === 'complete') ? states.length : 0;

export default {
  // `label` names the process for screen readers and is not drawn, so it has no Figma layer.
  example: figma.html`<sl-stepper label="Steps" current="${current}">
  ${step1}
  ${step2}
  ${step3}
  ${step4}
  ${step5}
  ${step6}
</sl-stepper>`,
  imports: ["import 'src/components/stepper/stepper.js'", "import 'src/components/step/step.js'"],
  id: 'stepper',
  metadata: { nestable: false }
};
