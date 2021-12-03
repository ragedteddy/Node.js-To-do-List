
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let item=[];
let workItem=[];

app.get("/", function(req, res){
    let day  = date.getDate();
    res.render("list", {kindOfDay: day, newListItem:item});
});

app.post("/", function(req, res){
    item.push(req.body.newItem);
    res.redirect("/");
});

app.get("/work", function(req, res){
    res.render("list", {kindOfDay: "Work", newListItem:workItem});
});

app.post("/work", function(req, res){
    workItem.push(req.body.newItem);
    res.redirect("/work");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000.");
});
