// Content script that runs on every webpage
console.log('Animation Builder content script loaded');

// Inject the injected script into the page (only if not already injected)
if (!document.querySelector('script[src*="injected.js"]')) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = function() {
    console.log('Injected script loaded');
  };
  (document.head || document.documentElement).appendChild(script);
} else {
  console.log('Injected script already exists');
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'startElementSelection') {
    // Send message to injected script
    window.postMessage({
      type: 'ANIMATION_BUILDER_START_SELECTION'
    }, '*');
    sendResponse({ success: true });
  } else if (request.action === 'stopElementSelection') {
    // Send message to injected script
    window.postMessage({
      type: 'ANIMATION_BUILDER_STOP_SELECTION'
    }, '*');
    sendResponse({ success: true });
  } else if (request.action === 'animateElement') {
    // Send message to injected script
    window.postMessage({
      type: 'ANIMATION_BUILDER_ANIMATE',
      elementId: request.elementId,
      animation: request.animation
    }, '*');
    sendResponse({ success: true });
  } else if (request.action === 'resetElement') {
    // Send message to injected script
    window.postMessage({
      type: 'ANIMATION_BUILDER_RESET',
      elementId: request.elementId
    }, '*');
    sendResponse({ success: true });
  } else if (request.action === 'getPageElements') {
    console.log('Getting page elements...');
    try {
      const elements = getPageElements();
      console.log('Found elements:', elements.length);
      sendResponse({ elements });
    } catch (error) {
      console.error('Error in getPageElements:', error);
      sendResponse({ elements: [] });
    }
  }
  
  return true; // Keep message channel open for async response
});

// Listen for messages from injected script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'ELEMENT_SELECTED') {
    // Forward to background script
    chrome.runtime.sendMessage({
      action: 'elementSelected',
      element: event.data.element
    });
  }
});

function getPageElements() {
  // Get all selectable elements from the page
  const elements = [];
  const selectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'div', 'section', 'article',
    'button', 'a', 'img', 'video',
    '[class*="title"]', '[class*="heading"]',
    '[class*="text"]', '[class*="content"]'
  ];
  
  selectors.forEach(selector => {
    const found = document.querySelectorAll(selector);
    found.forEach((el, index) => {
      if (el.offsetParent !== null && el.textContent?.trim()) { // Only visible elements
        elements.push({
          id: generateElementId(el),
          tagName: el.tagName,
          className: el.className,
          textContent: el.textContent?.substring(0, 50) + '...',
          selector: generateSelector(el)
        });
      }
    });
  });
  
  return elements.slice(0, 50); // Limit to 50 elements
}

function generateElementId(element) {
  // Generate a unique ID for the element
  if (element.id) return element.id;
  
  const tagName = element.tagName.toLowerCase();
  const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
  const textContent = element.textContent?.substring(0, 20).replace(/\s+/g, '-').toLowerCase() || '';
  
  return `${tagName}${className}-${textContent}-${Date.now()}`;
}

function getSafeSelector(element) {
  if (!(element instanceof Element)) return null;

  let selector = element.tagName.toLowerCase();

  // Add classes, escaping special characters
  if (element.classList.length > 0) {
    const escapedClasses = Array.from(element.classList)
      .map(cls =>
        cls
          .replace(/:/g, '\\:')   // escape colons (Tailwind variants)
          .replace(/\[/g, '\\[')  // escape [
          .replace(/\]/g, '\\]')  // escape ]
          .replace(/#/g, '\\#')   // escape # inside []
      )
      .join('.');
    selector += '.' + escapedClasses;
  }

  // Add nth-child to make it unique if necessary
  if (element.parentNode) {
    const siblings = Array.from(element.parentNode.children)
      .filter(sib => sib.tagName === element.tagName);
    if (siblings.length > 1) {
      const index = siblings.indexOf(element);
      selector += `:nth-of-type(${index + 1})`;
    }
  }

  return selector;
}

function generateSelector(element) {
  // Generate a CSS selector for the element
  if (element.id) return `#${element.id}`;
  return getSafeSelector(element);
}
