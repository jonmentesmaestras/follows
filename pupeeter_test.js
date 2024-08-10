const puppeteer = require("puppeteer");

// arreglo de user agents para usar en el request
const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",

  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/83.0.4103.61 Chrome/83.0.4103.61 Safari/537.36",

  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/102.0.0",

  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1",

  "Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/102.0 Mobile",
];
const browser = await puppeteer.launch();
const page = await browser.newPage();

function getRandomUserAgent(userAgents) {
  // Get the array length
  const userAgentsLength = userAgents.length;

  // Generate a random number between 0 (inclusive) and the array length (exclusive)
  const randomIndex = Math.floor(Math.random() * userAgentsLength);

  // Return the user agent at the random index
  return userAgents[randomIndex];
}

try {
  //TODO: Tener una tabla de conjunto de user agents
  await page.setUserAgent(getRandomUserAgent(userAgents));

  await page.goto(url, { waitUntil: "networkidle0" });

  const selector =
    ".x8t9es0.x1uxerd5.xrohxju.x108nfp6.xq9mrsl.x1h4wwuj.x117nqv4.xeuugli";
  await page.waitForSelector(selector, { timeout: 60000 });

  const innerHTML = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    return element ? element.innerHTML : null;
  }, selector);

  await browser.close();

  let str = innerHTML;
  console.log("el resultado es", str);
  let num = parseInt(str.replace(/\D/g, ""), 10);

  if (isNaN(num)) {
    return 0;
  } else {
    return num;
  }
} catch (error) {
  return 0;
}
