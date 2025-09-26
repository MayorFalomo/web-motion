// Injected script that runs in the page context
(function() {
  'use strict';
  
  let isSelecting = false;
  let selectedElement = null;
  let originalStyles = new Map();
  
  // Listen for messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    const { type, elementId, animation } = event.data;
    
    switch (type) {
      case 'ANIMATION_BUILDER_START_SELECTION':
        startElementSelection();
        break;
      case 'ANIMATION_BUILDER_STOP_SELECTION':
        stopElementSelection();
        break;
      case 'ANIMATION_BUILDER_ANIMATE':
        animateElement(elementId, animation);
        break;
      case 'ANIMATION_BUILDER_RESET':
        resetElement(elementId);
        break;
    }
  });
  
  function startElementSelection() {
    isSelecting = true;
    document.body.style.cursor = 'crosshair';
    
    // Add event listeners
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleElementClick, true);
    
    // Add selection overlay
    const overlay = document.createElement('div');
    overlay.id = 'animation-builder-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(59, 130, 246, 0.1);
      pointer-events: none;
      z-index: 999999;
      display: none;
      border: 2px solid #3b82f6;
      border-radius: 4px;
    `;
    document.body.appendChild(overlay);
  }
  
  function stopElementSelection() {
    isSelecting = false;
    document.body.style.cursor = '';
    
    document.removeEventListener('mouseover', handleMouseOver, true);
    document.removeEventListener('mouseout', handleMouseOut, true);
    document.removeEventListener('click', handleElementClick, true);
    
    const overlay = document.getElementById('animation-builder-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Remove all highlights
    document.querySelectorAll('.animation-builder-highlight').forEach(el => {
      el.classList.remove('animation-builder-highlight');
    });
  }
  
  function handleMouseOver(e) {
    if (!isSelecting) return;
    
    e.target.classList.add('animation-builder-highlight');
    
    const overlay = document.getElementById('animation-builder-overlay');
    if (overlay) {
      const rect = e.target.getBoundingClientRect();
      overlay.style.display = 'block';
      overlay.style.top = rect.top + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
    }
  }
  
  function handleMouseOut(e) {
    if (!isSelecting) return;
    
    e.target.classList.remove('animation-builder-highlight');
    
    const overlay = document.getElementById('animation-builder-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  
  function handleElementClick(e) {
    if (!isSelecting) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    selectedElement = e.target;
    const elementId = generateElementId(e.target);
    
    // Send selected element info to content script
    window.postMessage({
      type: 'ELEMENT_SELECTED',
      element: {
        id: elementId,
        tagName: e.target.tagName,
        className: e.target.className,
        textContent: e.target.textContent?.substring(0, 50) + '...',
        selector: generateSelector(e.target)
      }
    }, '*');
    
    stopElementSelection();
  }
  
  function generateElementId(element) {
    if (element.id) return element.id;
    
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const textContent = element.textContent?.substring(0, 20).replace(/\s+/g, '-').toLowerCase() || '';
    
    return `${tagName}${className}-${textContent}-${Date.now()}`;
  }
  
  function generateSelector(element) {
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    // Add nth-of-type if needed for uniqueness
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(child => 
        child.tagName === element.tagName && child.className === element.className
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }
    
    return selector;
  }
  
  function animateElement(elementId, animation) {
    const element = document.querySelector(elementId);
    if (!element) {
      console.warn(`Element not found with selector: ${elementId}`);
      return;
    }
    
    // Store original styles
    if (!originalStyles.has(elementId)) {
      originalStyles.set(elementId, {
        transform: element.style.transform,
        opacity: element.style.opacity,
        transition: element.style.transition
      });
    }
    
    // Apply animation
    const { type, duration, delay, easing, direction } = animation;
    
    // Reset element first
    element.style.transition = 'none';
    element.style.transform = '';
    element.style.opacity = '';
    
    // Set initial state
    switch (type) {
      case 'fade':
        element.style.opacity = '0';
        break;
      case 'slide':
        const slideDistance = 50;
        switch (direction) {
          case 'up': element.style.transform = `translateY(${slideDistance}px)`; break;
          case 'down': element.style.transform = `translateY(-${slideDistance}px)`; break;
          case 'left': element.style.transform = `translateX(${slideDistance}px)`; break;
          case 'right': element.style.transform = `translateX(-${slideDistance}px)`; break;
        }
        element.style.opacity = '0';
        break;
      case 'scale':
        element.style.transform = 'scale(0)';
        element.style.opacity = '0';
        break;
      case 'rotate':
        element.style.transform = 'rotate(-180deg)';
        element.style.opacity = '0';
        break;
    }
    
    // Force reflow
    element.offsetHeight;
    
    // Animate to final state
    setTimeout(() => {
      element.style.transition = `all ${duration}s ${easing}`;
      element.style.transform = '';
      element.style.opacity = '1';
    }, delay * 1000);
  }
  
  function resetElement(elementId) {
    const element = document.querySelector(elementId);
    if (!element) {
      console.warn(`Element not found with selector: ${elementId}`);
      return;
    }
    if (!originalStyles.has(elementId)) return;
    
    const original = originalStyles.get(elementId);
    element.style.transform = original.transform;
    element.style.opacity = original.opacity;
    element.style.transition = original.transition;
  }
  
  // Listen for element selection
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'ELEMENT_SELECTED') {
      // Forward to content script
      window.postMessage({
        type: 'ELEMENT_SELECTED_FORWARD',
        element: event.data.element
      }, '*');
    }
  });
  
})();
