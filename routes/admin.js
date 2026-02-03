import express from "express";
import {
  deleteAdmin,
  editAdmin,
  findAllAdmins,
  renderAdminDeleteConfirmPage,
  renderAdminEditForm,
} from "../controllers/admin";
import { isLoggedIn } from "../helpers.js";

const router = express.Router();

router.get("/", isLoggedIn, findAllAdmins);
router.get("/:admin_id/edit", isLoggedIn, renderAdminEditForm);
router.get(
  "/:admin_id/delete/confirm",
  isLoggedIn,
  renderAdminDeleteConfirmPage,
);
router.get("/:admin_id/delete", isLoggedIn, deleteAdmin);

router.put("/:admin_id", isLoggedIn, editAdmin);

export default router;
