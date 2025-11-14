// content.js — Robust Keyword-Based Total Detection
import {
     isValidTotal,
     calculateLaborCost
} from './lifeforce.js'


// 1) Find and return the checkout total as a number (or null if not found)
export function getCheckoutTotal() {
    // Get every element in the body
    const allElements = Array.from(document.querySelectorAll("body *"));

    // Define keyword matching pattern using Regex for variations of "total"
    const keywordRegex = /(grand total|order total|estimated total|est\.?\s?total|subtotal|sub total|final total|final price|total due|total amount|amount due|amount to pay|due today|checkout total|payment total|item total|estimate|total)/i;

    // Define a pattern for matching text or elements that might be the price
    const priceRegex = /(\$|USD)?\s?\d{1,5}(\.\d{2})?/;

    // This list stores every element that might be our total price
    let candidates = [];

    // Loop through every element in the body
    allElements.forEach(el => {
        const text = el.textContent.trim();

        // Check if element contains both price and text for total
        if (keywordRegex.test(text) && priceRegex.test(text)) {
            const priceMatch = text.match(priceRegex)[0];
            const price = parseFloat(priceMatch.replace(/[^0-9.]/g, ""));

            let score = 0;

            if (/grand total/i.test(text)) score += 5;
            if (/estimated total|est\.?\s?total/i.test(text)) score += 4;
            if (/order total/i.test(text)) score += 3;
            if (/final total|final price/i.test(text)) score += 3;
            if (/subtotal|sub total/i.test(text)) score += 1;
            if (/total/i.test(text)) score += 1;

            // Slight boost for bigger totals
            score += price / 100;

            candidates.push({ el, text, price, score });
        }
    });

    if (candidates.length === 0) {
        console.log("❌ No total price candidates found.");
        return null;
    }

    // Pick best candidate
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    console.log("Matched Total Candidates: ", candidates);
    console.log("Selected Total Element: ", best.text);

    const total = Number(best.price.toFixed(2));
    // Return the total as a number rounded to 2 decimals
    return total
}

// 2) Create a popup for a given total
function showTotalPopup(total) {
    const popup = document.createElement("div");
    popup.innerText = `💰 Detected total: $${total.toFixed(2)}`;
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
(function runTotalDetection() {
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
