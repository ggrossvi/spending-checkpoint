// ---------------------------------------------
// POPUP SCRIPT — Displays Detected Checkout Total
// ---------------------------------------------

console.log("[Popup] Loaded");

// DOM elements
const totalDisplay = document.getElementById("totalDisplay");
const refreshBtn = document.getElementById("refreshBtn");

// Update UI
function updateTotalDisplay(total) {
  if (total) {
    totalDisplay.textContent = total;
  } else {
    totalDisplay.textContent = "No total detected yet.";
  }
}

// Load total from background service worker
function loadDetectedTotal() {
  chrome.runtime.sendMessage(
      { type: "GET_DETECTED_TOTAL" },
      (data) => {
        if (chrome.runtime.lastError) {
          console.error("[Popup] Error contacting background:", chrome.runtime.lastError);
          totalDisplay.textContent = "Error loading total";
          return;
        }

        if (data?.lastDetectedTotal) {
          updateTotalDisplay(data.lastDetectedTotal);
        } else {
          updateTotalDisplay(null);
        }
      }
  );
}

// Refresh simply re-requests the value from background
refreshBtn.addEventListener("click", () => {
  totalDisplay.textContent = "Refreshing...";
  loadDetectedTotal();
});

// Load total on popup open
loadDetectedTotal();
