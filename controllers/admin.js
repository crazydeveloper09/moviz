import Admin from "../models/admin.js";

export const findAllAdmins = (req, res, next) => {
  Admin.find({})
    .exec()
    .then((admins) => {
      let header = `Administratorzy | Moviz`;
      res.render("./admin/index", { admins, header, currentUser: req.user });
    })
    .catch((err) => console.log(err));
};

export const renderAdminEditForm = (req, res, next) => {
  Admin.findById(req.params.admin_id)
    .exec()
    .then((admin) => {
      let header = `Edytuj pytanie | ${admin.title} | Moviz`;
      res.render("./admin/edit", { admin, header });
    })
    .catch((err) => console.log(err));
};

export const editAdmin = (req, res, next) => {
  Admin.findByIdAndUpdate(req.params.admin_id, req.body.admin)
    .exec()
    .then((updatedAdmin) => res.redirect("/admin"))
    .catch((err) => console.log(err));
};

export const renderAdminDeleteConfirmPage = (req, res, next) => {
  Admin.findById(req.params.admin_id)
    .exec()
    .then((admin) => {
      let header = `Potwierdzenie usunięcia | ${admin.username} | Administratorzy | Moviz`;
      res.render("./admin/delete", { admin, header, currentUser: req.user });
    })
    .catch((err) => console.log(err));
};

export const deleteAdmin = (req, res, next) => {
  Admin.findByIdAndRemove(req.params.admin_id)
    .exec()
    .then((deletedAdmin) => res.redirect("/admin"))
    .catch((err) => console.log(err));
};
