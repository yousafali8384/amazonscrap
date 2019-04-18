var bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require('cheerio'),
    cheerioAdv = require('cheerio-advanced-selectors'),
    axios = require('axios'),
    async = require('async'),
     app = express();


const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false,restart: false });

        
        
          
 
app.set("view engine", "ejs");
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));


var myfun = async (url) => {

    var arrItems = [];

    var myHtml = await nightmare.goto(url).evaluate(function () {

        //here is where I want to return the html body
        return document.body.innerHTML;


    })
        .then(async function (body) {
            //loading html body to cheerio

            var $ = await cheerio.load(body);


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
            // console.log(arrItems) ;
        });
    return arrItems;
}

const sellerRank = async (newitems) => {
    var newObj = []

    
   

    for(const link of newitems){
        var myHtml = await nightmare.goto(link.link).evaluate(function () {
        //here is where I want to return the html body
        return document.body.innerHTML;


    })
        .then(async function (body) {
            //loading html body to cheerio

        try {
      
        var $ = cheerio.load(body);

        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if ($(element).text().includes("Best Sellers Rank")) {
                link.description = $(element).text();
            }


        })

        newObj.push(link);

    } catch (err) {
        console.log(err)

    }

        });
    

    }

    
   return newObj;

}

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




app.get('/', (req, res) => {
    res.render('index');

});


app.post('/get-items', async (req, res) => {

    let url = `https://www.amazon.com/s?k=${req.body.itemSearch}&ref=nb_sb_noss_2`;
    // getItems(url)

    var newitems = await myfun(url);
    var seller = await sellerRank(newitems)
    var avgPrice = await getAvgP(seller);

            res.render('show', {
                items:seller,
                avgPrice
            });





});



app.listen(process.env.PORT || 3001, () => {
    console.log('Server is Fired on Port : ' + 3001);
});