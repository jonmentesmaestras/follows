const scrapeFanPage = require("./client");
const axios = require("axios");
const { downloadDataToJson, removeProcessedOffer } = require("./processData");
const fs = require("fs");
const cron = require("node-cron");

// Example usage: generate a random milliseconds between 60000 and 100000
const randomTime = getRandomMilliseconds(60000, 100000);
console.log(randomTime);

//get the time to wait in milliseconds
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//hacer scrapping para obtener el número de anuncios activos en facebook ads library
async function getInnerResult(URI, includesDomain = false) {
  //retrazamos la siguiente petición 60 segundos para prevenir que facebook ads library nos bloquee
  await sleep(getRandomMilliseconds(60000, 75000));
  console.log("scrapping");
  let url;
  if (includesDomain) {
    const domain = URI.split("q=")[1].split("&")[0];
    console.log("domain ", domain);
    url = `https://www.facebook.com/ads/library/?
            active_status=active&
            ad_type=all&
            country=ALL&
            q=${domain}&
            sort_data[direction]=desc&
            sort_data[mode]=relevancy_monthly_grouped&
            search_type=keyword_exact_phrase&
            media_type=all`;
  } else {
    //exctract fan page id from the url
    const fanPageId = URI.split("view_all_page_id=")[1].split("&")[0];
    url = `https://www.facebook.com/ads/library/?
            active_status=active&
            ad_type=all&
            country=ALL&
            view_all_page_id=${fanPageId}&
            sort_data[direction]=desc&
            sort_data[mode]=relevancy_monthly_grouped&
            search_type=page&
            media_type=all`;
  }

  try {
    const result = await scrapeFanPage(url);
    console.log("Active Ads count :  ", result);
    return result;
  } catch (error) {
    return 0;
  }
}

//escribir el resultado en la base de datos
async function updateFollowOffers(data) {
  console.log("updating tracking offers");
  const url = `https://nodeapi.tueducaciondigital.site/offersTracking`;
  //const url = `http://localhost:3002/offersTracking`;

  try {
    const response = await axios.post(url, data);
    console.log("response is from clicspy server ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// retrazar la petición a facebook ads library
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// get random time
function getRandomMilliseconds(min, max) {
  // Math.random() generates a number between 0 (inclusive) and 1 (exclusive)
  const randomDecimal = Math.random();

  // Calculate the range (max minus min)
  const range = max - min;

  // Scale the random decimal to the range and add the minimum value
  const randomMilliseconds = Math.floor(randomDecimal * range) + min;

  return randomMilliseconds;
}

//getInnerResult ('https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=281399125343016&search_type=page&media_type=all')

async function processOffer(item) {
  try {
    console.log("sending..." + item.FanPage);

    //obtengo los anuncios activos de la fanpage
    let activeAds = await getInnerResult(item.FanPage);

    let data = {
      NumAds: activeAds,
      OffersFollo_ID: item.OffersFollo_ID,
      EnumAdsSourceCode: "FanPage",
    };

    //inserto en nuestra tabla
    let result = await updateFollowOffers(data);
    console.log("result is " + JSON.stringify(result));
    await new Promise((resolve) =>
      setTimeout(resolve, getRandomNumber(25000, 40000))
    ); // Wait 5 seconds

    if (item.Domain === null) {
      console.log("Domain is null");
    } else if (typeof item.Domain === "undefined") {
      console.log("Domain is undefined");
    } else if (item.Domain === "none") {
      console.log("Domain is none");
    } else {
      //obtengo los anuncios activos del Dominio
      activeAds = await getInnerResult(item.Domain, true);

      data = {
        NumAds: activeAds,
        OffersFollo_ID: item.OffersFollo_ID,
        EnumAdsSourceCode: "Domain",
      };

      //inserto en nuestra tabla
      result = await updateFollowOffers(data);
      console.log("result is " + JSON.stringify(result));
    }
    removeProcessedOffer(item.id);
  } catch (error) {
    console.error(error);
  }
}

//leer todas las ofertas activas y actualizar el seguimiento de las ofertas
async function main() {
  console.log("Downloading Offers...");
  await downloadDataToJson();
  console.log("Offers downloaded");

  //read the offers from the file
  const ofertasData = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

  for (const item of ofertasData) {
    await processOffer(item);
  }
}

// * * * * * - Minute, Hour, Day of Month, Month, Day of Week
// 0 2 * * * - Run at 2:00 AM every day

// Adjust the cron expression to match your required schedule. For example:
// 0 0 * * * - Run at midnight every day
// 30 6 * * * - Run at 6:30 AM every day
// main();
cron.schedule("54 14 * * *", () => {
  console.log("Running the scheduled task");
  main();
});
