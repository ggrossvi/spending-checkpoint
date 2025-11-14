console.log("background.js reached")
const refreshBtn = document.getElementById("refreshBtn");
import {loadStoredTotal} from './popup.js';
import {refreshTotal} from './popup.js';

// Refresh button click listener
refreshBtn.addEventListener("click", () => {
  console.log ("Clicked!!")
  totalDisplay.textContent = "Detecting...";
  refreshTotal();
});

// Load stored total when popup opens
loadStoredTotal();


// Also try to refresh on popup open
refreshTotal();