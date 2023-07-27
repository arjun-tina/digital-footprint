// Function to format time in HH:mm:ss format
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  
// Function to update pop-up with online time and carbon emissions
function updatePopup() {
chrome.runtime.getBackgroundPage((backgroundPage) => {
    const { onlineTime, carbonEmissions } = backgroundPage;
    document.getElementById("onlineTime").textContent = `Online Time: ${formatTime(onlineTime)}`;
    document.getElementById(
    "carbonEmissions"
    ).textContent = `Estimated Carbon Emissions: ${carbonEmissions.toFixed(2)} kgCO2`;
});
}
  
// Call updatePopup function when the pop-up is loaded
document.addEventListener("DOMContentLoaded", updatePopup);
