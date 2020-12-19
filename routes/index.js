const express = require("express"),
    app = express(),
    Admin = require("../models/admin"),
    Question = require("../models/question"),
    passport = require("passport"),
    router = express.Router();


router.get("/", (req, res) => {
    res.render("index", {header: "Wybierz pytanie | Moviz"});
})

router.get("/login", function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/dashboard")
    } else {
        res.render("login", {header:"Logowanie | Moviz"});
    }
});

router.get("/register", function(req, res){
    res.render("register", {header:"Rejestracja | Moviz"})
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {

});
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.post("/register", function(req, res){
    
   
        let newAdmin = new Admin({
            username: req.body.username,
            name: req.body.name
        });
        Admin.register(newAdmin, req.body.password, function(err, user) {
            if(err) {
                
                return res.render("register");
            } 
            passport.authenticate("local")(req, res, function() {
                
                res.redirect("/login");
            });
        });
});

router.get("/dashboard", isLoggedIn, (req, res) => {
    Question.find({author: req.user._id}).populate("answers").exec((err, questions) => {
        if(err){
            console.log(err)
        } else {
            let header = "Dashboard | Moviz";
            res.render("dashboard", {header: header, currentUser: req.user, questions: questions})
        }
    })
    
})


function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/`);
}



module.exports = router;