// Background script for Animation Builder extension
console.log('Animation Builder background script loaded');

// Helper function to get current active tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle messages from popup (sender.tab is undefined for popup)
  if (sender.tab === undefined) {
    handlePopupMessage(request, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  // Handle messages from content script
  if (request.action === 'elementSelected') {
    // Forward to popup
    chrome.runtime.sendMessage({
      action: 'elementSelected',
      element: request.element
    });
    sendResponse({ success: true });
  }
});

async function handlePopupMessage(request, sendResponse) {
  try {
    const tab = await getCurrentTab();
    
    if (request.action === 'startElementSelection') {
      // Try to send message first (content script might already be injected)
      chrome.tabs.sendMessage(tab.id, {
        action: 'startElementSelection'
      }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not injected, inject it first
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }).then(() => {
            // Wait a bit for content script to initialize
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, {
                action: 'startElementSelection'
              });
            }, 100);
            sendResponse({ success: true });
          }).catch((error) => {
            console.error('Failed to inject content script:', error);
            sendResponse({ success: false, error: error.message });
          });
        } else {
          sendResponse({ success: true });
        }
      });
    }
    
    else if (request.action === 'stopElementSelection') {
      chrome.tabs.sendMessage(tab.id, {
        action: 'stopElementSelection'
      });
      sendResponse({ success: true });
    }
    
    else if (request.action === 'animateElement') {
      chrome.tabs.sendMessage(tab.id, {
        action: 'animateElement',
        elementId: request.elementId,
        animation: request.animation
      });
      sendResponse({ success: true });
    }
    
    else if (request.action === 'resetElement') {
      chrome.tabs.sendMessage(tab.id, {
        action: 'resetElement',
        elementId: request.elementId
      });
      sendResponse({ success: true });
    }
    
    else if (request.action === 'getPageElements') {
      // First ensure content script is injected
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }).then(() => {
        // Wait a bit for content script to initialize
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'getPageElements'
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error getting page elements:', chrome.runtime.lastError);
              sendResponse({ elements: [] });
            } else {
              sendResponse({ elements: response?.elements || [] });
            }
          });
        }, 100);
      }).catch((error) => {
        console.error('Failed to inject content script for getPageElements:', error);
        sendResponse({ elements: [] });
      });
    }
  } catch (error) {
    console.error('Error in handlePopupMessage:', error);
    sendResponse({ success: false, error: error.message });
  }
}

