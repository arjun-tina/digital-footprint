  // Function to calculate carbon emissions based on time online
  function calculateCarbonEmissions(onlineTime) {

      const emissionFactor = 0.386; // US national average
  
      const averageDevicePowerConsumption = 50; 
  
      //energy consumption in watt-hours (Wh)
      const energyConsumption = (onlineTime / 3600) * averageDevicePowerConsumption;
  
      // energy consumption in kilowatt-hours (kWh)
      const energyConsumptionKWh = energyConsumption / 1000;
  
      // carbon emissions in kgCO2 based on energy consumption and emission factor
      return energyConsumptionKWh * emissionFactor;
  }
  
  // Event listener for messages from the content script
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "updateOnlineTime") {
      // Update onlineTime variable with message value
      onlineTime = message.value;
      updateCarbonEmissions();
    }
  });
  
  // Function to update carbon emissions based on online time
  function updateCarbonEmissions() {
    // Calculate new carbon emissions value based on updated online time
    const newCarbonEmissions = calculateCarbonEmissions(onlineTime);
  
    // Update  carbonEmissions variable with new value
    carbonEmissions = newCarbonEmissions;
  }
  
  // Initialize variables
  let onlineTime = 0;
  let carbonEmissions = 0;
  



