//INDEX - show all campgrounds

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middelware = require("../middelware");



    //INDEX - show all campgrounds
    router.get("/", function(req, res){
        var perPage = 8;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        var noMatch = null;
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
                Campground.count({name: regex}).exec(function (err, count) {
                    if (err) {
                        console.log(err);
                        res.redirect("back");
                    } else {
                        if(allCampgrounds.length < 1) {
                            noMatch = "No campgrounds match that query, please try again.";
                        }
                        res.render("campgrounds/index", {
                            campgrounds: allCampgrounds,
                            current: pageNumber,
                            pages: Math.ceil(count / perPage),
                            noMatch: noMatch,
                            search: req.query.search
                        });
                    }
                });
            });
        } else {
            // get all campgrounds from DB
            Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
                Campground.count().exec(function (err, count) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("campgrounds/index", {
                            campgrounds: allCampgrounds,
                            current: pageNumber,
                            pages: Math.ceil(count / perPage),
                            noMatch: noMatch,
                            search: false
                        });
                    }
                });
            });
        }
    });


//CREATE - add new campground to DB
router.post("/", middelware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price:price, image: image, description: desc, author: author }
    // Create a new campground and save to DB

    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middelware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err|| !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
            console.log(err);
        }
        else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//edit campg route
router.get("/:id/edit", middelware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground:foundCampground});
       
   });
});

//update
router.put("/:id", middelware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds")
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});

//DELETE CAMP ROUTE
router.delete("/:id",middelware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
