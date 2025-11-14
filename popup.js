document.addEventListener("DOMContentLoaded", () => {
  const totalDisplay = document.getElementById("totalDisplay");
  const refreshBtn = document.getElementById("refreshBtn");

  chrome.storage.local.get("cartSubtotal", (data) => {
    totalDisplay.textContent = data.cartSubtotal || "Not found";
  });

  refreshBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url?.includes("target.com/cart")) {
        chrome.tabs.sendMessage(tab.id, { action: "extractSubtotal" });
      } else {
        console.log("Not on Target cart page");
      }
    });
  });
});
