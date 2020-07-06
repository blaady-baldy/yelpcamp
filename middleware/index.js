var middlewareObj = {};
var campgrounds = require("../models/campgrounds");
var comments = require("../models/comments");


//_____________________________________________________________________________________________________________
//                    FUNCTION TO CHECK IF CURRENT USER IS SAME AS THE USER WHO ADDED THE CAMPGROUND
//_____________________________________________________________________________________________________________

middlewareObj.checkCampgroundOwnership = function (req , res , next){
    if(req.isAuthenticated()){
        campgrounds.findById(req.params.id , function(err , foundcamp){
            if(err){
                req.flash("error" , "Campground not found");
                req.redirect("back");
            } else {
                if(foundcamp.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error" , "You don't have permission to do that");
                    res.redirect("back");
                    console.log("You don't have access");
                }
            }
        });
    }
    else {
        req.flash("error" , "You need to be logged in to see that !");
        res.redirect("back");
        console.log("You don't have access");
    }
}

middlewareObj.checkCommentOwnership = function(req , res , next){
    if(req.isAuthenticated()){
        comments.findById(req.params.comment_id , function(err , foundComment){
            if(err){
                req.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                    console.log("You don't have access");
                }
            }
        });
    }
    else {
        res.redirect("back");
        console.log("You don't have access");
    }
}

//_____________________________________________________________________________________________________________
//                                      FUNCTION TO CHECK IF USER IS LOGGED IN
//_____________________________________________________________________________________________________________

middlewareObj.isLoggedIn = function(req, res ,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You need to be logged in to see that !");
    res.redirect("/login");
}

module.exports = middlewareObj;