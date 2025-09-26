import React from "react";
import { ChevronDown, Target } from "lucide-react";
import { useAnimationStore } from "../store/useAnimationStore";

interface PageElement {
  id: string;
  tagName: string;
  className: string;
  textContent: string;
  selector: string;
}

interface ElementSelectorProps {
  pageElements: PageElement[];
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ pageElements }) => {
  const {
    selectedElements,
    selectElement,
    deselectElement,
  } = useAnimationStore();

  const handleElementSelect = (elementId: string) => {
    const element = pageElements.find((el) => el.id === elementId);
    if (element) {
      // Convert page element to animation element format
      const animationElement = {
        id: element.id,
        selector: element.selector,
        name: `${element.tagName} - ${element.textContent}`,
        type: getElementType(element.tagName),
      };
      selectElement(animationElement);
    }
  };

  const getElementType = (
    tagName: string
  ): "text" | "image" | "button" | "container" => {
    switch (tagName.toLowerCase()) {
      case "img":
      case "video":
        return "image";
      case "button":
      case "a":
        return "button";
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
      case "p":
      case "span":
        return "text";
      default:
        return "container";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Target className="w-4 h-4" />
        Select Element
      </div>

      <div className="relative">
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleElementSelect(e.target.value);
              e.target.value = ""; // Reset selection
            }
          }}
          className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="">Choose an element from the page...</option>
          {pageElements
            .filter(
              (element) =>
                !selectedElements.some((selected) => selected.id === element.id)
            )
            .map((element) => (
              <option key={element.id} value={element.id}>
                {element.tagName} - {element.textContent}
              </option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {selectedElements.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600">
            Selected Elements ({selectedElements.length}):
          </div>
          {selectedElements.map((element) => (
            <div
              key={element.id}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">
                    {element.name}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Selector: {element.selector}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Type: {element.type}
                  </div>
                </div>
                <button
                  onClick={() => deselectElement(element.id)}
                  className="ml-2 p-1 text-blue-500 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pageElements.length === 0 && (
        <div className="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Target className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No elements found</p>
          <p className="text-xs">Click "Refresh Elements" to scan the page</p>
        </div>
      )}
    </div>
  );
};

export default ElementSelector;
