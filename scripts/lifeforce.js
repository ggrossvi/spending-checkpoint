import {
     getCheckoutTotal
} from './content.js'

// =========================
//  Hourly Rate Constant
// =========================
const HOURLY_RATE = 28.0;

// =========================
//  Validation Helper
// =========================
export function isValidTotal(total) {
    return (
        total !== null &&
        total !== undefined &&
        !isNaN(total) &&
        Number(total) > 0
    );
}

// =========================
//  Labor Cost Calculator
//  (Returns hours only)
// =========================
export function calculateLaborCost(total) {
    return (total / HOURLY_RATE).toFixed(2);
}

 // Validate total
    if (!isValidTotal(total)) {
        console.warn("❌ Invalid total. Skipping labor calculation.");
        return;  // STOP HERE
    }

    // Compute labor hours
    const hours = calculateLaborCost(total);
    console.log(typeof hours);

    return hours

  function showLifeForcePopup(total,hours) {
      const popup = document.createElement("div");
      popup.innerText = `Hours worked to pay for purchase: ${hours}}`;
      popup.style.cssText = `
        position:fixed;
        bottom:20px; right:20px;
        padding:12px 16px;
        background:#fff;
        border:2px solid #34d399;
        border-radius:8px;
        font-weight:bold;
        color:#111;
        z-index:999999;
        box-shadow:0 2px 10px rgba(0,0,0,0.15);
      `;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 6000);
  }
  
  // 3) Main flow: get total, then show popup and send message
  (function runHourDetection() {
      const total = getCheckoutTotal();
  
      if (total !== null && !Number.isNaN(total)) {
          showTotalPopup(total);
  
          if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
              chrome.runtime.sendMessage({
                  type: "CHECKOUT_TOTAL",
                  total: `$${total.toFixed(2)}`
              });
          }
      }
  })();