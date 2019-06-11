const puppeteer = require("puppeteer");
let fetchCheerioObject = require("fetch-cheerio-object");

var fs = require("fs");

let bodyParser = require("body-parser"),
  express = require("express"),
  cheerio = require("cheerio"),
  cheerioAdv = require("cheerio-advanced-selectors"),
  axios = require("axios"),
  env = require("dotenv"),
  app = express();
let path = require("path");
env.config();
cheerio = cheerioAdv.wrap(cheerio);
var request = require("request");

app.use(express.static("/public"));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/../public"));
app.use(express.static(__dirname + "/static"));
app.get("/new", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.set("view engine", "ejs");
app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true
  })
);

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/get-items/:itemSearch", async (req, res) => {
  console.log("routecall");
  let url = `https://www.amazon.com/s?k=${
    req.params.itemSearch
  }&ref=nb_sb_noss_2`;
  // getItems(url)

  let items = await getItems(url);
  let avgPrice = await getAvgP(items);
    res.send({ items, avgPrice });
  // res.render("show", {
  //     items,
  //     avgPrice
  // });
});

const getItems = async url => {
  let arrItems = [];
try{
  let browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  //
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });

  await page.goto(url, {waitUntil: 'load', timeout: 0});

  // get hotel details
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);

  let $ = cheerio.load(bodyHTML);

  let htmlKing = await $(".s-include-content-margin").each((index, element) => {

    let obj = {};
    if (index < 16) {
      $(element)
        .find(".s-image")
        .each(function(i, ele) {
          obj.image = $(ele).attr("src");
        });
      if (
        $(element)
          .find(".s-line-clamp-2 > a")
          .text() != ""
      ) {
        $(element)
          .find(".s-line-clamp-2 > a")
          .each(function(i, ele2) {
            obj.link = "https://www.amazon.com" + $(ele2).attr("href");
          });
      } else {
        $(element)
          .find("[data-component-type=s-product-image] > a")
          .each(function(i, ele2) {
            obj.link = "https://www.amazon.com" + $(ele2).attr("href");
          });
      }

      if (
        $(element)
          .find(".s-line-clamp-2 > a > span")
          .text() != ""
      ) {
        $(element)
          .find(".s-line-clamp-2 > a > span")
          .each(function(i, ele2) {
            obj.title = $(ele2).text();
          });
      } else {
        $(element)
          .find(".a-size-base-plus")
          .each(function(i, ele2) {
            obj.title = $(ele2).text();
          });
      }

      $(element)
        .find(".a-offscreen")
        .each(function(i, ele) {
          obj.price = $(ele).text();
        });
      $(element)
        .find(".a-icon-alt")
        .each(function(i, ele) {
          obj.rattings = $(ele).text();
        });

      arrItems.push(obj);
    }
  });
  browser.close();
  let newbrowser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
 //
 let newpage = await newbrowser.newPage();
 await newpage.setViewport({ width: 1920, height: 926 });

  for (let i = 0; i < arrItems.length; i++) {
 
    await newpage.goto(arrItems[i].link, {waitUntil: 'load', timeout: 0});
    let bodyHTMLNew = await newpage.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHTMLNew);

    let htmlKing = await $("tr").each((index, element) => {
      if (
        $(element)
          .text()
          .includes("Best Sellers Rank")
      ) {
        if ($(element).find("#SalesRank").length > 0) {
          arrItems[i].description = $(element)
            .find("#SalesRank")
            .text();
        } else {
          arrItems[i].description = $(element).text();
        }
      } else if (
        $("#SalesRank")
          .text()
          .includes("Sellers Rank")
      ) {
        arrItems[i].description = $("#SalesRank").text();
      }
    });
    let sellerType = await $("#merchant-info");
    let selT = sellerType.text().trim();
    if (selT.includes("Ships from")) {
      arrItems[i].sellerType = "AMZ";
    } else if (selT.includes("Fulfilled by Amazon")) {
      arrItems[i].sellerType = "FBA";
    } else if (selT.includes("Fulfilled by")) {
      arrItems[i].sellerType = "FBM";
    }
    let brandName = await $("#bylineInfo");
    arrItems[i].brandName = brandName.text();

    let reviews = await $("#acrCustomerReviewText");
    arrItems[i].reviews = reviews.text();



    // let titleB= await $("#productTitle");
    // let title= titleB.text().trim();
    // arrItems[i].title=title;
    

  }
  newbrowser.close();
  return arrItems;

}catch(err){
  console.log(err);
}
  
};

