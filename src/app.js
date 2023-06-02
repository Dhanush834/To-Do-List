const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

//Global Var
let foundItems;
let defaultItems;
let Item;
let List;
let day;



//Data Base :- MongoDB using Mongoose ODM
    const url = "mongodb://127.0.0.1:27017/todoDB";
    main().catch(err => console.log(err));

    async function main() {

    await mongoose.connect( url);

    console.log('Connected to MongoDB');

    //Schema 

    const itemSchema = new mongoose.Schema({
        name:{
            type:String,
            required:[true,"Task Should Have a name"]
        }
    });

    const ListSchema = {
        name:String,
        items : [itemSchema]
    };

    //Model

    Item = mongoose.model("Item",itemSchema);
    List = mongoose.model('List',ListSchema);

    const sample1 = new Item({
        name:"Welcome To ToDo page"
    })

    const sample2 = new Item({
        name:"Hit the + button to add a new item"
    })

    defaultItems = [sample1,sample2];

}




//Express
app.get("/healthz", (req,res) => {
    res.send("OK");
})



app.get("/", async (req, res) => {

    day = date.getDate();
    foundItems = await Item.find({});

    if(foundItems.length===0)
    {
        Item.insertMany(defaultItems);
        res.redirect('/');
    }
    else{
        res.render('lists', { listTitle: day , newitems: foundItems })
    }
   
})



app.post("/" , (req,res) =>{

    const itemName = req.body.item;
    const ListName = req.body.list;

    const itemz = new Item({
        name:itemName
    });

    if( ListName === day ){
        itemz.save();
        res.redirect('/');
    }
    else{
        List.findOne({name:ListName})
        .then((foundList)=>{
            foundList.items.push(itemz)
            foundList.save();
            res.redirect("/"+ListName)
        })
    }
})



app.post('/delete' , async (req,res) => {

  const checkedId = req.body.Check;
  const ListName = req.body.ListName;

  if( ListName === day ){

    await Item.deleteOne({ _id: checkedId })
    try{
        res.redirect('/');
    } 
    catch(err){};

  } 

  else{
     
  }

  
})

app.get('/:id', function (req, res) {

    const CustomList = req.params.id;

    List.findOne({name:CustomList})
    .then(function(foundList){
        
          if(!foundList){

            //Create a new list
            const list = new List({
              name:CustomList,
              items:defaultItems
            });

            list.save();
            res.redirect("/"+CustomList);

          }
          else{
            //already exsists
            res.render("lists",{listTitle:foundList.name, newitems:foundList.items});
          }
    })
    .catch(function(err){});
    
    
});


app.listen(process.env.PORT || 3001, () => {
    console.log("Server Started");
})



