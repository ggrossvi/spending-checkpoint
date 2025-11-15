let latestTotal = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "CHECKOUT_TOTAL") {
        latestTotal = msg.total;
        console.log("Background stored total:", latestTotal);
    }

    if (msg.type === "GET_TOTAL") {
        sendResponse({ total: latestTotal });
    }
});