const getAvgP = async items => {
  let totalPrice = 0;
  let totalStar = 0;
  let totalBest = 0;
  let price;
  let star;
  let bestSell;
  let count = 0;
  let BestSellrCount = 0;
  let totalReview=0;
  let reviewCount=0;
  let minPrice=0;
  let maxPrice=0;
  items.forEach((item)=>{
    if (item.price != undefined && item.price != "" ) {
      price = item.price.substring(1, 500);
      let a = parseFloat(price);
      minPrice=price;
      maxPrice=price;
    }

  });
  items.forEach(element => {
    if (element.price != undefined) {
      price = element.price.substring(1, 500);
      let a = parseFloat(price);

      if (!isNaN(a)) {
        if(a<minPrice){
          minPrice=a;
        }
        if(a>maxPrice){
          maxPrice=a;
        }
        totalPrice += a;
      }
    }
    if (element.rattings != undefined) {
      count++;
      star = +element.rattings.substring(0, 3);
      totalStar += star;
    }
    if(element.reviews != undefined && element.reviews != ""){
      review=+element.reviews.match(/(.*?)\s/)[0]
      reviewCount++;
      totalReview+=review;
    }

    if (element.description != undefined && element.description != "") {
      BestSellrCount++;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      totalBest += bestSell;
    }
  });
  console.log(minPrice);
  console.log(maxPrice);

  let avgPrice = (totalPrice / items.length).toFixed(2);
  let avgStar = (totalStar / count).toFixed(2);
  let avgBestSell = (totalBest / BestSellrCount).toFixed(2);
  let avgReviews=(totalReview/reviewCount).toFixed(2);

  return {
    avgPrice,
    avgStar,
    avgBestSell,
    avgReviews,
    minPrice,
    maxPrice
  };
};

app.get("/newDemo", (req, res) => {
  res.render("newIndex");
});

app.get("/40/keywords", (req, res) => {
  res.render("keywordsFourty");
});

app.get("/getLinks/:url", async (req, res) => {
  console.log("hi");

  let urlKeyword = req.params.url;
  let url = `https://www.amazon.com/s?k=${urlKeyword}&ref=nb_sb_noss_2`;
  let arrItems = [];

  let browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(url);

  // get hotel details
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);

  let $ = cheerio.load(bodyHTML);

  let htmlKing = await $(".s-include-content-margin").each((index, element) => {
    let obj = {};
    if (index < 16) {
      $(element)
        .find(".s-image")
        .each(function(i, ele) {
          obj.image = $(ele).attr("src");
        });
      if (
        $(element)
          .find(".s-line-clamp-2 > a")
          .text() != ""
      ) {
        $(element)
          .find(".s-line-clamp-2 > a")
          .each(function(i, ele2) {
            console.log( $(ele2).text());
            obj.link = "https://www.amazon.com" + $(ele2).attr("href");
          });
      } else {
        $(element)
          .find("[data-component-type=s-product-image] > a")
          .each(function(i, ele2) {

            obj.link = "https://www.amazon.com" + $(ele2).attr("href");
          });
      }

      if (
        $(element)
          .find(".s-line-clamp-2 > a > span")
          .text() != ""
      ) {
        $(element)
          .find(".s-line-clamp-2 > a > span")
          .each(function(i, ele2) {
            obj.title = $(ele2).text();
          });
      } else {
        $(element)
          .find(".a-size-base-plus")
          .each(function(i, ele2) {
            obj.title = $(ele2).text();
          });
      }

      $(element)
        .find(".a-offscreen")
        .each(function(i, ele) {
          obj.price = $(ele).text();
        });
      $(element)
        .find(".a-icon-alt")
        .each(function(i, ele) {
          obj.rattings = $(ele).text();
        });

      arrItems.push(obj);
    }
  });
  let itemsAverage = await getNewAvgP(arrItems);
  browser.close();

  res.send({ arrItems, itemsAverage });
});

const getNewAvgP = async items => {
  let totalPrice = 0;
  let totalStar = 0;
  let price;
  let star;
  let review;
  let count = 0;
  items.forEach(element => {
    if (element.price != undefined) {
      price = element.price.substring(1, 500);
      let a = parseFloat(price);
      if (!isNaN(a)) {
        totalPrice += a;
      }
    }


    if (element.rattings != undefined) {
      count++;
      star = +element.rattings.substring(0, 3);
      totalStar += star;
    }
  });
  let avgPrice = (totalPrice / items.length).toFixed(2);
  let avgStar = (totalStar / count).toFixed(2);

  return {
    avgPrice,
    avgStar
  };
};

