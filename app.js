const puppeteer = require('puppeteer');
let fetchCheerioObject = require("fetch-cheerio-object");

let bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require("cheerio"),
    cheerioAdv = require("cheerio-advanced-selectors"),
    axios = require("axios"),
    env = require('dotenv'),
    app = express();
let path = require('path')
env.config();
cheerio = cheerioAdv.wrap(cheerio);


app.use(express.static('/public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/static'));
app.get('/new',(req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'))
})
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

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });


app.get("/", (req, res) => {
    res.render("index");
});

app.post("/get-items/:itemSearch", async (req, res) => {
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

    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });

    await page.goto(url);

    // get hotel details
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHTML);
    console.log(bodyHTML)

    let htmlKing = await $(".s-include-content-margin").each((index, element) => {
        let obj = {};
        if (index < 16) {
            $(element).find(".s-image")
                .each(function (i, ele) {
                    obj.image = $(ele).attr("src");
                });
            if (
                $(element).find(".s-line-clamp-2 > a").text() != "") {
                $(element).find(".s-line-clamp-2 > a").each(function (i, ele2) {
                        obj.link = "https://www.amazon.com" + $(ele2).attr("href");
                    });
            } else {
                $(element)
                    .find("[data-component-type=s-product-image] > a")
                    .each(function (i, ele2) {
                        obj.link = "https://www.amazon.com" + $(ele2).attr("href");
                    });
            }

            if (
                $(element).find(".s-line-clamp-2 > a > span").text() != "") {
                $(element)
                    .find(".s-line-clamp-2 > a > span").each(function (i, ele2) {
                     
                    });
            } else {
                $(element).find(".a-size-base-plus").each(function (i, ele2) {
                        obj.title = $(ele2).text();
                        console.log(obj.title)
                    });
            }

            $(element).find(".a-offscreen").each(function (i, ele) {
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
    for (let i = 0; i < arrItems.length; i++) {

        await newpage.goto(arrItems[i].link);
        let bodyHTMLNew = await newpage.evaluate(() => document.body.innerHTML);


        let $ = cheerio.load(bodyHTMLNew);

        let htmlKing = await $("tr").each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {

                if ($(element).find("#SalesRank").length > 0) {


                    arrItems[i].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {

                    arrItems[i].description = $(element).text();

                }
            }else if($("#SalesRank").text().includes("Sellers Rank")){
                arrItems[i].description =$("#SalesRank").text();
            }
        });
        let sellerType= await $("#merchant-info");
        let selT= sellerType.text().trim();
        if(selT.includes("Ships from")){
            arrItems[i].sellerType="AMZ"

        }else if(selT.includes("Fulfilled by Amazon")){
            arrItems[i].sellerType="FBA"
        }else if(selT.includes("Fulfilled by")){
            arrItems[i].sellerType="FBM"
        }
        let brandName= await $("#bylineInfo");
        arrItems[i].brandName=brandName.text();
        
    } 
    browser.close();
    console.log(arrItems)
    return arrItems;
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
    items.forEach(element => {
        if (element.price != undefined) {
            price = element.price.substring(1, 500);
            let a = parseFloat(price);

            if (!isNaN(a)) {
                totalPrice += a;
            }
        }
console.log(element.rattings)
        if (element.rattings != undefined) {
            count++;
            star = +element.rattings.substring(0, 3);
            totalStar += star;
        }

        if (element.description != undefined && element.description != "") {
            BestSellrCount++;
            let newKing = element.description.replace(/\s+/g, " ").trim();
            let newDescription = newKing.substring((newKing.indexOf("#") + 1), 40).split(" ")[0];
            bestSell = +newDescription.replace(/,/g, "");
            totalBest += bestSell;
        }
    });
    let avgPrice = (totalPrice / items.length).toFixed(2);
    let avgStar = (totalStar / count).toFixed(2);
    let avgBestSell = (totalBest / BestSellrCount).toFixed(2);

    return {
        avgPrice,
        avgStar,
        avgBestSell
    };
};

app.get('/newDemo', (req, res) => {
    res.render('newIndex')
});

app.get('/40/keywords', (req,res) => {
    res.render('keywordsFourty')
})


app.get('/getLinks/:url', async (req, res) => {
    console.log('hi')

    let urlKeyword = req.params.url;
    let url = `https://www.amazon.com/s?k=${
        urlKeyword
        }&ref=nb_sb_noss_2`;
    let arrItems = [];

    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
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

            if (
                $(element)
                    .find(".s-line-clamp-2 > a > span")
                    .text() != ""
            ) {

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
    let itemsAverage = await getNewAvgP(arrItems);
    browser.close();

    res.send({ arrItems, itemsAverage });
});


const getNewAvgP = async items => {
    let totalPrice = 0;
    let totalStar = 0;
    let price;
    let star;
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

app.post('/getItems', async (req, res) => {
    let arrItems = req.body.items;

    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

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

const port = (process.env.PORT || "3001");
app.listen(port, () => {
    console.log('Server is Fired on Port : ' + port);
});