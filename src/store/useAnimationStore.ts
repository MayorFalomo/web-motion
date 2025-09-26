import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AppState,
  AnimationConfig,
  AnimationElement,
  TimelineItem,
} from '../types';
import '../types/extension';

interface AnimationStore extends AppState {
  // Actions
  selectElement: (element: AnimationElement) => void;
  deselectElement: (elementId: string) => void;
  clearSelectedElements: () => void;
  addAnimation: (animation: AnimationConfig) => void;
  removeAnimation: (id: string) => void;
  updateAnimation: (id: string, updates: Partial<AnimationConfig>) => void;
  playAnimations: () => Promise<void>;
  resetAnimations: () => Promise<void>;
  updateTimeline: (timeline: TimelineItem[]) => void;
}

export const useAnimationStore = create<AnimationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedElements: [],
      animations: [],
      timeline: [],
      isPlaying: false,
      currentTime: 0,

      // Actions
      selectElement: (element: AnimationElement) => {
        console.log('Selecting element:', element);
        set(
          (state) => {
            // Check if element is already selected
            const isAlreadySelected = state.selectedElements.some(
              (el) => el.id === element.id
            );
            if (isAlreadySelected) {
              return state; // Don't add duplicate
            }
            return {
              selectedElements: [...state.selectedElements, element],
            };
          },
          false,
          'selectElement'
        );
      },

      deselectElement: (elementId: string) => {
        console.log('Deselecting element:', elementId);
        set(
          (state) => ({
            selectedElements: state.selectedElements.filter(
              (el) => el.id !== elementId
            ),
          }),
          false,
          'deselectElement'
        );
      },

      clearSelectedElements: () => {
        console.log('Clearing all selected elements');
        set({ selectedElements: [] }, false, 'clearSelectedElements');
      },

      addAnimation: (animation: AnimationConfig) => {
        console.log('Adding animation:', animation);
        set(
          (state) => {
            const newTimelineItem: TimelineItem = {
              id: `timeline-${animation.id}`,
              animation: animation,
              startTime: animation.delay,
              endTime: animation.delay + animation.duration,
            };
            return {
              animations: [...state.animations, animation],
              timeline: [...state.timeline, newTimelineItem],
            };
          },
          false,
          'addAnimation'
        );
      },

      removeAnimation: (id: string) => {
        set(
          (state) => ({
            animations: state.animations.filter((anim) => anim.id !== id),
            timeline: state.timeline.filter((item) => item.animation.id !== id),
          }),
          false,
          'removeAnimation'
        );
      },

      updateAnimation: (id: string, updates: Partial<AnimationConfig>) => {
        set(
          (state) => ({
            animations: state.animations.map((anim) =>
              anim.id === id ? { ...anim, ...updates } : anim
            ),
          }),
          false,
          'updateAnimation'
        );
      },

      playAnimations: async () => {
        const state = get();
        set({ isPlaying: true, currentTime: 0 }, false, 'playAnimations');

        try {
          if (window.ExtensionMessaging) {
            console.log('Playing animations state timeline', state.timeline);
            // Use timeline if available, otherwise fall back to animations
            const timelineToUse =
              state.timeline.length > 0
                ? state.timeline
                : state.animations.map((anim) => ({
                    id: `timeline-${anim.id}`,
                    animation: anim,
                    startTime: anim.delay,
                    endTime: anim.delay + anim.duration,
                  }));
            console.log('Timeline to use:', timelineToUse);

            // Sort timeline items by start time
            const sortedTimeline = [...timelineToUse].sort(
              (a, b) => a.startTime - b.startTime
            );
            console.log('Sorted timeline:', sortedTimeline);

            if (sortedTimeline.length === 0) {
              console.log('No animations to play');
              return;
            }

            // Calculate the total duration of the timeline
            const totalDuration = Math.max(
              ...sortedTimeline.map((item) => item.endTime)
            );
            console.log('Total duration:', totalDuration);
            console.log(
              'Playing timeline:',
              sortedTimeline.map((item) => ({
                element: item.animation.elementId,
                startTime: item.startTime,
                endTime: item.endTime,
                type: item.animation.preset.type,
              }))
            );

            // Play each animation at its scheduled time
            for (const timelineItem of sortedTimeline) {
              const animation = timelineItem.animation;

              // Schedule the animation to start at its timeline start time
              setTimeout(async () => {
                console.log(
                  `Playing animation for ${animation.elementId} at ${timelineItem.startTime}s`
                );
                if (window.ExtensionMessaging) {
                  await window.ExtensionMessaging.animateElement(
                    animation.elementId,
                    {
                      type: animation.preset.type,
                      duration: animation.duration,
                      delay: 0, // No additional delay since we're scheduling by timeline
                      easing: animation.easing,
                      direction: animation.preset.direction,
                    }
                  );
                }
              }, timelineItem.startTime * 1000); // Convert to milliseconds
            }

            console.log(`Timeline started, total duration: ${totalDuration}s`);
          }
        } catch (error) {
          console.error('Failed to play animations:', error);
        }
      },

      resetAnimations: async () => {
        const state = get();
        set({ isPlaying: false, currentTime: 0 }, false, 'resetAnimations');

        try {
          if (window.ExtensionMessaging) {
            for (const animation of state.animations) {
              await window.ExtensionMessaging.resetElement(animation.elementId);
            }
          }
        } catch (error) {
          console.error('Failed to reset animations:', error);
        }
      },

      updateTimeline: (timeline: TimelineItem[]) => {
        set({ timeline }, false, 'updateTimeline');
      },
    }),
    {
      name: 'animation-store', // unique name for devtools
    }
  )
);
