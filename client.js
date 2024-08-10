// client.js
const { ApifyClient } = require("apify-client");

// const fs = require("fs").promises;
// const path = require("path");

const client = new ApifyClient({
  token: "apify_api_lH5bqvfiXyopIq1Aqom62R5AYq73as3a4lTg",
});

async function scrapeFanPage(page_id) {
  // Prepare Actor input
  const input = {
    startUrls: [
      {
        url: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=${page_id}&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped&search_type=page&media_type=all`,
      },
    ],
    resultsLimit: 99999,
    activeStatus: "",
  };
  // Run the Actor and wait for it to finish
  const run = await client.actor("JJghSZmShuco4j9gJ").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  //* If you want to also save the results to a file, uncomment the following line
  //const filePath = path.join(__dirname, "resultados.json");
  //await fs.writeFile(filePath, JSON.stringify(items, null, 2));

  return items.length;
}

module.exports = scrapeFanPage;
