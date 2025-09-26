import { useState, useEffect, useCallback } from "react";
import { Download, Play, Target, Eye } from "lucide-react";
import { useAnimationStore } from "./store/useAnimationStore";
import ElementSelector from "./components/ElementSelector";
import AnimationControls from "./components/AnimationControls";
import Timeline from "./components/Timeline";
import ExportModal from "./components/ExportModal";
import type { PageElement } from "./types/extension";
import "./types/extension";

function AppContent() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [pageElements, setPageElements] = useState<PageElement[]>([]);
  const {
    selectedElements,
    selectElement,
    deselectElement,
    clearSelectedElements,
    playAnimations,
    resetAnimations,
  } = useAnimationStore();

  useEffect(() => {
    // Load page elements when popup opens
    loadPageElements();

    // Listen for element selection events
    const handleElementSelected = (event: any) => {
      const element = event.detail;
      console.log("Element selected:", element);

      // Convert PageElement to AnimationElement and select it
      const animationElement = {
        id: element.id,
        selector: element.selector,
        name: element.textContent || element.tagName,
        type: getElementType(element.tagName),
      };

      selectElement(animationElement);
      setIsSelecting(false); // Stop selection mode
    };

    window.addEventListener("elementSelected", handleElementSelected);

    return () => {
      window.removeEventListener("elementSelected", handleElementSelected);
    };
  }, []);

  const getElementType = useCallback((tagName: string):
    | "text"
    | "image"
    | "button"
    | "container" => {
    switch (tagName.toLowerCase()) {
      case "img":
        return "image";
      case "button":
        return "button";
      case "div":
      case "section":
      case "article":
        return "container";
      default:
        return "text";
    }
  }, []);

  const loadPageElements = useCallback(async () => {
    try {
      if (window.ExtensionMessaging) {
        const elements = await window.ExtensionMessaging.getPageElements();
        setPageElements(elements);
      }
    } catch (error) {
      console.error("Failed to load page elements:", error);
    }
  }, []);

  const startElementSelection = useCallback(async () => {
    try {
      if (window.ExtensionMessaging) {
        await window.ExtensionMessaging.startElementSelection();
        setIsSelecting(true);
        // Notify popup that we're in selection mode
        window.postMessage(
          { type: "SELECTION_STATE_CHANGED", isSelecting: true },
          "*"
        );
      }
    } catch (error) {
      console.error("Failed to start element selection:", error);
    }
  }, []);

  const stopElementSelection = useCallback(async () => {
    try {
      if (window.ExtensionMessaging) {
        await window.ExtensionMessaging.stopElementSelection();
        setIsSelecting(false);
        // Notify popup that we're no longer in selection mode
        window.postMessage(
          { type: "SELECTION_STATE_CHANGED", isSelecting: false },
          "*"
        );
      }
    } catch (error) {
      console.error("Failed to stop element selection:", error);
    }
  }, []);

  const handlePlayAnimations = useCallback(async () => {
    try {
      playAnimations();
    } catch (error) {
      console.error("Failed to play animations:", error);
    }
  }, [playAnimations]);

  const handleResetAnimations = useCallback(async () => {
    try {
      resetAnimations();
    } catch (error) {
      console.error("Failed to reset animations:", error);
    }
  }, [resetAnimations]);

  return (
    <div className="w-full contain min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                Animation Builder
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePlayAnimations}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/80 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all duration-200 border border-white/20"
              >
                <Play className="w-4 h-4" />
                Play
              </button>
              <button
                onClick={handleResetAnimations}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200 border border-white/20"
              >
                Reset
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/20"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Element Selection */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Element Selection
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={isSelecting ? stopElementSelection : startElementSelection}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
              isSelecting
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transform hover:scale-105"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105"
            }`}
          >
            <Target className="w-5 h-5" />
            {isSelecting ? "Stop Selection" : "Select Element"}
          </button>

          <button
            onClick={loadPageElements}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl text-sm font-semibold hover:from-gray-600 hover:to-slate-600 transition-all duration-200 shadow-md transform hover:scale-105"
          >
            <Eye className="w-5 h-5" />
            Refresh Elements
          </button>
        </div>

        {isSelecting && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700 font-medium">
              🎯 Click on any element on the webpage to select it
            </p>
          </div>
        )}

        {selectedElements.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-700 font-medium">
                ✅ Selected Elements ({selectedElements.length})
              </p>
              <button
                onClick={clearSelectedElements}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-1">
              {selectedElements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-2"
                >
                  <span className="text-xs text-green-600">
                    {element.name} ({element.type})
                  </span>
                  <button
                    onClick={() => deselectElement(element.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <ElementSelector pageElements={pageElements} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <AnimationControls />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <Timeline />
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
