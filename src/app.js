const path = require("path")
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();

// express'in yapılandırması için  parçaları tanımladık
const publicDirectoryPath = path.join(__dirname,"../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials"); 

app.set("view engine", "hbs"); // express'e hangi template engine'i kurduğumuzu söyledik(burada hbs)
app.set("views", viewPath); // ismini templates(içinde hbs dosyları olan) olarak değiştirdiğimiz dosyaya, bu dosyanın yolunu depolayan değişken atadık(views)
hbs.registerPartials(partialsPath)

//Sunulacak statik dizini kur
app.use(express.static(publicDirectoryPath));

app.get("", (req,res) => { //index.hbs'i kullanabilmek için
    res.render("index", { //ilk argument(index) res.render'ın hangi hbs dosyasını render etmesi gerektiğini söyler.İkincisi ise index.hbs dosyasının erişmesini istediğimiz objeleri içerir
        title:"Weather", //index.hbs bu özellikleri dinamik olarak buradan alabilecek
        name:"Murat Yavaş"
    });
})


app.get("/about", (req,res) => {
    res.render("about", {
        title:"About us",
        detail:"More detail about our vision",
        name: "Murat Yavaş"
    })
});



app.get("/help", (req,res) => {
    res.render("help", {
        message:"this page helps you with what you want to do",
        title:"Help page",
        name: "Murat Yavaş"
    })
});


app.get("/weather", (req, res) => {
    if(!req.query.address){ // kullanıcı tarafından request atıldığında eşleşme olmazsa bu if çalışacak
        return res.send({ //kullanıcıya herhangi bir şeyi(string vb.) göndermek için kullanılır
            error: "You must provide an address"
        });
    }

    geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => {
        if(error) {
            return res.send({error})
        }

    forecast(latitude, longtitude, (error, forecastData) => {
        if(error) {
            return res.send({error})
        }

        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
            });
        })
    })
});


app.get("/products", (req,res) => {
    if(!req.query.search){
        return res.send({
            error: "You must provide a search term"
        })
    }

    // console.log(req.query.search)
    res.send({
        products: []
    })
})


 
app.get("/help/*", (req,res) => {  // help sayfasından sonra girilen hatalı url için gösterilen sayfa
    res.render("404",{
        title: "404",
        name: "Murat Yavaş",
        errorMessage: "Help article not found"
    })
})

app.get("*", (req,res) => {  //girilen tüm hatalı url için gösterilecek sayfa
    res.render("404",{
        title: "404",
        name: "Murat Yavaş",
        errorMessage: "Page not found"
    })
})
 
app.listen(3000, () => {
    console.log("Server is up on port 3000");        
})