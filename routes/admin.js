const express = require("express"),
    app = express(),
    Admin = require("../models/admin"),
    router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
    Admin.find({}, (err, admins) => {
        if(err) {
            console.log(err)
        } else {
            let header = `Adminstratorzy | Moviz`;
            res.render("./admin/index", {admins: admins, header: header, currentUser: req.user})
        }
    })
})

router.get("/:admin_id/edit", isLoggedIn, (req, res) => {
    
    Admin.findById(req.params.admin_id, (err, admin) => {
        if (err) {
            console.log(err)
        } else {

            let header = `Edytuj pytanie | ${admin.title} | Moviz`;
            res.render("./admin/edit", { admin: admin, header: header })


        }
    })

   
});

router.put("/:admin_id", isLoggedIn, (req, res) => {
  
    Admin.findByIdAndUpdate(req.params.admin_id, req.body.admin, (err, updatedadmin) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/admin`);
        }
    })
       
  
});

router.get("/:admin_id/delete/confirm", isLoggedIn, (req, res) => {
   
    Admin.findById(req.params.admin_id, (err, admin) => {
        if (err) {
            console.log(err);
        } else {
            let header = `Potwierdzenie usunięcia | ${admin.username} | Administratorzy | Moviz`;
            res.render("./admin/delete", {admin: admin, header: header, currentUser: req.user})
        }
    })
      
  
})

router.get("/:admin_id/delete", isLoggedIn, (req, res) => {
   
    Admin.findByIdAndRemove(req.params.admin_id, (err, updatedadmin) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/admin`);
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

module.exports = router