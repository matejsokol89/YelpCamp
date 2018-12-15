
var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});



//REGISTER FORM 

router.get("/register", function(req, res) {
    res.render("register");
});

//HANDLE SIGN IN
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//LOGIN FORM

router.get("/login", function(req, res) {
    res.render("login");
});
//HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    faliureRedirect: "/login"
    }) ,function(req,res){
    
});

//LOGUT ROUTE

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;