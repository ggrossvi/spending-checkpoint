console.log("popup.js reached");
// The DOM elements
const totalDisplay = document.getElementById("totalDisplay");
//const refreshBtn = document.getElementById("refreshBtn");

// Updates the total display
function updateTotalDisplay(total) {
  if (total) {
    totalDisplay.textContent = total;
  } else {
    totalDisplay.textContent = "No total found!";
  }
}

// Gets total from storage
export async function loadStoredTotal() {
  try {
    const result = await chrome.storage.local.get(["checkoutTotal"]);
    if (result.checkoutTotal) {
      updateTotalDisplay(result.checkoutTotal);
    } else {
      totalDisplay.textContent = "No total found!";
    }
  } catch (error) {
    console.error("Error loading total:", error);
    totalDisplay.textContent = "Error loading total";
  }
}

// Requests total from active tab's content script
export async function refreshTotal() {
  try {
    // Gets the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      totalDisplay.textContent = "No active tab";
      return;
    }

    // Checks if we can inject/access content script
    if (tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("edge://"))) {
      totalDisplay.textContent = "Cannot detect on this page";
      return;
    }

    // Sends message to content script to get total
    chrome.tabs.sendMessage(tab.id, { type: "GET_TOTAL" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        // If content script not loaded, try loading stored value
        loadStoredTotal();
        return;
      }
      
      if (response && response.total) {
        updateTotalDisplay(response.total);
        // Store in chrome.storage
        chrome.storage.local.set({ checkoutTotal: response.total });
      } else {
        totalDisplay.textContent = "No total detected";
      }
    });
  } catch (error) {
    console.error("Error refreshing total:", error);
    totalDisplay.textContent = "Error refreshing";
  }
}

// Listener for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECKOUT_TOTAL") {
    updateTotalDisplay(message.total);
    // Store in chrome.storage
    chrome.storage.local.set({ checkoutTotal: message.total });
  }
});



