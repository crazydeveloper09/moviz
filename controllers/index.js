import passport from "passport";
import Admin from "../models/admin.js";
import Question from "../models/question.js";

export const renderHomePage = (req, res, next) => {
  Question.find({})
    .exec()
    .then((questions) =>
      res.render("index", { header: "Wybierz pytanie | Moviz", questions }),
    )
    .catch((err) => console.log(err));
};

export const renderLoginPage = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("login", { header: "Logowanie | Moviz" });
  }
};

export const renderRegisterPage = (req, res, next) => {
  if (req.query.code === "gigamocni") {
    res.render("register", { header: "Rejestracja | Moviz" });
  } else {
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/`);
  }
};

export const logOutAdmin = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

export const registerAdmin = (req, res, next) => {
  let newAdmin = new Admin({
    username: req.body.username,
    name: req.body.name,
  });
  Admin.register(newAdmin, req.body.password, function (err, user) {
    if (err) {
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/login");
    });
  });
};

export const renderDashboard = (req, res, next) => {
  Question.find({ author: req.user._id })
    .populate("answers")
    .exec()
    .then((questions) => {
      let header = "Dashboard | Moviz";
      res.render("dashboard", { header, currentUser: req.user, questions });
    })
    .catch((err) => console.log(err));
};

export const renderErrorPage = (req, res, next) =>
  res.render("error", { header: "Nie znaleziono strony | Moviz" });
