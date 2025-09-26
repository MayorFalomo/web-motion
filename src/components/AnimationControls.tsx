import React, { useState } from "react";
import { Play, Square, Plus, Settings } from "lucide-react";
import { useAnimationStore } from "../store/useAnimationStore";
import { animationPresets, easingOptions } from "../data/mockData";
import type { AnimationConfig } from "../types";
import "../types/extension";

const AnimationControls: React.FC = () => {
  const {
    selectedElements,
    animations,
    addAnimation,
    playAnimations,
    resetAnimations,
  } = useAnimationStore();
  const [selectedPreset, setSelectedPreset] = useState(animationPresets[0]);
  const [duration, setDuration] = useState(0.8);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState("ease-out");
  const [
    selectedElementForAnimation,
    setSelectedElementForAnimation,
  ] = useState<string>("");

  // const resetForm = () => {
  //   setSelectedPreset(animationPresets[0]);
  //   setDuration(0.8);
  //   setDelay(0);
  //   setEasing("ease-out");
  //   setSelectedElementForAnimation("");
  // };

  const handleAddAnimation = async () => {
    if (selectedElements.length === 0) return;

    // If a specific element is selected, add animation for that element
    if (selectedElementForAnimation) {
      const element = selectedElements.find(
        (el) => el.id === selectedElementForAnimation
      );
      if (!element) return;

      const newAnimation: AnimationConfig = {
        id: `anim-${element.id}-${Date.now()}`,
        elementId: element.id,
        preset: selectedPreset,
        duration,
        delay,
        easing,
      };

      console.log("newAnimation IF", newAnimation);

      addAnimation(newAnimation);

      // Preview the animation on the page
      try {
        if (window.ExtensionMessaging) {
          await window.ExtensionMessaging.animateElement(element.selector, {
            type: selectedPreset.type,
            duration,
            delay,
            easing,
            direction: selectedPreset.direction,
          });
        }
      } catch (error) {
        console.error("Failed to preview animation:", error);
      }

      // Reset form after adding animation for specific element
      // resetForm();
    } else {
      // If no specific element selected, add animation for all selected elements
      for (const element of selectedElements) {
        const newAnimation: AnimationConfig = {
          id: `anim-${element.id}-${Date.now()}`,
          elementId: element.id,
          preset: selectedPreset,
          duration,
          delay,
          easing,
        };

        console.log("newAnimation ELSE", newAnimation);

        addAnimation(newAnimation);
      }

      // Preview animations for all elements
      try {
        if (window.ExtensionMessaging) {
          for (const element of selectedElements) {
            console.log(element, "element");

            await window.ExtensionMessaging.animateElement(element.selector, {
              type: selectedPreset.type,
              duration,
              delay,
              easing,
              direction: selectedPreset.direction,
            });
          }
        }
      } catch (error) {
        console.error("Failed to preview animations:", error);
      }

      // Reset form after adding animations for all elements
      // resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Settings className="w-4 h-4" />
        Animation Controls
      </div>

      {/* Element Selection for Animation */}
      {selectedElements.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Animation Target
          </label>
          <select
            value={selectedElementForAnimation}
            onChange={(e) => setSelectedElementForAnimation(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
          >
            <option value="">
              Apply to all selected elements ({selectedElements.length})
            </option>
            {selectedElements.map((element) => (
              <option key={element.id} value={element.id}>
                {element.name} ({element.type})
              </option>
            ))}
          </select>
          {selectedElementForAnimation ? (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              🎯 Configuring animation for:{" "}
              {
                selectedElements.find(
                  (el) => el.id === selectedElementForAnimation
                )?.name
              }
            </div>
          ) : (
            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              ✅ Will apply animation to all {selectedElements.length} selected
              elements
            </div>
          )}
        </div>
      )}

      {/* Animation Preset */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          Animation Type
        </label>
        <select
          value={selectedPreset.id}
          onChange={(e) => {
            const preset = animationPresets.find(
              (p) => p.id === e.target.value
            );
            if (preset) setSelectedPreset(preset);
          }}
          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
        >
          {animationPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">{selectedPreset.description}</p>
      </div>

      {/* Duration Slider */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          Duration: {duration}s
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={duration}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Delay Slider */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">
          Delay: {delay}s
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={delay}
          onChange={(e) => setDelay(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setDelay(0)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            0s
          </button>
          <button
            onClick={() => setDelay(0.2)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            0.2s
          </button>
          <button
            onClick={() => setDelay(0.5)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            0.5s
          </button>
          <button
            onClick={() => setDelay(1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            1s
          </button>
        </div>
      </div>

      {/* Easing */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">Easing</label>
        <select
          value={easing}
          onChange={(e) => setEasing(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
        >
          {easingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddAnimation}
          disabled={selectedElements.length === 0}
          className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          {selectedElementForAnimation
            ? "Add Selected Element to Timeline"
            : `Add All Selected Elements (${selectedElements.length}) to Timeline`}
        </button>

        {/* {state.selectedElements.length > 0 && !selectedElementForAnimation && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Tip:</strong> Select an element above to configure its
              animation settings, then add it to the timeline. Repeat for other
              elements with different settings.
            </p>
          </div>
        )} */}

        <div className="flex gap-2">
          <button
            onClick={playAnimations}
            disabled={animations.length === 0}
            className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            Play
          </button>
          <button
            onClick={resetAnimations}
            className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Square className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Instructions for Independent Animations */}
      {selectedElements.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">
            💡 Creating Independent Animations
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <p>1. Select a specific element above to configure its animation</p>
            <p>2. Choose animation type, duration, and delay</p>
            <p>3. Click "Add Selected Element to Timeline"</p>
            <p>4. Repeat for other elements with different settings</p>
            <p className="font-medium">
              Each element will have its own animation!
            </p>
          </div>
        </div>
      )}

      {/* Current Animations Count */}
      {animations.length > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm font-medium text-gray-700">
            {animations.length} animation
            {animations.length !== 1 ? "s" : ""} in timeline
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationControls;
