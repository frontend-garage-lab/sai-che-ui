// url=https://www.figma.com/design/CdCRuuAnOeYrOOn1HYkxDM/Saipem-DS?node-id=70-2
// source=src/components/carousel/carousel.component.ts
// component=SlCarousel
import figma from 'figma';
const instance = figma.selectedInstance;

export default {
  example: figma.html`<sl-carousel navigation pagination>
  <sl-carousel-item><!-- slide 1 --></sl-carousel-item>
  <sl-carousel-item><!-- slide 2 --></sl-carousel-item>
  <sl-carousel-item><!-- slide 3 --></sl-carousel-item>
  <sl-carousel-item><!-- slide 4 --></sl-carousel-item>
</sl-carousel>`,
  imports: [
    "import 'src/components/carousel/carousel.js'",
    "import 'src/components/carousel-item/carousel-item.js'"
  ],
  id: 'carousel',
  metadata: { nestable: false }
};
