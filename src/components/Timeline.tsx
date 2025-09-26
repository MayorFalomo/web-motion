import React, { useState } from "react";
import { Clock, Trash2, Edit2 } from "lucide-react";
import { useAnimationStore } from "../store/useAnimationStore";
import { animationPresets, easingOptions } from "../data/mockData";
import type { AnimationConfig } from "../types";

const Timeline: React.FC = () => {
  const {
    selectedElements,
    animations,
    removeAnimation,
    updateAnimation,
  } = useAnimationStore();
  const [editingAnimation, setEditingAnimation] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AnimationConfig>>({});

  const getTotalDuration = () => {
    if (animations.length === 0) return 0;
    return Math.max(...animations.map((anim) => anim.delay + anim.duration));
  };

  const totalDuration = getTotalDuration();

  const startEditing = (animation: AnimationConfig) => {
    setEditingAnimation(animation.id);
    setEditForm({
      preset: animation.preset,
      duration: animation.duration,
      delay: animation.delay,
      easing: animation.easing,
    });
  };

  const saveEdit = () => {
    if (editingAnimation && editForm.preset) {
      updateAnimation(editingAnimation, {
        preset: editForm.preset,
        duration: editForm.duration || 0.8,
        delay: editForm.delay || 0,
        easing: editForm.easing || "ease-out",
      });
      setEditingAnimation(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingAnimation(null);
    setEditForm({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Clock className="w-4 h-4" />
        Timeline
      </div>

      {animations.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No animations added yet</p>
          <p className="text-xs">
            Select an element and add animations to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Timeline Header */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>0s</span>
            <span>{totalDuration.toFixed(1)}s</span>
          </div>

          {/* Timeline Track */}
          <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
            {/* Time markers */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => (
                <div key={i} className="flex-1 border-r border-gray-200">
                  <div className="text-xs text-gray-400 mt-1 ml-1">{i}s</div>
                </div>
              ))}
            </div>

            {/* Animation blocks */}
            {animations.map((animation) => {
              const startPercent = (animation.delay / totalDuration) * 100;
              const widthPercent = (animation.duration / totalDuration) * 100;

              // Find the element name for this animation
              const element = selectedElements.find(
                (el) => el.id === animation.elementId
              );
              const elementName = element ? element.name : animation.elementId;

              return (
                <div
                  key={animation.id}
                  className="absolute top-2 h-12 bg-blue-500 rounded flex items-center justify-between px-2 text-white text-xs font-medium"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                    minWidth: "60px",
                  }}
                >
                  <div className="truncate">
                    <div className="font-semibold">{animation.preset.name}</div>
                    <div className="text-xs opacity-75">{elementName}</div>
                  </div>
                  <button
                    onClick={() => removeAnimation(animation.id)}
                    className="ml-2 p-1 hover:bg-blue-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Animation Details */}
          <div className="space-y-2">
            {animations.map((animation) => {
              // Find the element name for this animation
              const element = selectedElements.find(
                (el) => el.id === animation.elementId
              );
              const elementName = element ? element.name : animation.elementId;
              const isEditing = editingAnimation === animation.id;

              return (
                <div
                  key={animation.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  {isEditing ? (
                    // Edit Form
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-900">
                        Editing: {elementName}
                      </div>

                      {/* Animation Type */}
                      <div>
                        <label className="text-xs font-medium text-gray-600">
                          Animation Type
                        </label>
                        <select
                          value={editForm.preset?.id || ""}
                          onChange={(e) => {
                            const preset = animationPresets.find(
                              (p) => p.id === e.target.value
                            );
                            if (preset) {
                              setEditForm({ ...editForm, preset });
                            }
                          }}
                          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {animationPresets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="text-xs font-medium text-gray-600">
                          Duration: {editForm.duration}s
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={editForm.duration || 0.8}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              duration: parseFloat(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Delay */}
                      <div>
                        <label className="text-xs font-medium text-gray-600">
                          Delay: {editForm.delay}s
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={editForm.delay || 0}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              delay: parseFloat(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Easing */}
                      <div>
                        <label className="text-xs font-medium text-gray-600">
                          Easing
                        </label>
                        <select
                          value={editForm.easing || "ease-out"}
                          onChange={(e) =>
                            setEditForm({ ...editForm, easing: e.target.value })
                          }
                          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {easingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {animation.preset.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Element: {elementName} • Duration:{" "}
                          {animation.duration}s • Delay: {animation.delay}s
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Easing: {animation.easing}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(animation)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Edit animation"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeAnimation(animation.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove animation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
