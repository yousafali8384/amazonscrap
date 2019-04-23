var bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require('cheerio'),
    cheerioAdv = require('cheerio-advanced-selectors'),
    axios = require('axios'),
    app = express();



cheerio = cheerioAdv.wrap(cheerio);


app.set("view engine", "ejs");
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));


app.get('/', (req, res) => {
    res.render('index');

});



const getItems = async (url) => {
    try {


        var arrItems = [];
        var htmlResult = await axios.get(url,{
            
                headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36','cookie':'session-id=130-6204732-5270907; session-id-time=2082787201l; i18n-prefs=USD; sp-cdn="L5Z9:PK"; ubid-main=134-2184397-8776459; session-token=mU2A9LlqukWQfGa7O6asGQzqEc5iMx5swpxzmHZ7jSQHxicxyu1Rjm9a+bejWjEpqNSMPCylyRKeAYBzCPnNycrC1WXAGVdUZiWRlQBoUf4cqYMSDCJwTKQDwRjaWGDu4wxaxXo7q0LAc7kVStFSSwgDlMz2c5ANXGRWGoAekjGZuPBn7A2e7qddts0PMTa5; x-wl-uid=19GVCz1vYVQmbpADNdau6SPgQkWOZGXS9nIFKmp/xUOrXbPAqlv6d9iLerGSUGsF2GJ2zasbCANg=; csm-hit=tb:s-M134W92HQWZ4K99G6T2D|1555400479351&t:1555400482545&adb:adblk_no'}
                
              
        });
        var $ = await cheerio.load(htmlResult.data);


        var htmlKing = await $('.s-include-content-margin').each((index, element) => {
            var obj = {};
            if (index < 16) {
                $(element).find('.s-image').each(function (i, ele) {

                    obj.image = $(ele).attr('src');

                });
                if ($(element).find('.s-line-clamp-2 > a').text() != "") {
                    $(element).find('.s-line-clamp-2 > a').each(function (i, ele2) {

                        obj.link = "https://www.amazon.com" + $(ele2).attr('href');


                    });
                } else {
                    $(element).find('[data-component-type=s-product-image] > a').each(function (i, ele2) {

                        obj.link = "https://www.amazon.com" + $(ele2).attr('href');


                    });

                }
                console.log($(element).find('.s-line-clamp-2 > a > span').text())
                if ($(element).find('.s-line-clamp-2 > a > span').text() != "") {
                    console.log("hias")
                    $(element).find('.s-line-clamp-2 > a > span').each(function (i, ele2) {
                        obj.title = $(ele2).text();

                    });
                } else {

                    $(element).find('.a-size-base-plus').each(function (i, ele2) {
                        obj.title = $(ele2).text();

                    });
                }

                $(element).find('.a-offscreen').each(function (i, ele) {

                    obj.price = $(ele).text();


                });
                $(element).find('.a-icon-alt').each(function (i, ele) {

                    obj.rattings = $(ele).text();


                });

                arrItems.push(obj)
            }


        });

        return arrItems;


    } catch (err) {
        console.log(err);
    }

}
const getNewItems = async (items) => {
    var newObj = []

    try {
        console.log(items[0].link)
        var htmlResult = await axios.get(items[0].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });
        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[0].description = $(element).text();
            }


        })



    } catch (err) {
        console.log(err)

    }

    try {
        console.log(items[1].link)
        var htmlResult = await axios.get(items[1].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });
        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[1].description = $(element).text();
            }
        })

    } catch (err) {
        console.log(err)

    }
    try {
        console.log(items[2].link)

        var htmlResult = await axios.get(items[2].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[2].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[3].link)

        var htmlResult = await axios.get(items[3].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[3].description = $(element).text();
            } else {
                items[3].description = "";
            }
        })


    } catch (err) {
        console.log(err)

    }
    try {
        console.log(items[4].link)
        var htmlResult = await axios.get(items[4].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[4].description = $(element).text();
            }
        })
    } catch (err) {
        if(err){

        }
        console.log(err)

    }
    try {
        console.log(items[5].link)
        var htmlResult = await axios.get(items[5].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[5].description = $(element).text();
            }
        })

    } catch (err) {
        console.log(err)

    }
    try {
        var htmlResult = await axios.get(items[6].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[6].description = $(element).text();
            }
        })


    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[7].link)
        var htmlResult = await axios.get(items[7].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[7].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[8].link)
        var htmlResult = await axios.get(items[8].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                console.log("hi")
                items[8].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }

    try {
        console.log(items[9].link)
        var htmlResult = await axios.get(items[9].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[9].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[10].link)
        var htmlResult = await axios.get(items[10].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[10].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[11].link)

        var htmlResult = await axios.get(items[11].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[11].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[12].link)
        var htmlResult = await axios.get(items[12].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[12].description = $(element).text();
            }
        })

    } catch (err) {

    }
    try {
        console.log(items[13].link)
        var htmlResult = await axios.get(items[13].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[13].description = $(element).text();
            }
        })
    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[14].link)
        var htmlResult = await axios.get(items[14].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[14].description = $(element).text();
            }
        })
    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[15].link)
        var htmlResult = await axios.get(items[15].link.replace(/ref.*/g,''),{
            
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'},
            
          
    });


        var $ = await cheerio.load(htmlResult.data);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                items[15].description = $(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    return items
}



app.post('/get-items', async (req, res) => {

    let url = `https://www.amazon.com/s?k=${req.body.itemSearch}&ref=nb_sb_noss_2`;
    // getItems(url)

    var items = await getItems(url).then(async (response) => {
        var newItems = await getNewItems(response).then(async (items) => {
            var avgPrice = await getAvgP(items);

            res.render('show', {
                items,
                avgPrice
            });


        })
    });




});

const getAvgP = async (items) => {
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
            var newKing = element.description.replace(/\s+/g, ' ').trim();
            var newDescription = newKing.substring(19, 40).split(" ")[0];
            bestSell = +newDescription.replace(/,/g, '');
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
}

app.listen(process.env.PORT || 3001, () => {
    console.log('Server is Fired on Port : ' + 3001);
});