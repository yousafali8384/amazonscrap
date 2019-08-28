let axios = require("axios");
const puppeteer = require("puppeteer");
let cheerio = require("cheerio"),
cheerioAdv = require("cheerio-advanced-selectors");
cheerio = cheerioAdv.wrap(cheerio);
let async = require("async");
let  _ = require('lodash');


axios.defaults.headers.common['x-api-key'] = "5etHSY6yZpiqz1PPuXSZw8LvCdfZ5JivdYROinfuaJYwftWsEHdGZwO2aSts";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let countryDetail = async (url,part,country,keyword)=>{
    let getLinks = await getItems(url,part);
    let items = await getTheSale(getLinks,country);
    let avgPrice = await getAvgP(items,keyword);
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
          // if (counter < 16) {
            // console.log(index)
            $(element).find(".s-image").each(function(i, ele) {
                obj.image = $(ele).attr("src");
              });
            if ($(element).find(".s-line-clamp-2 > a").text() != "") {
              $(element).find(".s-line-clamp-2 > a").each(function(i, ele2) {
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
  
            if ($(element).find(".s-line-clamp-2 > a > span").text() != "") {
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
          // }
        }
      );
      let uniq = _.uniqWith(
        arrItems,
        (arrA, arrB) =>
          arrA.price === arrB.price &&
          arrA.title === arrB.title
      );
 
      let newArr=uniq.slice(0,16);
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
  
      for (let i = 0; i < newArr.length; i++) {
        await newpage.goto(newArr[i].link, { waitUntil: "load", timeout: 0 });
        let bodyHTMLNew = await newpage.evaluate(() => document.body.innerHTML);
  
        let $ = cheerio.load(bodyHTMLNew);
  
        let htmlKing = await $("tr").each((index, element) => {
          if (
            $(element)
              .text()
              .includes("Best Sellers Rank")
          ) {
            if ($(element).find("#SalesRank").length > 0) {
              newArr[i].description = $(element)
                .find("#SalesRank")
                .text();
            } else {
              newArr[i].description = $(element).text();
              var startIndex = newArr[i].description.indexOf("in") + 3;
              var endIndex = newArr[i].description.indexOf("(") - 1;
              var category = newArr[i].description.substring(
                startIndex,
                endIndex
              );
              newArr[i].category = category;
            }
          } else if (
            $("#SalesRank")
              .text()
              .includes("Sellers Rank")
          ) {
            newArr[i].description = $("#SalesRank").text();
            var startIndex = newArr[i].description.indexOf("in") + 3;
            var endIndex = newArr[i].description.indexOf("(") - 1;
            var category = newArr[i].description.substring(
              startIndex,
              endIndex
            );
            newArr[i].category = category;
          }
        });
        if(!newArr[i].description){
          newArr[i].description =$("#SalesRank").text();
          var startIndex = newArr[i].description.indexOf("in") + 3;
          var endIndex = newArr[i].description.indexOf("(") - 1;
          var category = newArr[i].description.substring(
            startIndex,
            endIndex
          );
          console.log(category)
          newArr[i].category = category;
          
        }
        let sellerType = await $("#merchant-info");
        let selT = sellerType.text().trim();
        if (selT.includes("Ships from")) {
          newArr[i].sellerType = "AMZ";
        } else if (selT.includes("Fulfilled by Amazon")) {
          newArr[i].sellerType = "FBA";
        } else if (selT.includes("Fulfilled by")) {
          newArr[i].sellerType = "FBM";
        }
        let brandName = await $("#bylineInfo");
        newArr[i].brandName = brandName.text();
  
        let reviews = await $("#acrCustomerReviewText");
        newArr[i].reviews = reviews.text();
  
        // let titleB= await $("#productTitle");
        // let title= titleB.text().trim();
        // newArr[i].title=title;
      }
      browser.close();
      return newArr;
    } catch (err) {
      console.log(err);
    }
  };
 
  let getTheSale = async (items,country) => {
  
    let ranks=[];
    let sales=0;
 


   
    if(country=='1'){
    await Promise.all(items.map(async (element) => {
       
        if (element.category == "Appliances") {
          
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
             try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=11&rank=${bestSell}`);
            element.sales=sales.data.data.units
            

          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Beauty") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
             try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=13&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Industrial & Scientific") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
             try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=15&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Arts") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
             try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=16&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Automotive") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
                    try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=17&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Arts") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
            
          try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=16&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Cell Phones & Accessories") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
             
          try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=19&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
          
        }
        if (element.category == "Grocery") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=110&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Home improvement") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=111&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Kindle Store") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=113&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Home & Kitchen") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=115&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Kitchen & Dining") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=116&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Music Instrument") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=117&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Office Products") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=118&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Patio, Lawn & Garden") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=119&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Pet Supplies") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=120&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          };
        }
        if (element.category == "Software") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=121&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Sports & Outdoors") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=122&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Toys & Games") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=123&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Video Games") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=124&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Music") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=125&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Baby") {
         let bestSell = element.description.replace(",","").match(/\d+/g)[0];
              try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=126&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
    
    }));
return items;
    }
  
    if(country=='2'){
      await Promise.all(items.map(async (element) => {

        if (element.category == "Baby") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=21&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Beauty") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=22&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Clothing & accessories") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
                    
          try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=24&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Electronics") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
                    
          try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=25&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Gift Cards") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
                    
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=26&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
    
        if (element.category == "Grocery & Gourmet Food") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
                    
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=27&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Health & Personal Care") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
                    
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=28&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Home & Kitchen") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
                    
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=29&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Industrial & Scientific") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=210&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "jewelry") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=211&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Luggage & bags") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=212&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Music") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=213&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Music") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=214&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Musical Instrument, stage & studio") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=215&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Office Products") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=216&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Patio, Lawn & Garden") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=217&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Pet Supplies") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=218&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "shoes & handbags") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=219&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Software") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=220&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Sports & Outlooks") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=221&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Tool & Home Improvement") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=222&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Toys & Games") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=223&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
        if (element.category == "Watches") {
          let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
          
          
            try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=224&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
        }
    
      }));
      return items
    }
    if(country=='3'){
      await Promise.all(items.map(async (element) => {
            if (element.category == "Car & Motorbike") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=33&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Clothing") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];                      
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=34&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
            if (element.category == "Computers") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];                      
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=35&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
            if (element.category == "DIY & tools") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=36&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
        
            if (element.category == "Garden & outdoors") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=38&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
            if (element.category == "Grocery") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=39&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
            if (element.category == "Health & Personal Care") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];                      
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=310&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
            if (element.category == "jewellery") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              
               try{
            let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=310&rank=${bestSell}`);
            element.sales=sales.data.data.units
            
  
          }catch(err){
                console.log(err)
          }
            }
            if (element.category == "Kitchen & Home") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];                      
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=312&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Large Appliances") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=313&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Luggage") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=314&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Musical Instrument") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];    
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=315&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Office Products") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];   
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=316&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "lighting") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];  
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=317&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "PC & Video Games") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];  
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=318&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Pet Supplies") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];    
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=319&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Shoes & bags") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];      
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=320&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Software") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];   
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=321&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Sports & Outdoors") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];   
              
               try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=322&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Software") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];      
              
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=323&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Toys and Games") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];  
              
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=324&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Watches") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];       
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=325&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
        
          }));
          return items;
        }
    if(country=='4'){
      await Promise.all(items.map(async (element) => {

            if (element.category == "Baby") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];       
              
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=41&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Bags, wallets & Luggage.") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=42&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }         
               }
            if (element.category == "Books") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];        
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=43&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }              
             }
            if (element.category == "Electronics") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];      
              
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=44&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }        
            
            }
        
            if (element.category == "Clothing & Accessories") {
              let bestSell = element.description.replace(",","").match(/\d+/g)[0];  
              
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=45&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }       
                 }
            if (element.category == "Gift Cards") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=46&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Grocery & Gourmet Food") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];    
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=47&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Health & Personal Care") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];   
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=48&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Home & Kitchen") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];    
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=49&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }
            }
            if (element.category == "Industries and Scientific") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];  
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=410&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Jewellery") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];      
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=411&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Movies & TV Shows") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];  
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=412&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Music") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];   
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=413&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Musical Instruments") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];   
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=414&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Pet Supplies") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];      
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=415&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Shoes & Handbags") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];   
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=416&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Software") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];     
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=417&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Sport, Fitness & Outdoor") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];   
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=418&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Toys and Games") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];   
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=419&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "Video Games") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0]; 
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=420&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
            if (element.category == "watches") {
              let newKing = element.description.replace(",","").match(/\d+/g)[0];  
              try{
                let sales= await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=421&rank=${bestSell}`);
                element.sales=sales.data.data.units
                
      
              }catch(err){
                    console.log(err)
              }            }
           
        
          }));
          return items;

        }

 

  // async.forEachOf(ranks, async (value, key, callback) => {
  //       if(value){
  //         console.log(value)
  //        await axios.post(`http://api.gigcodes.com/api/get/sale?attribute=${value.attribute}&rank=${value.rank}`)
  //         .then(function (response) {
  //           console.log(response.data);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //         callback()

          
  //       }else{
  //         console.log('no value');
  //         callback();
  //       }
     
  //     }, err => {
  //       if (err) console.error(err.message);
  //       // configs is now a map of JSON data
  //     });



  //  let sale = await axios({
  //     method: 'post',
  //     url: 'http://api.gigcodes.com/api/get/sales',
  //     data: {
  //       ranks
  //     }  
  //   });
  //   sale.data.sales_arr.forEach(element => {
  //     if(!isNaN(element.units)){
  //           sales+=element.units;
  //       }

  //     });
       
  //     let saleTotal=sales;
  //     if(isNaN(saleTotal)){
  //       saleTotal=0;
  //      }else{
  //       saleTotal=sales.toFixed(2);
  //      }
      
  };
  let getAvgP = async (items,keyword) => {
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
    let brand = "NO";
    let budget = 0;
    let totalSale=0;


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
      if(element.sales != undefined && element.sales != ""){
        if(element.sales == '< 5' ){
          element.sales=5;
        }
        totalSale+=element.sales;
        // let sale =element.sales.match(/\d+/g)[0]
    
       }
    });
    for (let key in countArr) {
      if(key!=''){
      if (countArr[key] >= 6) {
        brand = "YES";
      } 
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

    let sale=0;
    sale= (totalSale / 16).toFixed(2);
    
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
      opportunity = "HIGH"
  } else if (totalReview < 100 && sale > 10000) {
      opportunity = "HIGH"
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
      opportunity,
      sale,
      keyword
    };
  };
  

  module.exports ={
    countryDetail
}