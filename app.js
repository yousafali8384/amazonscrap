

let bodyParser = require("body-parser"),
  express = require("express"),
  env = require("dotenv"),
  cors = require('cors'),
  app = express();
let path = require("path");
env.config();
const scrape= require("./scripts/scrape")


app.use(cors())
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


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/get-items/:itemSearch/country/:country", async (req, res) => {
  console.log('hit')
  
  if(req.params.country){
    if(req.params.country == "1"){
      let url ='https://www.amazon.com/s?k='+req.params.itemSearch
      let part ='https://www.amazon.com';
      let country='1';

      let countryOneItems=await scrape.countryDetail(url,part,country,req.params.itemSearch);
      console.log(countryOneItems);
      res.send(countryOneItems);

    }

    if(req.params.country == "2"){
      let url ='https://www.amazon.co.uk/s?k='+req.params.itemSearch
      let part ='https://www.amazon.co.uk';
      let country='2';
      let countryOneItems=await scrape.countryDetail(url,part,country,req.params.itemSearch);
      res.send(countryOneItems);

    }

    if(req.params.country == "3"){
      let url ='https://www.amazon.ca/s?k='+req.params.itemSearch
      let part ='https://www.amazon.ca';
      let country='3';

      let countryItems=await scrape.countryDetail(url,part,country,req.params.itemSearch);
      res.send(countryItems);
    }
    if(req.params.country == "4"){
      let url ='https://www.amazon.in/s?k='+req.params.itemSearch
      let part ='https://www.amazon.in';
      let country='4';

      let countryItems=await scrape.countryDetail(url,part,country,req.params.itemSearch);
      res.send(countryItems);
    }

  }else{
    res.send("Please enter country code")
  }
  
});




const port = process.env.PORT || "3001";
app.listen(port, () => {
  console.log("Server is Fired on Port : " + port);
});
