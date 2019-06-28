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
  let getSale = await getTheSale(items);
  let avgPrice = await getAvgP(items,getSale);
  console.log(items)
  res.send({ items, avgPrice });
  // res.render("show", {
  //     items,
  //     avgPrice
  // });
});

let getItems = async url => {
  let arrItems = [];
  try {
    let browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    //
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    // get hotel details
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHTML);

    let htmlKing = await $(".s-include-content-margin").each(
      (index, element) => {
        let obj = {};
        obj.title='';
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
        if( $(element).find(".a-price > span") .text() != ""){
          $(element)
          .find(".a-price > span")
          .each(function(i, ele) {
            obj.price = $(ele).text();

          console.log($(ele).text());
          });
        }else{
          $(element)
          .find(".a-spacing-top-mini > div ")
          .each(function(i, ele) {
            obj.price = $(ele.children[2]).text();

          });

        }
       
          $(element)
            .find(".a-icon-alt")
            .each(function(i, ele) {
              obj.rattings = $(ele).text();
            });

          arrItems.push(obj);
        }
      }
    );
  
    //
    let newpage = await browser.newPage();
    await newpage.setViewport({ width: 1920, height: 926 });

    for (let i = 0; i < arrItems.length; i++) {
      await newpage.goto(arrItems[i].link, { waitUntil: "load", timeout: 0 });
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
            var startIndex = arrItems[i].description.indexOf("in") + 3;
            var endIndex = arrItems[i].description.indexOf("(") - 1;
            var category = arrItems[i].description.substring(
              startIndex,
              endIndex
            );
            arrItems[i].category = category;
          }
        } else if (
          $("#SalesRank")
            .text()
            .includes("Sellers Rank")
        ) {
          arrItems[i].description = $("#SalesRank").text();
          var startIndex = arrItems[i].description.indexOf("in") + 3;
          var endIndex = arrItems[i].description.indexOf("(") - 1;
          var category = arrItems[i].description.substring(
            startIndex,
            endIndex
          );
          arrItems[i].category = category;
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
    browser.close();
    return arrItems;
  } catch (err) {
    console.log(err);
  }
};

