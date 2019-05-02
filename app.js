const puppeteer = require('puppeteer');
var fetchCheerioObject = require("fetch-cheerio-object");

var bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require("cheerio"),
    cheerioAdv = require("cheerio-advanced-selectors"),
    axios = require("axios"),
    env = require('dotenv'),
    app = express();
env.config();
cheerio = cheerioAdv.wrap(cheerio);

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

app.get("/", (req, res) => {
    res.render("index");
});
app.post("/get-items", async (req, res) => {
    let url = `https://www.amazon.com/s?k=${
        req.body.itemSearch
        }&ref=nb_sb_noss_2`;
    // getItems(url)

    var items = await getItems(url);
    console.log(items)
    var avgPrice = await getAvgP(items);

            res.render("show", {
                items,
                avgPrice
            });
      
    });



const getItems = async url => {
    var arrItems = [];

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(url);

    // get hotel details
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    console.log(bodyHTML);
    var $ = cheerio.load(bodyHTML);

      var htmlKing = await $(".s-include-content-margin").each((index, element) => {
          var obj = {};
          if (index < 16) {
              $(element)
                  .find(".s-image")
                  .each(function (i, ele) {
                      obj.image = $(ele).attr("src");
                  });
              if (
                  $(element)
                      .find(".s-line-clamp-2 > a")
                      .text() != ""
              ) {
                  $(element)
                      .find(".s-line-clamp-2 > a")
                      .each(function (i, ele2) {
                          obj.link = "https://www.amazon.com" + $(ele2).attr("href");
                      });
              } else {
                  $(element)
                      .find("[data-component-type=s-product-image] > a")
                      .each(function (i, ele2) {
                          obj.link = "https://www.amazon.com" + $(ele2).attr("href");
                      });
              }
              console.log(
                  $(element)
                      .find(".s-line-clamp-2 > a > span")
                      .text()
              );
              if (
                  $(element)
                      .find(".s-line-clamp-2 > a > span")
                      .text() != ""
              ) {
                  console.log("hias");
                  $(element)
                      .find(".s-line-clamp-2 > a > span")
                      .each(function (i, ele2) {
                          obj.title = $(ele2).text();
                      });
              } else {
                  $(element)
                      .find(".a-size-base-plus")
                      .each(function (i, ele2) {
                          obj.title = $(ele2).text();
                      });
              }

              $(element)
                  .find(".a-offscreen")
                  .each(function (i, ele) {
                      obj.price = $(ele).text();
                  });
              $(element)
                  .find(".a-icon-alt")
                  .each(function (i, ele) {
                      obj.rattings = $(ele).text();
                  });

              arrItems.push(obj);
          }
      });
      const newpage = await browser.newPage();
        await newpage.setViewport({ width: 1920, height: 926 });
      for(var i=0;i<arrItems.length;i++){
        
      await newpage.goto(arrItems[i].link);
      let bodyHTMLNew = await newpage.evaluate(() => document.body.innerHTML);
  
        
        var $ = cheerio.load(bodyHTMLNew);
      
        var htmlKing = await $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                console.log("out")
                if ($(element).find("#SalesRank").length>0) {
                    console.log()
      
                    console.log("if")
      
                    arrItems[i].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    console.log("else")
      
                    arrItems[i].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
      }
    
      return arrItems;
};

const getAvgP = async items => {
    var totalPrice = 0;
    var totalStar = 0;
    var totalBest = 0;
    var price;
    var star;
    var bestSell;
    var count = 0;
    var BestSellrCount = 0;
    items.forEach(element => {
        if (element.price != undefined) {
            price = element.price.substring(1, 500);
            var a = parseFloat(price);

            totalPrice += a;
        }

        if (element.rattings != undefined) {
            count++;
            star = +element.rattings.substring(0, 3);
            totalStar += star;
        }

        if (element.description != undefined && element.description != "") {
            BestSellrCount++;
            var newKing = element.description.replace(/\s+/g, " ").trim();
            var newDescription = newKing.substring((newKing.indexOf("#")+1), 40).split(" ")[0];
            bestSell = +newDescription.replace(/,/g, "");
            console.log(bestSell)
            totalBest += bestSell;
        }
    });
    var avgPrice = (totalPrice / items.length).toFixed(2);
    var avgStar = (totalStar / count).toFixed(2);
    var avgBestSell = (totalBest / BestSellrCount).toFixed(2);

    return {
        avgPrice,
        avgStar,
        avgBestSell
    };
};

const port = (process.env.PORT || "3001");
app.listen(port, () => {
    console.log('Server is Fired on Port : ' + port);
});