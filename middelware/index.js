var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middelwareObj = {};

middelwareObj.checkCampgroundOwnership = function (req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found")
                res.redirect("back")
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have premission to do that");
                    res.redirect("back");
                }

            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middelwareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back")
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have premission to do that");
                    res.redirect("back");
                }
            }
        });

    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

 middelwareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged to do that");
    res.redirect("/login");
 }

module.exports = middelwareObj;