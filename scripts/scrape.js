let axios = require("axios");
const puppeteer = require("puppeteer");
let cheerio = require("cheerio"),
cheerioAdv = require("cheerio-advanced-selectors");
cheerio = cheerioAdv.wrap(cheerio);


let countryDetail = async (url,part,country)=>{
    let items = await getItems(url,part);
    let getSale = await getTheSale(items,country);
    let avgPrice = await getAvgP(items,getSale);
    return ({ items, avgPrice });
  }
  
  
  let getItems = async (url,part) => {
    let arrItems = [];
    try {
      let browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"]
      });
      //
      let page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 926 });
      await page.setRequestInterception(true);
  
      page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
  
      await page.goto(url, { waitUntil: "load", timeout: 0 });
  
      // get hotel details
      let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  
      let $ = cheerio.load(bodyHTML);
      let inDex=0;
      let counter = 0;

      let htmlKing = await $('div.s-include-content-margin.s-border-bottom').each(
        (index, element) => {
          let obj = {};
          obj.title='';
          if (counter < 16) {
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
  
                  if( !$(ele2).attr("href").includes("/gp/slredirect/")){
                    obj.link = part + $(ele2).attr("href");
                    counter++;
                  }
                  
                });
            } else {
              $(element)
                .find("[data-component-type=s-product-image] > a")
                .each(function(i, ele2) {
                  if( !$(ele2).attr("href").includes("/gp/slredirect/")){
                    obj.link = part + $(ele2).attr("href");
                    counter++;
                  }
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
              if(obj.link){
                arrItems.push(obj);
  
              }
          }
        }
      );
      
      let newpage = await browser.newPage();
      await newpage.setViewport({ width: 1920, height: 926 });
      await newpage.setRequestInterception(true);
  
      newpage.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
  
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
            console.log(category)
            arrItems[i].category = category;
          }
        });
        if(!arrItems[i].description){
          arrItems[i].description =$("#SalesRank").text();
          var startIndex = arrItems[i].description.indexOf("in") + 3;
          var endIndex = arrItems[i].description.indexOf("(") - 1;
          var category = arrItems[i].description.substring(
            startIndex,
            endIndex
          );
          console.log(category)
          arrItems[i].category = category;
          
        }
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
        price = item.price.replace("CDN","").replace(" ","").substring(1, 500);
        let a = parseFloat(price);
        minPrice = a;
        maxPrice = a;
      }
    });
    items.forEach(element => {
      if (element.price != undefined) {
        price = element.price.replace("CDN","").replace(" ","").replace(",","").substring(1, 500);
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
        // let newDescription = newKing
        //   .substring(newKing.indexOf("#") + 1, 40)
        //   .split(" ")[0];
        let newDescription = newKing
        .replace(",","").match(/\d+/g)[0]
        
        bestSell = +newDescription;
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
    avgStar= (totalStar / 16).toFixed(2);
    let avgBestSell =0;
    avgBestSell= (totalBest / 16).toFixed(2);
    
    let avgReviews=0;
    avgReviews = (totalReview / 16).toFixed(2);
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
  
  let getTheSale = async (items,country) => {
  
    let ranks=[];
    let sales=0;
    let isAppliances=false;
    let isBaby=false;
    let isBeauty=false;
    let isIndustrial=false;
    let isBook=false;
    let isArts=false;
    let isAutomotive=false;
  console.log(country)
  console.log(items)


    if(country=='1'){
      items.forEach(element => {
        let selObj={};

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
        if (element.category == "Arts") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="16"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Cell Phones & Accessories") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="19"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Grocery") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="110"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Home improvement") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="111"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Kindle Store") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="113"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Home & Kitchen") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="115"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Kitchen & Dining") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="116"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Music Instrument") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="117"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Office Products") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="118"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Patio, Lawn & Garden") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="119"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Pet Supplies") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="120"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Software") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="121"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Sports & Outdoors") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="122"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Toys & Games") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="123"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Video Games") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="124"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Music") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="125"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
        if (element.category == "Baby") {
          let newKing = element.description.replace(/\s+/g, " ").trim();
          let newDescription = newKing
            .substring(newKing.indexOf("#") + 1, 40)
            .split(" ")[0];
          bestSell = +newDescription.replace(/,/g, "");
          selObj.attribute="126"
          selObj.rank=""+bestSell;
          ranks.push(selObj);
        }
    
    
      });
    }
  
    if(country=='2'){
      items.forEach(element => {
        let selObj={};

        if (element.category == "Baby") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="21"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Beauty") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="22"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Clothing & accessories") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="24"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Electronics") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="25"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Gift Cards") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="26"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
    
        if (element.category == "Grocery & Gourmet Food") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="27"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Health & Personal Care") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="28"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Home & Kitchen") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="29"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Industrial & Scientific") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="210"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "jewelry") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="211"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Luggage & bags") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="212"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Music") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="213"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Music") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="214"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Musical Instrument, stage & studio") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="215"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Office Products") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="216"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Patio, Lawn & Garden") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="217"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Pet Supplies") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="218"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "shoes & handbags") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="219"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Software") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="220"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Sports & Outlooks") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="221"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Tool & Home Improvement") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="222"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Toys & Games") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="223"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
        if (element.category == "Watches") {
          let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
          selObj.attribute="224"
          selObj.rank=newKing;
          ranks.push(selObj);
        }
    
      });
    }
    if(country=='3'){
          items.forEach(element => {
            let selObj={};

            if (element.category == "Car & Motorbike") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="33"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Clothing") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="34"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Computers") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="35"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "DIY & tools") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="36"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
        
            if (element.category == "Garden & outdoors") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="38"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Grocery") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="39"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Health & Personal Care") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="310"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "jewellery") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="311"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Kitchen & Home") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="312"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Large Appliances") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="313"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Luggage") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="314"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Musical Instrument") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="315"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Office Products") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="316"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "lighting") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="317"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "PC & Video Games") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="318"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Pet Supplies") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="319"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Shoes & bags") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="320"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Software") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="321"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Sports & Outdoors") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="322"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Software") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="323"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Toys and Games") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="324"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Watches") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="325"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
        
          });
        }
    if(country=='4'){
          items.forEach(element => {
            let selObj={};

            if (element.category == "Baby") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="41"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Bags, wallets & Luggage.") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="42"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Books") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="43"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Electronics") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="44"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
        
            if (element.category == "Clothing & Accessories") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="45"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Gift Cards") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="46"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Grocery & Gourmet Food") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="47"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Health & Personal Care") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="48"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Home & Kitchen") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="49"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Industries and Scientific") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="410"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Jewellery") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="411"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Movies & TV Shows") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="412"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Music") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="413"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Musical Instruments") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="414"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Pet Supplies") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="415"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Shoes & Handbags") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="416"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Software") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="417"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Sport, Fitness & Outdoor") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="418"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Toys and Games") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="419"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "Video Games") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="420"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
            if (element.category == "watches") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];        ;
              selObj.attribute="421"
              selObj.rank=newKing;
              ranks.push(selObj);
            }
           
        
          });

        }

  console.log(ranks)
  
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
      console.log(element.units)
      if(!isNaN(element.units)){
            sales+=element.units;
        }

      });
       
      let saleTotal=sales;
      if(isNaN(saleTotal)){
        saleTotal=0;
       }else{
        saleTotal=sales.toFixed(2);
       }
      
    return saleTotal;
  };

  module.exports ={
    countryDetail
}