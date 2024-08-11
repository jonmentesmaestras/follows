// client.js
const { ApifyClient } = require("apify-client");

// const fs = require("fs").promises;
// const path = require("path");

const client = new ApifyClient({
  token: "apify_api_lH5bqvfiXyopIq1Aqom62R5AYq73as3a4lTg",
});

async function scrapeFanPage(url) {
  // Prepare Actor input
  const input = {
    startUrls: [
      {
        url: url,
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
