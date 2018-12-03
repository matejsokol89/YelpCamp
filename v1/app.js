var express = require("express");
var app = express();


app.set("view engine", "ejs");


app.get("/", function(req, res){
    res.render("landing")
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name:  "Salmon Creek", image: "https://farm9.staticflickr.com/8171/8050412244_06edfea2e7.jpg"},
        {name:  "Misty Mountains", image: "https://farm6.staticflickr.com/5496/9606585301_a295433867.jpg"},
        {name:  "The Pass of Greek", image: "https://farm9.staticflickr.com/8400/8668072449_382f0ccbcc.jpg"}
    ]
    
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp is listening!!!"); 
});