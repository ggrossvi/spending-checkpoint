// ---------------------------------------------
// BACKGROUND SERVICE WORKER — MV3 Modern Async
// ---------------------------------------------
console.log("[Background] Service worker loaded");

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // Content script reporting a detected total
    if (message.type === "CHECKOUT_TOTAL") {
        console.log("[Background] Received total:", message.total);

        // Store the total and metadata
        chrome.storage.local.set({
            lastDetectedTotal: message.total,
            lastDetectedAt: Date.now(),
            lastUrl: sender?.tab?.url || null
        });
    }

    // Popup requesting the last detected total
    if (message.type === "GET_DETECTED_TOTAL") {
        chrome.storage.local.get(
            ["lastDetectedTotal", "lastDetectedAt", "lastUrl"],
            (data) => {
                sendResponse(data);
            }
        );

        // Keep the message channel open for async response
        return true;
    }
});


// // Listen for messages from content scripts and popup
// chrome.runtime.onMessage.addListener((message, sender) => {
//     // Wrap in an async IIFE for modern async/await usage
//     (async () => {
//         try {
//             // 1️⃣ Content script reports a detected total
//             if (message.type === "CHECKOUT_TOTAL") {
//                 console.log("[Background] Received total:", message.total);
//
//                 // Store total and metadata in chrome.storage.local
//                 await chrome.storage.local.set({
//                     lastDetectedTotal: message.total,
//                     lastDetectedAt: Date.now(),
//                     lastUrl: sender?.tab?.url || null
//                 });
//             }
//
//             // 2️⃣ Popup requests the last detected total
//             else if (message.type === "GET_DETECTED_TOTAL") {
//                 const data = await chrome.storage.local.get([
//                     "lastDetectedTotal",
//                     "lastDetectedAt",
//                     "lastUrl"
//                 ]);
//
//                 // Send data back to popup
//                 if (sender.id === chrome.runtime.id) {
//                     // Message from popup
//                     chrome.runtime.sendMessage(data);
//                 } else if (sender.tab?.id) {
//                     // Message from content script or tab
//                     chrome.tabs.sendMessage(sender.tab.id, data);
//                 }
//             }
//         } catch (error) {
//             console.error("[Background] Error handling message:", error);
//         }
//     })();
//
//     // No need to return true — async IIFE handles it
// });
