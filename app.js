var bodyParser = require("body-parser"),
    express = require("express"),
    cheerio = require('cheerio'),
    cheerioAdv = require('cheerio-advanced-selectors'),
    axios = require('axios'),
    async = require('async'),
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
        var htmlResult = await axios.get(url);
        var $ = await cheerio.load(htmlResult.data);
          

        var htmlKing = await $('.s-include-content-margin').each((index, element) => {
            var obj = {};
            if(index<16){
            $(element).find('.s-image').each(function (i, ele) {

                obj.image = $(ele).attr('src');

            });
            if($(element).find('.s-line-clamp-2 > a').length>14){
                 $(element).find('.s-line-clamp-2 > a').each(function (i, ele2) {
            
                obj.link = "https://www.amazon.com" + $(ele2).attr('href');
        

            });
        }else{
            $(element).find('[data-component-type=s-product-image] > a').each(function (i, ele2) {
            
                obj.link = "https://www.amazon.com" + $(ele2).attr('href');


            });
          
        }
        if( $(element).find('.s-line-clamp-2 > a > span').length  >14){
            console.log("hias")
            $(element).find('.s-line-clamp-2 > a > span').each(function (i, ele2) {
                obj.title = $(ele2).text();

            });
        }else{

            $(element).find('.a-size-base-plus').each(function (i, ele2) {
                obj.title = $(ele2).text();
                console.log("hias in sec")

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
        var htmlResult = await axios.get(items[0].link);
        var $ = await cheerio.load(htmlResult.data);
      
         $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[0].description =$(element).text();
            }

           
        })
        


    } catch (err) {
        // console.log(err)

    }

    try {
        console.log(items[1].link)
        var htmlResult = await axios.get(items[1].link);
        var $ = await cheerio.load(htmlResult.data);
        // items[1].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[1].description.includes("Best Sellers Rank")) {} else {
        //     items[1].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[1].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[1].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[1].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[1].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[1].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[2].link)

        var htmlResult = await axios.get(items[2].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[2].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[2].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[2].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[2].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[2].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[2].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[2].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[2].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[3].link)

        var htmlResult = await axios.get(items[3].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[3].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[3].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[3].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[3].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[3].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[3].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[3].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[3].description =$(element).text();
            }else{
                items[3].description="";
            }
        })


    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[4].link)
        var htmlResult = await axios.get(items[4].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[4].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[4].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[4].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[4].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[4].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[4].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[4].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[4].description =$(element).text();
            }
        })
    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[5].link)
        var htmlResult = await axios.get(items[5].link);


        var $ = await cheerio.load(htmlResult.data);
        // console.log($('#productDetails_detailBullets_sections1').html())
        // items[5].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[5].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[5].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[5].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[5].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[5].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[5].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[5].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        var htmlResult = await axios.get(items[6].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[6].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[6].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[6].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[6].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[6].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[6].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[6].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[6].description =$(element).text();
            }
        })


    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[7].link)
        var htmlResult = await axios.get(items[7].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[7].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[7].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[7].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[7].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[7].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[7].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[7].description = "";
        //         }
        //     }

        // }

        // console.log(items[7].description);
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[7].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[8].link)
        var htmlResult = await axios.get(items[8].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[8].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[8].description.includes("Best Sellers Rank")) {

        // } else {
        //     items[8].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[8].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[8].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[8].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[8].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                console.log("hi")
                items[8].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }

    try {
        console.log(items[9].link)
        var htmlResult = await axios.get(items[9].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[9].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[9].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[9].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[9].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[9].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[9].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[9].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[9].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[10].link)
        var htmlResult = await axios.get(items[10].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[10].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[10].description.includes("Best Sellers Rank")) {
        //     console.log('yes')
        // } else {
        //     items[10].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[10].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[10].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[10].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[10].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[10].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[11].link)
        var htmlResult = await axios.get(items[11].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[11].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[11].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[11].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[11].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[11].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[11].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[11].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[11].description =$(element).text();
            }
        })

    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[12].link)
        var htmlResult = await axios.get(items[12].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[12].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[12].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[12].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[12].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[12].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[12].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[12].description = "";
        //         }
                
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[12].description =$(element).text();
            }
        })

    } catch (err) {

    }
    try {
        console.log(items[13].link)
        var htmlResult = await axios.get(items[13].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[13].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[13].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[13].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[13].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[13].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[13].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[13].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[13].description =$(element).text();
            }
        })
    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[14].link)
        var htmlResult = await axios.get(items[14].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[14].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[14].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[14].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[14].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[14].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[14].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[14].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[14].description =$(element).text();
            }
        })
    } catch (err) {
        // console.log(err)

    }
    try {
        console.log(items[15].link)
        var htmlResult = await axios.get(items[15].link);


        var $ = await cheerio.load(htmlResult.data);
        // items[15].description = $('#productDetails_detailBullets_sections1 > tbody > tr:last').text();
        // if (items[15].description.includes("Best Sellers Rank")) {
        // } else {
        //     items[15].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(2)').text();
        //     if (items[15].description.includes("Best Sellers Rank")) {

        //     } else {
        //         items[15].description = $('#productDetails_detailBullets_sections1 > tbody > tr:nth-last-child(3)').text();
        //         if (items[15].description.includes("Best Sellers Rank")) {
        //         }else{
        //             items[15].description = "";
        //         }
        //     }

        // }
        $('#productDetails_detailBullets_sections1 > tbody > tr').each((index, element) => {
            if($(element).text().includes("Best Sellers Rank")){
                items[15].description =$(element).text();
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
        console.log(response.link)
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

app.listen(process.env.PORT ||3001, () => {
    console.log('Server is Fired on Port : ' + 3001);
});