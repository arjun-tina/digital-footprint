document.addEventListener("DOMContentLoaded", () => {

  // Function to update popup
  function updatePopup() {
    chrome.storage.local.get(["time", "carbonEmissions"], (result) => {
      const timeDisplay = document.getElementById("timeDisplay");
      const emissionsDisplay = document.getElementById("emissionsDisplay");
      
      const totalTime = result.time || 0;
      const hours = Math.floor(totalTime / 3600);
      const minutes = Math.floor((totalTime % 3600) / 60);
      const seconds = totalTime % 60;
      const formattedTime = `${hours}h ${minutes}m ${seconds}s`;
      timeDisplay.textContent = formattedTime;

      const carbonEmissions = result.carbonEmissions || 0;
      const formattedEmissions = `${carbonEmissions.toFixed(2)} kg CO2`;
      emissionsDisplay.textContent = formattedEmissions;
    });
  }

  // Call updatePopup function to populate popup initially
  updatePopup();

  // Listen for changes in storage and update popup when needed
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.time || changes.carbonEmissions) {
      updatePopup();
    }
  });

  // Handle reset button click event
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ reset: true }, (response) => {
      if (response.success) {
        updatePopup(); 
      }
    });
  });
  
});
