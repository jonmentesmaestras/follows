const puppeteer = require('puppeteer');
const cron = require('node-cron');
const axios = require('axios');
const ofertas = {
  "message": "Success",
  "code": 200,
  "error": false,
  "status": "Ok",
  "stage": "Init",
  "info": [],
  "data": [
    
   
    {
      "id": 663978,
      "UserID": 506,
      "OffersFollo_ID": 106,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=214199951776294",
      "StartDate": "2024-06-03T05:15:03.000Z",
      "EndDate": null
    },
    {
      "id": 890147,
      "UserID": 81,
      "OffersFollo_ID": 107,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=334962856367076",
      "StartDate": "2024-06-03T06:23:45.000Z",
      "EndDate": null
    },
    {
      "id": 458802,
      "UserID": 81,
      "OffersFollo_ID": 108,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=113458015194347",
      "StartDate": "2024-06-03T06:23:54.000Z",
      "EndDate": null
    },
    {
      "id": 623568,
      "UserID": 540,
      "OffersFollo_ID": 109,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=270750209460759",
      "StartDate": "2024-06-03T15:14:12.000Z",
      "EndDate": null
    },
    {
      "id": 741434,
      "UserID": 804,
      "OffersFollo_ID": 110,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=114672584539757",
      "StartDate": "2024-06-03T18:49:34.000Z",
      "EndDate": null
    },
    {
      "id": 836466,
      "UserID": 77,
      "OffersFollo_ID": 111,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=110316565282230",
      "StartDate": "2024-06-03T18:50:15.000Z",
      "EndDate": null
    },
    {
      "id": 958028,
      "UserID": 77,
      "OffersFollo_ID": 112,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=212881391914582",
      "StartDate": "2024-06-03T18:51:11.000Z",
      "EndDate": null
    },
    {
      "id": 280745,
      "UserID": 77,
      "OffersFollo_ID": 113,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=109410662111552",
      "StartDate": "2024-06-03T19:36:48.000Z",
      "EndDate": null
    },
    {
      "id": 529638,
      "UserID": 77,
      "OffersFollo_ID": 114,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=199783873227235",
      "StartDate": "2024-06-03T19:37:48.000Z",
      "EndDate": null
    },
    {
      "id": 805959,
      "UserID": 490,
      "OffersFollo_ID": 115,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=410546739011552",
      "StartDate": "2024-06-03T22:37:06.000Z",
      "EndDate": null
    },
    {
      "id": 440880,
      "UserID": 71,
      "OffersFollo_ID": 116,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=108777848603477",
      "StartDate": "2024-06-03T23:46:55.000Z",
      "EndDate": null
    },
    {
      "id": 786526,
      "UserID": 71,
      "OffersFollo_ID": 117,
      "FanPage": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&source=page-transparency-widget&view_all_page_id=112995935115683",
      "StartDate": "2024-06-04T00:09:36.000Z",
      "EndDate": null
    }
  ]
}
// arreglo de user agents para usar en el request
const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
  
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/83.0.4103.61 Chrome/83.0.4103.61 Safari/537.36",
  
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/102.0.0",
  
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1",
  
  "Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/102.0 Mobile"
  ]

//leer todas las ofertas activas y actualizar el seguimiento de las ofertas
async function main() {
  console.log("reading offers...");

  try {
    const response = await axios.get('https://nodeapi.tueducaciondigital.site/usuariosOffers');
    const offers = ofertas.data

    for (const item of offers) {
      console.log("sending..." +item.FanPage);

      //obtengo los anuncios activos de la fanpage
      let activeAds = await getInnerResult(item.FanPage)
      console.log(activeAds)
      
      let data = {
          "NumAds":activeAds,
          "OffersFollo_ID":item.OffersFollo_ID,
          "EnumAdsSourceCode": "FanPage"
        }
      
        //inserto en nuestra tabla
      let result = await updateFollowOffers(data)  
      console.log("result is " + JSON.stringify(result))      
      await new Promise(resolve => setTimeout(resolve, getRandomNumber(25000,40000))); // Wait 5 seconds

      if (item.Domain === null) {
        console.log('Domain is null');
      } else if (typeof item.Domain === 'undefined') {
        console.log('Domain is undefined');
      } else if (item.Domain === 'none'){
        console.log('Domain is none');
      } else {
        //obtengo los anuncios activos del Dominio
        activeAds = await getInnerResult(item.Domain)
        console.log("for domain active ads are: ", activeAds)
        
        data = {
            "NumAds":activeAds,
            "OffersFollo_ID":item.OffersFollo_ID,
            "EnumAdsSourceCode": "Domain"
          }
        
          //inserto en nuestra tabla
        result = await updateFollowOffers(data)  
        console.log("result is " + JSON.stringify(result))      
      }

      


      
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

//get the time to wait in milliseconds
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



 //hacer scrapping para obtener el número de anuncios activos en facebook ads library
  async function getInnerResult (url)  {
   
    //retrazamos la siguiente petición 60 segundos para prevenir que facebook ads library nos bloquee
    await sleep(getRandomMilliseconds(60000, 75000));
    console.log("scrapping")

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try{
      //TODO: Tener una tabla de conjunto de user agents
      await page.setUserAgent(getRandomUserAgent(userAgents));

      await page.goto(url, {waitUntil: 'networkidle0'});
                         
      const selector = '.x8t9es0.x1uxerd5.xrohxju.x108nfp6.xq9mrsl.x1h4wwuj.x117nqv4.xeuugli';
      await page.waitForSelector(selector, {timeout: 60000});

      const innerHTML = await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          return element ? element.innerHTML : null;
      }, selector);

      await browser.close();

      let str = innerHTML
      console.log("el resultado es", str)
      let num = parseInt(str.replace(/\D/g, ''), 10)
      
      
      if (isNaN(num)) {
          return 0
      } else {
        return num     
      }                                  

    } catch(error){
      return 0
    }
    
    
  }
  
  
//escribir el resultado en la base de datos
  async function updateFollowOffers(data){
    console.log("updating tracking offers")
    const url = `https://nodeapi.tueducaciondigital.site/offersTracking`;
    //const url = `http://localhost:3002/offersTracking`;
    
    try {
        const response = await axios.post(url, data);
        console.log("response is from clicspy server ", response.data)
        return response.data;
    } catch (error) {
        console.error(error);
    } 
  }

  // retrazar la petición a facebook ads library
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  
  function getRandomUserAgent(userAgents) {
    // Get the array length
    const userAgentsLength = userAgents.length;
  
    // Generate a random number between 0 (inclusive) and the array length (exclusive)
    const randomIndex = Math.floor(Math.random() * userAgentsLength);
  
    // Return the user agent at the random index
    return userAgents[randomIndex];
  }
  

  // Example usage: generate a random milliseconds between 60000 and 100000
  const randomTime = getRandomMilliseconds(60000, 100000);
  console.log(randomTime);
  
   
  //getInnerResult ('https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=281399125343016&search_type=page&media_type=all') 
 
  main()   
/*  cron.schedule('* * * * *', function() {
    main() 
  });*/


  

