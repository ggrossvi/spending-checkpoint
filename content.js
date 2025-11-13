// content.js — using Option B: find the biggest price on the page

// 1. Only run on likely checkout/cart pages
//if (window.location.href.includes("checkout") || window.location.href.includes("cart")) {
    // 2. Get all visible text from the page
    const pageText = document.body.innerText;

    // 3. Find every text fragment that looks like "$12.34"
    const priceRegex = /\$\s?\d+(\.\d{2})?/g;
    const matches = Array.from(pageText.matchAll(priceRegex));

    if (matches.length > 0) {
        // 4. Turn each match into a number (strip "$" and spaces)
        const prices = matches.map(m => parseFloat(m[0].replace(/[^0-9.]/g, "")));

        // 5. Pick the biggest one
        const maxPrice = Math.max(...prices);
        const total = `$${maxPrice.toFixed(2)}`;

        // 6. Send it to the background script
        chrome.runtime.sendMessage({ type: "CHECKOUT_TOTAL", total });

        // 7. Optional: show a small popup overlay for testing
        const popup = document.createElement("div");
        popup.innerText = `💸 You’re about to spend ${total}`;
        popup.style.cssText = `
      position:fixed;
      bottom:20px; right:20px;
      background:#fff;
      border:2px solid #3b82f6;
      padding:12px 16px;
      border-radius:8px;
      font-weight:bold;
      box-shadow:0 0 10px rgba(0,0,0,0.1);
      z-index:999999;
      color:#333;
    `;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 6000);
    }
//}