let getAvgP = async (items,sale) => {
  let totalPrice = 0;
  let totalStar = 0;
  let totalBest = 0;
  let price;
  let star;
  let bestSell;
  let count = 0;
  let BestSellrCount = 0;
  let totalReview = 0;
  let reviewCount = 0;
  let minPrice = 0;
  let maxPrice = 0;
  let fba = 0;
  let fbm = 0;
  let amz = 0;
  let amzPer = 0;
  let fbaPer = 0;
  let fbmPer = 0;
  let avgSelerType;
  let countArr = [];
  let brand = "";
  let budget = 0;
  items.forEach(item => {
    if (item.sellerType == "AMZ") {
      amz = amz + 1;
    } else if (item.sellerType == "FBM") {
      fbm = fbm + 1;
    } else if (item.sellerType == "FBA") {
      fba = fba + 1;
    }

    countArr[item.brandName] = (countArr[item.brandName] || 0) + 1;

    if (item.price != undefined && item.price != "") {
      price = item.price.substring(1, 500);
      let a = parseFloat(price);
      minPrice = a;
      maxPrice = a;
    }
  });
  items.forEach(element => {
    if (element.price != undefined) {
      price = element.price.substring(1, 500);
      let a = parseFloat(price);

      if (!isNaN(a)) {
        if (a < minPrice) {
          minPrice = a;
        }
        if (a > maxPrice) {
          maxPrice = a;
        }
        totalPrice += a;
      }
    }
    if (element.rattings != undefined) {
      count++;
      star = +element.rattings.substring(0, 3);
      totalStar += star;
    }
    if (element.reviews != undefined && element.reviews != "") {
      reviewCount++;
      review = element.reviews.replace(",", "");
      review = +review.match(/(.*?)\s/)[0];

      totalReview += review;
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

  for (let key in countArr) {
    if (countArr[key] >= 6) {
      brand = "YES";
    } else {
      brand = "NO";
    }
  }

  amzPer = (amz / 16) * 100;
  fbaPer = (fba / 16) * 100;
  fbmPer = (fbm / 16) * 100;

  if (amz > fbm && amz > fba) avgSelerType = "AMZ (" + amzPer + ")%";
  else if (fbm > amz && fbm > fba) avgSelerType = "FBM (" + fbmPer + ")%";
  else avgSelerType = "FBA (" + fbaPer + ")%";

  let avgPrice=0;
  avgPrice = (totalPrice / items.length).toFixed(2);
  let avgStar =0;
  avgStar= (totalStar / count).toFixed(2);
  let avgBestSell =0;
  avgBestSell= (totalBest / BestSellrCount).toFixed(2);
  
  let avgReviews=0;
  avgReviews = (totalReview / reviewCount).toFixed(2);
  let opportunity;
  budget = avgPrice * 400;

  if (brand == "YES") {
    opportunity = "LOW"
} else if (amzPer > 50) {
    opportunity = "LOW"
} else if (totalReview > 200 && sale < 5000) {
    opportunity = "LOW"
} else if (totalReview > 200 && sale >= 5000 && sale <= 10000) {
    opportunity = "LOW"
} else if (totalReview > 200 && sale > 10000) {
    opportunity = "MED"
} else if (totalReview >= 100 && totalReview <= 200 && sale < 5000) {
    opportunity = "LOW"
} else if (totalReview >= 100 && totalReview <= 200 && sale >= 5000 && sale <= 10000) {
    opportunity = "MED"
} else if (totalReview >= 100 && totalReview <= 200 && sale > 10000) {
    opportunity = "HIGH"
} else if (totalReview < 100 && sale < 5000) {
    opportunity = "LOW"
} else if (totalReview < 100 && sale >= 5000 && sale <= 10000) {
    opportunity = "MED"
} else if (totalReview < 100 && sale > 10000) {
    opportunity = "MED"
}



  return {
    avgPrice,
    avgStar,
    avgBestSell,
    avgReviews,
    minPrice,
    maxPrice,
    avgSelerType,
    amzPer,
    fbmPer,
    fbaPer,
    brand,
    budget,
    sale,
    opportunity
  };
};

let getTheSale = async items => {

  let ranks=[];
  let selObj={};
  let sales=0;
  let isAppliances=false;
  let isBaby=false;
  let isBeauty=false;
  let isIndustrial=false;
  let isBook=false;
  let isArts=false;
  let isAutomotive=false;

  items.forEach(element => {
    if (element.category == "Books") {
      isBook=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="14"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
    if (element.category == "Appliances") {
      isAppliances=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="11"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
    if (element.category == "Baby") {
      isBaby=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="12"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
    if (element.category == "Beauty") {
      isBeauty=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="13"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
    if (element.category == "Industrial & Scientific") {
      isIndustrial=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="15"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
    if (element.category == "Arts") {
      isArts=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="16"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
    if (element.category == "Automotive") {
      isAutomotive=true;
      let newKing = element.description.replace(/\s+/g, " ").trim();
      let newDescription = newKing
        .substring(newKing.indexOf("#") + 1, 40)
        .split(" ")[0];
      bestSell = +newDescription.replace(/,/g, "");
      selObj.attribute="17"
      selObj.rank=""+bestSell;
      ranks.push(selObj);
    }
  });

  axios.defaults.headers.common['x-api-key'] = "5etHSY6yZpiqz1PPuXSZw8LvCdfZ5JivdYROinfuaJYwftWsEHdGZwO2aSts";
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

 let sale = await axios({
    method: 'post',
    url: 'http://api.gigcodes.com/api/get/sales',
    data: {
      ranks
    }  
  });

  sale.data.sales_arr.forEach(element => {
    sales+=element.units;
    });
    
  return sales.toFixed(2);
};

const port = process.env.PORT || "3001";
app.listen(port, () => {
  console.log("Server is Fired on Port : " + port);
});
