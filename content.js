// ---------------------------------------------
// CONTENT SCRIPT — Checkout Detection (MV3 Safe)
// ---------------------------------------------

console.log("[Extension] Content script loaded");

// --- STEP 1: Regex patterns for detecting totals ---
const keywordRegex = /(grand total|order total|estimated total|est\.?\s?total|subtotal|sub total|final total|checkouts|final price|total due|total amount|amount due|amount to pay|due today|checkout total|Subtotal|Total|payment total|item total|estimate|total)/i;
const priceRegex = /(\$|USD)?\s?\d{1,5}(\.\d{2})?/;


// --- STEP 2: Detect total using your keyword-based scoring algorithm ---
function detectTotalOnPage() {
    const allElements = Array.from(document.querySelectorAll("body *"));
    let candidates = [];

    allElements.forEach(el => {
        const text = el.textContent.trim();
        if (!text) return;

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

            score += price / 100;

            candidates.push({ el, text, price, score });
        }
    });

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    return best.price.toFixed(2);
}


// --- STEP 3: Send detected data to background service worker ---
function reportTotal(total) {
    console.log(`💰 [Extension] Total detected: $${total}`);

    chrome.runtime?.sendMessage?.({
        type: "CHECKOUT_TOTAL",
        total: `$${total}`
    });
}


// --- STEP 4: Main scan function used by MutationObserver ---
let hasDetected = false;

function tryDetectTotal() {
    if (hasDetected) return;

    const total = detectTotalOnPage();
    if (total) {
        hasDetected = true;
        reportTotal(total);
        observer.disconnect();
    }
}


// --- STEP 5: Set up MutationObserver ---
console.log("[Extension] MutationObserver initialized");

const observer = new MutationObserver(() => {
    console.log("[Extension] DOM changed — checking for total...");
    tryDetectTotal();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});


// --- STEP 6: Run once immediately for non-SPA sites ---
tryDetectTotal();

// // content.js — Robust Keyword-Based Total Detection
//
// //See if we are on a checkout page; too many variations in URL, need other approach
// //if (window.location.href.includes("checkout") || window.location.href.includes("cart")) {
//
//     //Get every element in the body
//     const allElements = Array.from(document.querySelectorAll("body *"));
//
//     //Define key word matching pattern using Regex for variations of total
//     const keywordRegex = /(grand total|order total|estimated total|est\.?\s?total|subtotal|sub total|final total|final price|total due|total amount|amount due|amount to pay|due today|checkout total|payment total|item total|estimate|total)/i;
//
//     //Define a pattern for matching text or elements that might be the price using regex
//     const priceRegex = /(\$|USD)?\s?\d{1,5}(\.\d{2})?/;
//
//     //This list stores every element that might be our total price
//     let candidates = [];
//
//     //Loop through every element in the body
//     allElements.forEach(el => {
//         const text = el.textContent.trim(); //change to text
//
//         //Check if element contains both price and text for total
//         if (keywordRegex.test(text) && priceRegex.test(text)) {
//
//             const priceMatch = text.match(priceRegex)[0];
//             const price = parseFloat(priceMatch.replace(/[^0-9.]/g, ""));
//
//             let score = 0;
//
//             if (/grand total/i.test(text)) score += 5;
//             if (/estimated total|est\.?\s?total/i.test(text)) score += 4;
//             if (/order total/i.test(text)) score += 3;
//             if (/final total|final price/i.test(text)) score += 3;
//             if (/subtotal|sub total/i.test(text)) score += 1;
//             if (/total/i.test(text)) score += 1;
//
//             score += price / 100;
//
//             candidates.push({ el, text, price, score });
//         }
//     });
//
//     if (candidates.length > 0) {
//
//         candidates.sort((a, b) => b.score - a.score);
//         const best = candidates[0];
//         const total = best.price.toFixed(2);
//
//         console.log("Matched Total Candidates: ", candidates);
//         console.log("Selected Total Element: ", best.text);
//
//         const popup = document.createElement("div");
//         popup.innerText = `💰 Detected total: $${total}`;
//         popup.style.cssText = `
//       position:fixed;
//       bottom:20px; right:20px;
//       padding:12px 16px;
//       background:#fff;
//       border:2px solid #34d399;
//       border-radius:8px;
//       font-weight:bold;
//       color:#111;
//       z-index:999999;
//       box-shadow:0 2px 10px rgba(0,0,0,0.15);
//     `;
//         document.body.appendChild(popup);
//         setTimeout(() => popup.remove(), 6000);
//
//         if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
//             chrome.runtime.sendMessage({ type: "CHECKOUT_TOTAL", total: `$${total}` });
//         }
//     } else {
//         console.log("❌ No total price candidates found.");
//     }
// //}