app.post("/getItems", async (req, res) => {
  let arrItems = req.body.items;

  let browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const newpage = await browser.newPage();
  await newpage.setViewport({ width: 1920, height: 926 });
  for (let i = 0; i < arrItems.length; i++) {
    await newpage.goto(arrItems[i].link);
    let bodyHTMLNew = await newpage.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHTMLNew);

    let htmlKing = await $("tr").each((index, element) => {
      if (
        $(element)
          .text()
          .includes("Best Sellers Rank")
      ) {
        if ($(element).find("#SalesRank").length > 0) {
          arrItems[i].description = $(element)
            .find("#SalesRank")
            .text();
        } else {
          arrItems[i].description = $(element).text();
        }
      }
    });
  }
  let avgPrice = await getAvgP(arrItems);
  browser.close();

  res.send({ arrItems, avgPrice });
});
app.get('/newDemoScraper',(req,res)=>{
res.render('newIndexScrap')
})
app.post("/scraperApi/:keyItem", async (req, res) => {
  let url = `https://www.amazon.co.uk/s?k=${req.params.keyItem}&ref=nb_sb_noss`;
  let arrItems = [];
  let newArr = [];

  let html = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      url
  );

  let $ = cheerio.load(html.data);

  let bodyHTML = await $(".s-include-content-margin").each((index, element) => {
    let obj = {};
    if (index < 22) {
      $(element)
        .find(".s-image")
        .each(function(i, ele) {
          obj.image = $(ele).attr("src");
        });
      if (
        $(element)
          .find(".s-line-clamp-2 > a")
          .text() != ""
      ) {
        $(element)
          .find(".s-line-clamp-2 > a")
          .each(function(i, ele2) {
            obj.link = "https://www.amazon.co.uk" + $(ele2).attr("href");
          });
      } else {
        $(element)
          .find("[data-component-type=s-product-image] > a")
          .each(function(i, ele2) {
            obj.link = "https://www.amazon.co.uk" + $(ele2).attr("href");
          });
      }

      if (
        $(element)
          .find(".s-line-clamp-2 > a > span")
          .text() != ""
      ) {
        $(element)
          .find(".s-line-clamp-2 > a > span")
          .each(function(i, ele2) {
            obj.title = $(ele2).text();
          });
      } else {
        $(element)
          .find(".a-size-base-plus")
          .each(function(i, ele2) {
            obj.title = $(ele2).text();
          });
      }

      $(element)
        .find(".a-offscreen")
        .each(function(i, ele) {
          obj.price = $(ele).text();
        });
      $(element)
        .find(".a-icon-alt")
        .each(function(i, ele) {
          obj.rattings = $(ele).text();
        });

      arrItems.push(obj);
    }
  });

  // console.log(arrItems)
  arrItems.forEach(async item => {
    if (item.link.includes("/gp/slredirect")) {
      console.log(item.link);
    } else {
      newArr.push(item);
    }
  });

  console.log(newArr[0].link);

  let htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[0].link
  );

  $ = cheerio.load(htmlbody.data);

  let htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[0].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[0].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[0].description = $("#SalesRank").text();
    }
  });
  let sellerType = await $("#merchant-info");
  let selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[0].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[0].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[0].sellerType = "FBM";
  }
  let brandName = await $("#bylineInfo");
  newArr[0].brandName = brandName.text();

   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[1].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[1].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[1].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[1].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[1].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[1].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[1].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[1].brandName = brandName.text();

  // let titleB= await $("#productTitle");
  // let title= titleB.text().trim();
  // arrItems[i].title=title;

   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[2].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[2].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[2].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[2].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[2].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[2].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[2].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[2].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[3].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[3].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[3].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[3].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[3].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[3].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[3].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[3].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[4].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[4].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[4].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[4].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[4].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[4].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[4].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[4].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[5].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[5].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[5].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[5].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[5].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[5].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[5].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[5].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[6].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[6].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[6].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[6].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[6].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[6].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[6].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[6].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[7].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[7].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[7].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[7].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[7].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[7].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[7].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[7].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[8].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[8].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[8].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[8].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[8].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[8].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[8].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[8].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[9].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[9].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[9].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[9].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[9].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[9].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[9].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[9].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[10].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[10].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[10].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[10].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[10].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[10].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[10].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[10].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[11].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[11].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[11].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[11].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[11].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[11].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[11].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[11].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[12].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[12].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[12].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[12].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[12].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[12].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[12].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[12].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[13].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[1].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[13].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[13].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[13].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[13].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[13].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[13].brandName = brandName.text();
   htmlbody = await axios.get(
    "http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=" +
      newArr[14].link
  );
  $ = cheerio.load(htmlbody.data);
   htmlKing = await $("tr").each((index, element) => {
    if (
      $(element)
        .text()
        .includes("Best Sellers Rank")
    ) {
      if ($(element).find("#SalesRank").length > 0) {
        newArr[14].description = $(element)
          .find("#SalesRank")
          .text();
      } else {
        newArr[14].description = $(element).text();
      }
    } else if (
      $("#SalesRank")
        .text()
        .includes("Sellers Rank")
    ) {
      newArr[14].description = $("#SalesRank").text();
    }
  });
   sellerType = await $("#merchant-info");
   selT = sellerType.text().trim();
  if (selT.includes("Ships from")) {
    newArr[14].sellerType = "AMZ";
  } else if (selT.includes("Fulfilled by Amazon")) {
    newArr[14].sellerType = "FBA";
  } else if (selT.includes("Fulfilled by")) {
    newArr[14].sellerType = "FBM";
  }
   brandName = await $("#bylineInfo");
  newArr[14].brandName = brandName.text();
