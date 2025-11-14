function extractSubtotal() {
  const subtotalElement = [...document.querySelectorAll("span")]
    .find(el => el.textContent.toLowerCase().includes("subtotal"));

  if (subtotalElement) {
    const match = subtotalElement.textContent.match(/\$\d+(\.\d{2})?/);
    const subtotal = match ? match[0] : null;

    if (subtotal) {
      chrome.runtime.sendMessage({ cartSubtotal: subtotal });
    }
  }
}

setTimeout(extractSubtotal, 2000); // wait for dynamic content

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "extractSubtotal") {
    extractSubtotal();
  }
});