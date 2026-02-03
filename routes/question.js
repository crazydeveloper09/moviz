import { imageFilter, storage } from "../helpers.js";

import express from "express";
import flash from "connect-flash";
import methodOverride from "method-override";
import multer from "multer";
import dotenv from "dotenv";
import {
  createQuestion,
  deleteQuestion,
  editQuestion,
  editQuestionFile,
  getRandomQuestion,
  renderNewQuestionForm,
  renderQuestionDeleteConfimPage,
  renderQuestionEditFileForm,
  renderQuestionEditForm,
  renderQuestionPage,
  searchQuestions,
} from "../controllers/question.js";

dotenv.config();

const upload = multer({ storage: storage, fileFilter: imageFilter });

const app = express();
const router = express.Router();

app.use(flash());
app.use(methodOverride("_method"));

router.get("/new", isLoggedIn, renderNewQuestionForm);
router.get("/random", getRandomQuestion);
router.get("/search", isLoggedIn, searchQuestions);
router.get("/:id", renderQuestionPage);
router.get(
  "/:question_id/delete/confirm",
  isLoggedIn,
  renderQuestionDeleteConfimPage,
);
router.get("/:question_id/delete", isLoggedIn, deleteQuestion);
router.get("/:question_id/edit", isLoggedIn, renderQuestionEditForm);
router.get("/:question_id/editFile", isLoggedIn, renderQuestionEditFileForm);

router.post("/", upload.single("file"), createQuestion);
router.post(
  "/:question_id/editFile",
  upload.single("file"),
  isLoggedIn,
  editQuestionFile,
);

router.put("/:question_id", isLoggedIn, editQuestion);

export default router;
