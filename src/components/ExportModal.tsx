import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { useAnimationStore } from "../store/useAnimationStore";
import type { AnimationConfig } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { animations } = useAnimationStore();
  const [exportFormat, setExportFormat] = useState<"framer-motion" | "gsap">(
    "framer-motion"
  );
  const [copied, setCopied] = useState(false);

  const generateFramerMotionCode = () => {
    if (animations.length === 0) return "// No animations to export";

    const imports = `import { motion } from 'framer-motion';`;
    const components = animations
      .map((animation: AnimationConfig) => {
        const element = animation.elementId;
        const preset = animation.preset;

        let variants = "";
        let initial = "";
        let animate = "";

        switch (preset.type) {
          case "fade": {
            variants = `const ${element}Variants = {
   hidden: { opacity: 0 },
   visible: { opacity: 1 }
 };`;
            initial = "hidden";
            animate = "visible";
            break;
          }
          case "slide": {
            const direction = preset.direction || "up";
            const slideProps = {
              up: { y: 50, x: 0 },
              down: { y: -50, x: 0 },
              left: { x: 50, y: 0 },
              right: { x: -50, y: 0 },
            };
            const slideProp = slideProps[direction as keyof typeof slideProps];
            const propKey = Object.keys(slideProp)[0] as keyof typeof slideProp;
            variants = `const ${element}Variants = {
   hidden: { opacity: 0, ${String(propKey)}: ${slideProp[propKey]} },
   visible: { opacity: 1, ${String(propKey)}: 0 }
 };`;
            initial = "hidden";
            animate = "visible";
            break;
          }
          case "scale": {
            variants = `const ${element}Variants = {
   hidden: { opacity: 0, scale: 0 },
   visible: { opacity: 1, scale: 1 }
 };`;
            initial = "hidden";
            animate = "visible";
            break;
          }
          case "rotate": {
            variants = `const ${element}Variants = {
   hidden: { opacity: 0, rotate: -180 },
   visible: { opacity: 1, rotate: 0 }
 };`;
            initial = "hidden";
            animate = "visible";
            break;
          }
          default: {
            variants = `const ${element}Variants = {
   hidden: { opacity: 0 },
   visible: { opacity: 1 }
 };`;
            initial = "hidden";
            animate = "visible";
          }
        }

        return `${variants}

<motion.div
  id="${element}"
  variants={${element}Variants}
  initial="${initial}"
  animate="${animate}"
  transition={{
    duration: ${animation.duration},
    delay: ${animation.delay},
    ease: "${animation.easing}"
  }}
>
  {/* Your content here */}
</motion.div>`;
      })
      .join("\n\n");

    return `${imports}

${components}`;
  };

  const generateGSAPCode = () => {
    if (animations.length === 0) return "// No animations to export";

    const imports = `import { gsap } from 'gsap';`;
    const timeline = `const tl = gsap.timeline();

${animations
  .map((animation: AnimationConfig) => {
    const element = animation.elementId;
    const preset = animation.preset;

    let animationProps = "";

    switch (preset.type) {
      case "fade": {
        animationProps = `opacity: 0`;
        break;
      }
      case "slide": {
        const direction = preset.direction || "up";
        const slideProps = {
          up: "y: 50",
          down: "y: -50",
          left: "x: 50",
          right: "x: -50",
        };
        animationProps = `opacity: 0, ${
          slideProps[direction as keyof typeof slideProps]
        }`;
        break;
      }
      case "scale": {
        animationProps = `opacity: 0, scale: 0`;
        break;
      }
      case "rotate": {
        animationProps = `opacity: 0, rotation: -180`;
        break;
      }
      default: {
        animationProps = `opacity: 0`;
      }
    }

    return `tl.to("#${element}", {
  ${animationProps}
}, ${animation.delay})
.to("#${element}", {
  opacity: 1,
  ${
    preset.type === "slide"
      ? preset.direction === "up" || preset.direction === "down"
        ? "y: 0"
        : "x: 0"
      : ""
  }
  ${preset.type === "scale" ? "scale: 1" : ""}
  ${preset.type === "rotate" ? "rotation: 0" : ""}
  duration: ${animation.duration},
  ease: "${animation.easing}"
});`;
  })
  .join("\n")}

// Play the timeline
tl.play();`;

    return `${imports}

${timeline}`;
  };

  const getGeneratedCode = () => {
    return exportFormat === "framer-motion"
      ? generateFramerMotionCode()
      : generateGSAPCode();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getGeneratedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Export Animation Code
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setExportFormat("framer-motion")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                exportFormat === "framer-motion"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Framer Motion
            </button>
            <button
              onClick={() => setExportFormat("gsap")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                exportFormat === "gsap"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              GSAP
            </button>
          </div>

          {/* Code Display */}
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-96">
              <code>{getGeneratedCode()}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Copy the generated code above</li>
              <li>
                Install the required library:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {exportFormat === "framer-motion"
                    ? "npm install framer-motion"
                    : "npm install gsap"}
                </code>
              </li>
              <li>
                Replace the element IDs with your actual element selectors
              </li>
              <li>Customize the content inside the motion components</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
