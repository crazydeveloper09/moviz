import express from "express";
import mongoose from "mongoose";
import Admin from "./models/admin.js";
import methodOverride from "method-override";
import passport from "passport.js";
import adminRoutes from "./routes/admin.js";
import answerRoutes from "./routes/answer.js";
import questionRoutes from "./routes/question.js";
import indexRoutes from "./routes/index.js";
import LocalStrategy from "passport-local";
import bodyParser from "body-parser";
import flash from "connect-flash";
import dotenv from "dotenv";

dotenv.config();
const app = express();

mongoose.connect(process.env.DATABASE_URL);

app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: "heheszki",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(function (req, res, next) {
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
app.use("/questions/:question_id/answers", answerRoutes);

app.use(indexRoutes);

app.listen(process.env.PORT);
