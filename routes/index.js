import express from "express";
import passport from "passport";
import {
  logOutAdmin,
  registerAdmin,
  renderDashboard,
  renderErrorPage,
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
} from "../controllers/index.js";
import { isLoggedIn } from "../helpers.js";

const router = express.Router();

router.get("/", renderHomePage);
router.get("/login", renderLoginPage);
router.get("/register", renderRegisterPage);
router.get("/logout", logOutAdmin);
router.get("/dashboard", isLoggedIn, renderDashboard);
router.get("*", renderErrorPage);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {},
);
router.post("/register", registerAdmin);

export default router;
