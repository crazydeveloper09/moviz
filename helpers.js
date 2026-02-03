import multer from "multer";

export const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
export const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/i)) {
    return cb(new Error("Only image and mp3 files are allowed!"), false);
  }
  cb(null, true);
};

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Nie masz dostępu do tej strony");
  res.redirect(`/`);
};

export const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
