const axios = require("axios");
const fs = require("fs");

const path = "./data.json";
async function downloadDataToJson() {
  try {
    const url = "https://nodeapi.tueducaciondigital.site/usuariosOffers";
    const response = await axios.get(url);

    const data = response.data;
    const offersData = data.data;

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify(offersData, null, 2), "utf-8");
      console.log("File created and data written.");
    } else {
      fs.writeFileSync(path, JSON.stringify(offersData, null, 2), "utf-8");
      console.log("File updated with new data.");
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

function removeProcessedOffer(offerId) {
  try {
    // Read the current offers from the file
    const ofertasData = JSON.parse(fs.readFileSync(path, "utf-8"));

    // Filter out the processed offer
    const updatedOffers = ofertasData.filter((offer) => offer.id !== offerId);

    // Write the updated offers back to the file
    fs.writeFileSync(path, JSON.stringify(updatedOffers, null, 2), "utf-8");
    console.log(`Offer with ID: ${offerId} has been removed.`);
  } catch (error) {
    console.log("Removal error:", error);
  }
}
module.exports = { downloadDataToJson, removeProcessedOffer };
