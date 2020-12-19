const express               = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    Admin                 = require("./models/admin"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    adminRoutes      = require("./routes/admin"),
    answerRoutes             = require("./routes/answer"),
    questionRoutes             = require("./routes/question"),
    indexRoutes             = require("./routes/index"),
    LocalStrategy           = require("passport-local"),
    bodyParser              = require("body-parser"),
    flash                   = require("connect-flash");

require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});





app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))

app.use(require("express-session")({
    secret: "heheszki",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());



app.use("/admin", adminRoutes);
app.use("/questions", questionRoutes);
app.use("/questions/:question_id/answers",answerRoutes);


app.use(indexRoutes);


app.listen(process.env.PORT);