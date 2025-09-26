import type { AnimationElement, AnimationPreset } from '../types';

export const mockElements: AnimationElement[] = [
  {
    id: 'hero-title',
    selector: '#hero-title',
    name: 'Hero Title',
    type: 'text',
  },
  {
    id: 'hero-subtitle',
    selector: '#hero-subtitle',
    name: 'Hero Subtitle',
    type: 'text',
  },
  {
    id: 'hero-image',
    selector: '#hero-image',
    name: 'Hero Image',
    type: 'image',
  },
  {
    id: 'cta-button',
    selector: '#cta-button',
    name: 'Call to Action Button',
    type: 'button',
  },
  {
    id: 'feature-card-1',
    selector: '#feature-card-1',
    name: 'Feature Card 1',
    type: 'container',
  },
  {
    id: 'feature-card-2',
    selector: '#feature-card-2',
    name: 'Feature Card 2',
    type: 'container',
  },
  {
    id: 'feature-card-3',
    selector: '#feature-card-3',
    name: 'Feature Card 3',
    type: 'container',
  },
  {
    id: 'stats-number-1',
    selector: '#stats-number-1',
    name: 'Stats Number 1',
    type: 'text',
  },
  {
    id: 'stats-number-2',
    selector: '#stats-number-2',
    name: 'Stats Number 2',
    type: 'text',
  },
  {
    id: 'stats-number-3',
    selector: '#stats-number-3',
    name: 'Stats Number 3',
    type: 'text',
  },
];

export const animationPresets: AnimationPreset[] = [
  {
    id: 'fade-in',
    name: 'Fade In',
    type: 'fade',
    description: 'Element fades in from transparent to opaque',
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    type: 'slide',
    direction: 'up',
    description: 'Element slides up from below',
  },
  {
    id: 'slide-down',
    name: 'Slide Down',
    type: 'slide',
    direction: 'down',
    description: 'Element slides down from above',
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    type: 'slide',
    direction: 'left',
    description: 'Element slides in from the right',
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    type: 'slide',
    direction: 'right',
    description: 'Element slides in from the left',
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    type: 'scale',
    description: 'Element scales up from 0 to 1',
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    type: 'rotate',
    description: 'Element rotates in with a spin effect',
  },
  {
    id: 'stagger-up',
    name: 'Stagger Up',
    type: 'stagger',
    direction: 'up',
    description: 'Multiple elements animate with staggered timing',
  },
  {
    id: 'text-reveal',
    name: 'Text Reveal',
    type: 'text-reveal',
    description: 'Text reveals character by character',
  },
];

export const easingOptions = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Smooth' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' },
  { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Elegant' },
];
