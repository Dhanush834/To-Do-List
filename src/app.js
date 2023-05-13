const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + '/date.js');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

// Global Variables
var items = [];


app.get("/", (req, res) => {

    let day = date.getDate();
    
    res.render('lists', { dayname: day , newitems:items })

})

app.post("/" , (req,res) =>{
    var item = req.body.item;
    items.push(item);
    res.redirect('/');
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server Started")
})

