var express = require("express");
var router = express.Router({mergeParams:true});
var campgrounds =require("../models/campgrounds");
var middleware = require("../middleware");

router.get("/",function(req,res){
    campgrounds.find({},function(err,allCamps){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCamps});
        }
    });
});

router.get("/new" , middleware.isLoggedIn , function(req,res){
    res.render("campgrounds/new")
});

router.post("/" , middleware.isLoggedIn , function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    var newCamp = { name:name, image:image, description:desc,author:author 
    }
    campgrounds.create(newCamp,function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            
            res.redirect("/campgrounds");
        }
    })
});

router.get("/:id",function(req , res){
    campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show",{camp:foundcamp});
        }
    });
});

router.get("/:id/edit" , middleware.checkCampgroundOwnership ,function(req , res){
    campgrounds.findById(req.params.id,function(err,foundcamp){
            res.render("campgrounds/edit",{camp:foundcamp});
    });
});

router.put("/:id" , middleware.checkCampgroundOwnership ,function( req , res ){
    campgrounds.findByIdAndUpdate(req.params.id , req.body.campground , function( err , updatedCamp ){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership , function( req , res ){
    campgrounds.findByIdAndRemove(req.params.id , function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;