console.log(newArr)
 res.send(newArr);
});
const getNewItems = async url => {
  let arrItems = [];
  //   request(
  //         {
  //           method: 'GET',
  //           url: 'http://api.scraperapi.com/?api_key=YOURAPIKEY&url=' + url,
  //           headers: {
  //             Accept: 'application/json',
  //           },
  //         },
  //         async function(error, response, body) {
  //             let $ = cheerio.load(body);
  //             let htmlKing = await $(".s-include-content-margin").each((index, element) => {
  //                 let obj = {};
  //                 if (index < 16) {
  //                     $(element).find(".s-image")
  //                         .each(function (i, ele) {
  //                             obj.image = $(ele).attr("src");
  //                         });

  //                     if (
  //                         $(element).find('span[data-component-type="s-product-image"] > a').text() != "") {
  //                         $(element).find('span[data-component-type="s-product-image"] > a').each(function (i, ele2) {
  //                             console.log($(ele2).attr("href"))
  //                                 obj.link = "https://www.amazon.com" + $(ele2).attr("href");
  //                             });
  //                     } else {
  //                         $(element)
  //                             .find("[data-component-type=s-product-image] > a")
  //                             .each(function (i, ele2) {
  //                                 obj.link = "https://www.amazon.com" + $(ele2).attr("href");
  //                                 console.log(obj.link)
  //                             });
  //                     }

  //                     if (
  //                         $(element).find(".s-line-clamp-2 > a > span").text() != "") {
  //                         $(element).find(".s-line-clamp-2 > a > span").each(function (i, ele2) {
  //                             obj.title = $(ele2).text();
  //                         });
  //                     } else {
  //                         $(element).find(".a-size-base-plus").each(function (i, ele2) {
  //                                 obj.title = $(ele2).text();
  //                             });
  //                     }

  //                     $(element).find(".a-offscreen").each(function (i, ele) {
  //                             obj.price = $(ele).text();
  //                         });
  //                     $(element)
  //                         .find(".a-icon-alt")
  //                         .each(function (i, ele) {
  //                             obj.rattings = $(ele).text();
  //                         });

  //                     arrItems.push(obj);
  //                 }
  //             });

  //         }
  //       );

  // for (let i = 0; i < arrItems.length; i++) {
  //     console.log(arrItems[i].link)
  //     let bodyHTMLNew=await axios.get('http://api.scraperapi.com/?api_key=a299f043f6b46efc4f35b860a5b279e0&url=' + arrItems[i].link)

  //     let $ = cheerio.load(bodyHTMLNew.data);

  //     let htmlKing = await $("tr").each((index, element) => {
  //         if ($(element).text().includes("Best Sellers Rank")) {

  //             if ($(element).find("#SalesRank").length > 0) {

  //                 arrItems[i].description = $(element)
  //                     .find("#SalesRank")
  //                     .text();
  //             } else {

  //                 arrItems[i].description = $(element).text();

  //             }
  //         }else if($("#SalesRank").text().includes("Sellers Rank")){
  //             arrItems[i].description =$("#SalesRank").text();
  //         }
  //     });
  //     let sellerType= await $("#merchant-info");
  //     let selT= sellerType.text().trim();
  //     if(selT.includes("Ships from")){
  //         arrItems[i].sellerType="AMZ"

  //     }else if(selT.includes("Fulfilled by Amazon")){
  //         arrItems[i].sellerType="FBA"
  //     }else if(selT.includes("Fulfilled by")){
  //         arrItems[i].sellerType="FBM"
  //     }
  //     let brandName= await $("#bylineInfo");
  //     arrItems[i].brandName=brandName.text();

  //     // let titleB= await $("#productTitle");
  //     // let title= titleB.text().trim();
  //     // arrItems[i].title=title;
  // }
};

const port = process.env.PORT || "3001";
app.listen(port, () => {
  console.log("Server is Fired on Port : " + port);
});
