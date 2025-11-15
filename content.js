// ================================
// WRAP YOUR ORIGINAL CODE IN A FUNCTION
// ================================
function runDetection() {

    // ---- YOUR ORIGINAL CODE STARTS HERE ----

    //See if we are on a checkout page; too many variations in URL, need other approach
    //if (window.location.href.includes("checkout") || window.location.href.includes("cart")) {

    //Get every element in the body
    const allElements = Array.from(document.querySelectorAll("body *"));

    //Define key word matching pattern using Regex for variations of total
    const keywordRegex = /(grand total|order total|estimated total|est\.?\s?total|subtotal|sub total|final total|final price|total due|total amount|amount due|amount to pay|due today|checkout total|payment total|item total|estimate|total)/i;

    //Define a pattern for matching text or elements that might be the price using regex
    const priceRegex = /(\$|USD)?\s?\d{1,5}(\.\d{2})?/;

    //This list stores every element that might be our total price
    let candidates = [];

    //Loop through every element in the body
    allElements.forEach(el => {
        const text = el.textContent.trim(); //change to text

        //Check if element contains both price and text for total
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

    if (candidates.length > 0) {

        candidates.sort((a, b) => b.score - a.score);
        const best = candidates[0];
        const total = best.price.toFixed(2);

        console.log("Matched Total Candidates: ", candidates);
        console.log("Selected Total Element: ", best.text);

        const popup = document.createElement("div");
        popup.innerText = `💰 Detected total: $${total}`;
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

        if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage({ type: "CHECKOUT_TOTAL", total: `$${total}` });
        }
    } else {
        console.log("❌ No total price candidates found.");
    }
    //}

    // ---- YOUR ORIGINAL CODE ENDS HERE ----
}


// ================================
// RUN YOUR CODE ONCE IMMEDIATELY
// ================================
runDetection();


// ================================
// ADD MUTATION OBSERVER (minimal + clean)
// ================================
let lastRun = 0;

const observer = new MutationObserver(() => {
    // throttle to avoid excessive re-runs on dynamic sites
    const now = Date.now();
    if (now - lastRun < 800) return;
    lastRun = now;

    runDetection();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});
