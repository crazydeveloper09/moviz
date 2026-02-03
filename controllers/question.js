import cloudinary from "cloudinary";
import Answer from "../models/answer.js";
import Question from "../models/question.js";

cloudinary.config({
  cloud_name: "syberiancats",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const renderNewQuestionForm = (req, res, next) => {
  Question.find({})
    .exec()
    .then((questions) => {
      res.render("./questions/new", {
        header: "Dodaj pytanie | Moviz",
        questions,
      });
    })
    .catch((err) => console.log(err));
};

export const getRandomQuestion = (req, res, next) => {
  if (req.query.type === "all") {
    Question.find({})
      .exec()
      .then((questions) => {
        res.redirect(
          `/questions/${questions[Math.floor(Math.random() * questions.length)]._id}?answerType=${req.query.answerType}`,
        );
      })
      .catch((err) => console.log(err));
  } else {
    Question.find({
      $and: [{ type: req.query.type }, { category: req.query.category }],
    })
      .then((questions) => {
        if (questions.length === 0) {
          req.flash(
            "error",
            `Nie znaleźliśmy pytań w kategorii ${req.query.category} i typie ${req.query.type}`,
          );
          res.redirect("back");
        } else if (questions.length === 1) {
          res.redirect(
            `/questions/${questions[0]._id}?answerType=${req.query.answerType}`,
          );
        } else {
          res.redirect(
            `/questions/${questions[Math.floor(Math.random() * questions.length)]._id}?answerType=${req.query.answerType}`,
          );
        }
      })
      .catch((err) => console.log(err));
  }
};

export const searchQuestions = (req, res, next) => {
  Question.find({
    $and: [
      { type: req.query.type },
      { category: req.query.category },
      { author: req.user._id },
    ],
  })
    .populate("answers")
    .exec()
    .then((questions) => {
      let header = `Wyszukiwanie pytań dla kategorii ${req.query.category} i typie ${req.query.type} | Moviz`;
      res.render("./questions/search", {
        questions,
        header,
        category: req.query.category,
        type: req.query.type,
        currentUser: req.user,
      });
    })
    .catch((err) => console.log(err));
};

export const renderQuestionPage = (req, res, next) => {
  Question.findById(req.params.id)
    .populate("answers")
    .exec()
    .then((question) => {
      function shuffle(array) {
        var currentIndex = array.length,
          temporaryValue,
          randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      }
      let mixedAnswers = shuffle(question.answers);
      let header = `${question.title} | Moviz`;
      res.render("./questions/show", {
        header,
        question,
        answers: mixedAnswers,
        answerType: req.query.answerType,
      });
    })
    .catch((err) => console.log(err));
};

export const renderQuestionEditForm = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      let header = `Edytuj pytanie | ${question.title} | Moviz`;
      res.render("./questions/edit", { question, header });
    })
    .catch((err) => console.log(err));
};

export const editQuestion = (req, res, next) => {
  Question.findByIdAndUpdate(req.params.question_id, req.body.question)
    .exec()
    .then((updatedQuestion) => res.redirect(`/dashboard`))
    .catch((err) => console.log(err));
};

export const createQuestion = (req, res, next) => {
  if (req.isAuthenticated()) {
    let newQuestion = new Question({
      title: req.body.title,
      category: req.body.category,
      type: req.body.type,
      heroType: req.body.heroType,
      dataType: req.body.dataType,
      timeToAnswer: req.body.timeToAnswer,
      quote: req.body.quote,
      author: req.user._id,
    });
    Question.create(newQuestion)
      .then((createdQuestion) => {
        if (typeof req.file !== "undefined") {
          if (
            createdQuestion.type === "Soundtrack" ||
            createdQuestion.type === "Piosenka"
          ) {
            cloudinary.v2.uploader.upload(
              req.file.path,
              { resource_type: "video" },
              function (err, result) {
                createdQuestion.file = result.secure_url;
                createdQuestion.save();
                res.redirect("/dashboard");
              },
            );
          } else {
            cloudinary.v2.uploader.upload(
              req.file.path,
              function (err, result) {
                createdQuestion.file = result.secure_url;
                createdQuestion.save();
                res.redirect("/dashboard");
              },
            );
          }
        } else {
          res.redirect("/dashboard");
        }
      })
      .catch((err) => console.log(err));
  } else {
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/`);
  }
};

export const renderQuestionEditFileForm = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      let header = `Edytuj plik | ${question.title} | Moviz`;
      res.render("./questions/editFile", {
        question,
        header,
      });
    })
    .catch((err) => console.log(err));
};

export const editQuestionFile = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      if (question.type === "Soundtrack" || question.type === "Piosenka") {
        cloudinary.v2.uploader.upload(
          req.file.path,
          { resource_type: "video" },
          function (err, result) {
            question.file = result.secure_url;
            question.save();
            res.redirect("/dashboard");
          },
        );
      } else {
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
          question.file = result.secure_url;
          question.save();
          res.redirect("/dashboard");
        });
      }
    })
    .catch((err) => console.log(err));
};

export const renderQuestionDeleteConfimPage = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      let header = `Potweirdzenie usunięcia | ${question.title} | Moviz`;
      res.render("./questions/delete", {
        header,
        question,
        currentUser: req.user,
      });
    })
    .catch((err) => console.log(err));
};

export const deleteQuestion = (req, res, next) => {
  Question.findByIdAndRemove(req.params.question_id)
    .exec()
    .then((deletedQuestion) => res.redirect("/dashboard"))
    .catch((err) => console.log(err));
};
