var bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require('cheerio'),
    cheerioAdv = require('cheerio-advanced-selectors'),
    axios = require('axios'),
    async = require('async'),
     app = express();

    var request=require('request-promise');



        
        
          
 
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
    try {


        var arrItems = []
       var  options = {
        'url':url,   
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Language': 'en-US,en;q=0.8',
       'Cache-Control': 'no-cache',
       'Connection': 'keep-alive',
       'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3'}
       var htmlResult = await axios.get(url,{
            
        headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36','cookie':'session-id=130-6204732-5270907; session-id-time=2082787201l; i18n-prefs=USD; sp-cdn="L5Z9:PK"; ubid-main=134-2184397-8776459; session-token=mU2A9LlqukWQfGa7O6asGQzqEc5iMx5swpxzmHZ7jSQHxicxyu1Rjm9a+bejWjEpqNSMPCylyRKeAYBzCPnNycrC1WXAGVdUZiWRlQBoUf4cqYMSDCJwTKQDwRjaWGDu4wxaxXo7q0LAc7kVStFSSwgDlMz2c5ANXGRWGoAekjGZuPBn7A2e7qddts0PMTa5; x-wl-uid=19GVCz1vYVQmbpADNdau6SPgQkWOZGXS9nIFKmp/xUOrXbPAqlv6d9iLerGSUGsF2GJ2zasbCANg=; csm-hit=tb:s-M134W92HQWZ4K99G6T2D|1555400479351&t:1555400482545&adb:adblk_no'}
        
      
});
        console.log(htmlResult)
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




const sellerRank = async (items) => {
    var newObj = []
    for(const link of items){
        try {
            console.log(link.link)
    
         var newData=await axios.get(link.link);
                    var $ =  cheerio.load(newData.data);
    
                 $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
                     if ($(element).text().includes("Best Sellers Rank")) {
                        link.description = $(element).text();
                     }
         
         
                 })
         
    
        } catch (err) {
            console.log(err)
    
        }
    }

    console.log(items)
    return items
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