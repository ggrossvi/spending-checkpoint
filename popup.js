chrome.runtime.sendMessage({ type: "GET_TOTAL" }, (response) => {
  const el = document.getElementById("total");

  if (chrome.runtime.lastError) {
    el.textContent = "Error communicating with extension.";
    return;
  }

  if (response?.total) {
    el.textContent = response.total;
  } else {
    el.textContent = "No total detected yet.";
  }
});
