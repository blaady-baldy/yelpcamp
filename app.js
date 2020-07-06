//========================================================================================================================
//                                              ADDING FLASH MESSAGES
//========================================================================================================================

var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    campgrounds             = require("./models/campgrounds"),
    seedDb                  = require("./seed"),
    passport                = require("passport"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    comments                = require("./models/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    commentRoutes           = require("./routes/comments"),
    methodOverride          = require("method-override"),
    indexRoutes             = require("./routes/index"),
    flash                   = require("connect-flash");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
                                            // For CSS FILE
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDb();

//_____________________________________________________________________________________________________________
//                                          PASSPORT CONFIGURATION
//_____________________________________________________________________________________________________________
app.use(require("express-session")({
    secret:"Rusty is the cutest dog",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//_____________________________________________________________________________________________________________
//                                 MIDDLEWARE TO PASS INFO OF USER TO EVERY TEMPLATE
//_____________________________________________________________________________________________________________
                      
app.use(function(req, res , next){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//_____________________________________________________________________________________________________________
//                                                 USING ROUTES
//                                   ADDING INITIAL ROUTE TO AVOID REPETITION
//_____________________________________________________________________________________________________________

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(3001,function(){
    console.log("Connected you son a bitch");
})

