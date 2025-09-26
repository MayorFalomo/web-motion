import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize the React app in the popup
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// Chrome extension messaging
class ExtensionMessaging {
  static async sendMessage(message: any) {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage(message, resolve);
    });
  }

  static async getCurrentTab() {
    return new Promise((resolve) => {
      (window as any).chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs: any) => {
          resolve(tabs[0]);
        }
      );
    });
  }

  static async startElementSelection() {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage(
        { action: "startElementSelection" },
        (response: any) => {
          if ((window as any).chrome.runtime.lastError) {
            console.error(
              "Error starting element selection:",
              (window as any).chrome.runtime.lastError
            );
            resolve({ success: false });
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  static async stopElementSelection() {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage(
        { action: "stopElementSelection" },
        (response: any) => {
          if ((window as any).chrome.runtime.lastError) {
            console.error(
              "Error stopping element selection:",
              (window as any).chrome.runtime.lastError
            );
            resolve({ success: false });
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  static async animateElement(elementId: string, animation: any) {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage(
        { action: "animateElement", elementId, animation },
        (response: any) => {
          if ((window as any).chrome.runtime.lastError) {
            console.error(
              "Error animating element:",
              (window as any).chrome.runtime.lastError
            );
            resolve({ success: false });
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  static async resetElement(elementId: string) {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage(
        { action: "resetElement", elementId },
        (response: any) => {
          if ((window as any).chrome.runtime.lastError) {
            console.error(
              "Error resetting element:",
              (window as any).chrome.runtime.lastError
            );
            resolve({ success: false });
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  static async getPageElements() {
    return new Promise((resolve) => {
      (window as any).chrome.runtime.sendMessage(
        { action: "getPageElements" },
        (response: any) => {
          if ((window as any).chrome.runtime.lastError) {
            console.error(
              "Error getting page elements:",
              (window as any).chrome.runtime.lastError
            );
            resolve([]);
          } else {
            resolve(response?.elements || []);
          }
        }
      );
    });
  }
}

// Make ExtensionMessaging available globally
(window as any).ExtensionMessaging = ExtensionMessaging;

// Listen for messages from content script
(window as any).chrome.runtime.onMessage.addListener(
  (request: any, _sender: any, _sendResponse: any) => {
    if (request.action === "elementSelected") {
      // Handle element selection
      window.dispatchEvent(
        new CustomEvent("elementSelected", {
          detail: request.element,
        })
      );
    }
  }
);
