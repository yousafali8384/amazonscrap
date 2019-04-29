var fetchCheerioObject = require("fetch-cheerio-object");

var bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require("cheerio"),
    cheerioAdv = require("cheerio-advanced-selectors"),
    axios = require("axios"),
    app = express();

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

const getItems = async url => {
    try {
        var arrItems = [];

        const $ = await fetchCheerioObject(url);

        var htmlKing = $(".s-include-content-margin").each((index, element) => {
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
        console.log(arrItems);

        return arrItems;
    } catch (err) {
        console.log(err);
    }
};
const getNewItems = async items => {
    var newObj = [];

    try {
        console.log(items[0].link);
        const $ = await fetchCheerioObject(items[0].link);

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

                    items[0].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    console.log("else")

                    items[0].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        console.log(err);
    }

    try {
        console.log(items[1].link);
        const $ = await fetchCheerioObject(items[1].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    console.log(
                        $(element)
                            .find("#SalesRank")
                            .text()
                    );
                } else {
                    items[1].description = $(element).text();
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
    try {
        console.log(items[2].link);

        const $ = await fetchCheerioObject(items[2].link);
        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[2].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[2].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[3].link);

        const $ = await fetchCheerioObject(items[3].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[3].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[3].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
    try {
        console.log(items[4].link);
        const $ = await fetchCheerioObject(items[4].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[4].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[4].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        if (err) {
        }
        console.log(err);
    }
    try {
        console.log(items[5].link);
        const $ = await fetchCheerioObject(items[5].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[5].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[5].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
    try {
        const $ = await fetchCheerioObject(items[6].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[6].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[6].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[7].link);
        const $ = await fetchCheerioObject(items[7].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[7].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[7].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[8].link);
        const $ = await fetchCheerioObject(items[8].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[8].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[8].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }

    try {
        console.log(items[9].link);
        const $ = await fetchCheerioObject(items[9].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find("#SalesRank").length>0) {
                    items[9].description = $(element)
                        .find("#SalesRank")
                        .text();
                } else {
                    items[9].description = $(element).text();
                    console.log($(element).text());
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[10].link);
        const $ = await fetchCheerioObject(items[10].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find('#SalesRank').length>0) {
                    items[10].description = $(element).find('#SalesRank').text()
                } else {
                    items[10].description = $(element).text();
                    console.log($(element).text())
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[11].link);

        const $ = await fetchCheerioObject(items[11].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find('#SalesRank').length>0) {
                    items[11].description = $(element).find('#SalesRank').text()
                } else {
                    items[11].description = $(element).text();
                    console.log($(element).text())
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[12].link);
        const $ = await fetchCheerioObject(items[12].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find('#SalesRank').length>0) {
                    items[12].description = $(element).find('#SalesRank').text()
                } else {
                    items[12].description = $(element).text();
                    console.log($(element).text())
                }
            }
        });
    } catch (err) { }
    try {
        console.log(items[13].link);
        const $ = await fetchCheerioObject(items[13].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find('#SalesRank').length>0) {
                    items[13].description = $(element).find('#SalesRank').text()
                } else {
                    items[13].description = $(element).text();
                    console.log($(element).text())
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[14].link);

        const $ = await fetchCheerioObject(items[14].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find('#SalesRank').length>0) {
                    items[14].description = $(element).find('#SalesRank').text()
                } else {
                    items[14].description = $(element).text();
                    console.log($(element).text())
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    try {
        console.log(items[15].link);
        const $ = await fetchCheerioObject(items[15].link);

        $("tr").each((index, element) => {
            if (
                $(element)
                    .text()
                    .includes("Best Sellers Rank")
            ) {
                if ($(element).find('#SalesRank').length>0) {
                    items[15].description = $(element).find('#SalesRank').text()
                } else {
                    items[15].description = $(element).text();
                    console.log($(element).text())
                }
            }
        });
    } catch (err) {
        // console.log(err)
    }
    return items;
};

app.post("/get-items", async (req, res) => {
    let url = `https://www.amazon.com/s?k=${
        req.body.itemSearch
        }&ref=nb_sb_noss_2`;
    // getItems(url)

    var items = await getItems(url).then(async response => {
        var newItems = await getNewItems(response).then(async items => {
            var avgPrice = await getAvgP(items);

            res.render("show", {
                items,
                avgPrice
            });
        });
    });
});

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

app.listen(process.env.PORT || 3001, () => {
    console.log("Server is Fired on Port : " + 3001);
});
