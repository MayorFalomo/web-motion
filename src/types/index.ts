export interface AnimationElement {
  id: string;
  selector: string;
  name: string;
  type: 'text' | 'image' | 'button' | 'container';
}

export interface AnimationPreset {
  id: string;
  name: string;
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'stagger' | 'text-reveal';
  direction?: 'up' | 'down' | 'left' | 'right';
  description: string;
}

export interface AnimationConfig {
  id: string;
  elementId: string;
  preset: AnimationPreset;
  duration: number;
  delay: number;
  easing: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface TimelineItem {
  id: string;
  animation: AnimationConfig;
  startTime: number;
  endTime: number;
}

export interface AppState {
  selectedElements: AnimationElement[];
  animations: AnimationConfig[];
  timeline: TimelineItem[];
  isPlaying: boolean;
  currentTime: number;
}
