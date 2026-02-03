import express from "express";
import methodOverride from "method-override";
import flash from "connect-flash";
import {
  checkAnswer,
  createAnswer,
  deleteAnswer,
  editAnswer,
  renderAnswerDeleteConfirmPage,
  renderAnswerEditForm,
  renderAnswerRedirectPage,
  renderAnswerResponsePage,
  renderNewAnswerForm,
} from "../controllers/answer.js";
import { isLoggedIn } from "../helpers.js";

const app = express();
const router = express.Router({ mergeParams: true });

app.use(flash());
app.use(methodOverride("_method"));

router.get("/redirect", isLoggedIn, renderAnswerRedirectPage);
router.get("/new", isLoggedIn, renderNewAnswerForm);
router.get("/response", renderAnswerResponsePage);
router.get("/:answer_id/edit", isLoggedIn, renderAnswerEditForm);
router.get(
  "/:answer_id/delete/confirm",
  isLoggedIn,
  renderAnswerDeleteConfirmPage,
);
router.get("/:answer_id/delete", isLoggedIn, deleteAnswer);

router.post("/check", checkAnswer);
router.post("/", isLoggedIn, createAnswer);

router.put("/:answer_id", isLoggedIn, editAnswer);

export default router;
