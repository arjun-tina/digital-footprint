// Initialize variables
let totalTime = 0;
let isTracking = true;
let carbonEmissions = 0;

// Function to calculate carbon emissions
const calculateCarbonEmissions = (time) => {
    const emissionFactor = 0.386; // US national average (kg/kWh)

    const averageDevicePowerConsumption = 50; // Energy consumption in watt-hours (Wh)
    
    const energyConsumption = (time / 3600) * averageDevicePowerConsumption;
    // Energy consumption in kilowatt-hours (kWh)
    
    const energyConsumptionKWh = energyConsumption / 1000;
    // Carbon emissions in kgCO2 based on energy consumption and emission factor
  
    return energyConsumptionKWh * emissionFactor;
};

// Function to update time and emissions
const updateTimeAndEmissions = () => {
  if (isTracking) {
    totalTime++;
    carbonEmissions = calculateCarbonEmissions(totalTime);
    chrome.storage.local.set({ time: totalTime, carbonEmissions });
  }
};

const handleUserStateChange = (state) => {
  if (state === "active") {
    updateTimeAndEmissions();
    isTracking = true;
  } else {
    isTracking = false;
  }
};

// Update time whenever user becomes active
chrome.idle.onStateChanged.addListener(handleUserStateChange);

// Save total time and carbon emissions when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["time", "carbonEmissions"], (result) => {
    totalTime = result.time || 0;
    carbonEmissions = result.carbonEmissions || 0;
  });
  chrome.idle.queryState(15, handleUserStateChange); 
});

// Create alarm to update time every second
chrome.alarms.create("updateTime", { periodInMinutes: 1.0 / 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTime") {
    updateTimeAndEmissions();
  }
});

// Handle when user suspends or unloads the extension
chrome.runtime.onSuspend.addListener(() => {
  isTracking = false;
});

chrome.runtime.onSuspendCanceled.addListener(() => {
  chrome.idle.queryState(15, (state) => {
    isTracking = state === "active";
  });
});

// Handle reset request from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.reset) {
    totalTime = 0;
    carbonEmissions = 0;
    chrome.storage.local.set({ time: totalTime, carbonEmissions }, () => {
      sendResponse({ success: true });
    });
  }
  return true; 
});



