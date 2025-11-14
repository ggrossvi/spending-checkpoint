chrome.runtime.onMessage.addListener((message) => {
  if (message.cartSubtotal) {
    chrome.storage.local.set({ cartSubtotal: message.cartSubtotal });
  }
});
