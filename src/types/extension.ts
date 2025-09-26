// Extension messaging types
export interface ExtensionMessaging {
  getPageElements(): Promise<PageElement[]>;
  startElementSelection(): Promise<void>;
  stopElementSelection(): Promise<void>;
  animateElement(elementId: string, animation: AnimationData): Promise<void>;
  resetElement(elementId: string): Promise<void>;
}

export interface PageElement {
  id: string;
  tagName: string;
  className: string;
  textContent: string;
  selector: string;
}

export interface AnimationData {
  type: string;
  duration: number;
  delay: number;
  easing: string;
  direction?: string;
}

// Extend the Window interface
declare global {
  interface Window {
    ExtensionMessaging?: ExtensionMessaging;
  }
}
