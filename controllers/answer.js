import { escapeRegex } from "../helpers.js";
import Answer from "../models/answer.js";
import Question from "../models/question.js";

export const renderAnswerRedirectPage = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      let header = `Redirect page odpowiedzi na pytanie | Pytanie | ${question.title} | Moviz`;
      res.render("./answers/redirect", {
        header,
        question,
        currentUser: req.user,
      });
    })
    .exec((err) => console.log(err));
};

export const renderNewAnswerForm = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      let header = `Dodaj odpowiedź | Pytanie | ${question.title} | Moviz`;
      res.render("./answers/new", {
        header,
        question,
        currentUser: req.user,
      });
    })
    .exec((err) => console.log(err));
};

export const renderAnswerResponsePage = (req, res, next) => {
  if (req.query.response === "noTimeLeft" || req.query.response === "failure") {
    Answer.findOne({
      $and: [{ question: req.params.question_id }, { isCorrect: true }],
    })
      .populate("question")
      .exec()
      .then((answer) => {
        let { userAnswer, response } = req.query;
        if (req.query.response === "noTimeLeft") {
          let header = `Brak czasu | ${answer.question.title} | Moviz`;
          res.render("./answers/response", {
            header,
            response,
            answer,
          });
        } else {
          let header = `Fałszywa odpowiedź | ${answer.question.title} | Moviz`;
          res.render("./answers/response", {
            userAnswer,
            header,
            response,
            answer,
          });
        }
      })
      .catch((err) => console.log(err));
  } else if (req.query.response === "success") {
    Answer.findById(req.query.answer_id)
      .populate("question")
      .exec()
      .then((answer) => {
        let { userAnswer, response } = req.query;
        let header = `Poprawna odpowiedź | ${answer.question.title} | Moviz`;
        res.render("./answers/response", {
          userAnswer,
          header,
          response,
          answer,
        });
      })
      .catch((err) => console.log(err));
  }
};

export const checkAnswer = (req, res, next) => {
  if (req.body.answer === "") {
    let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=brak`;
    res.redirect(route);
  } else {
    if (req.body.answer) {
      let { question_category, question_dataType, answerType } = req.query;

      if (
        question_category === "Data produkcji" &&
        question_dataType === "Rok produkcji" &&
        answerType === "write"
      ) {
        let userAnswer = parseInt(req.body.answer);
        Answer.findOne({
          $and: [{ question: req.params.question_id }, { isCorrect: true }],
        })
          .populate("question")
          .exec()
          .then((answer) => {
            let parsedAnswer = parseInt(answer.text);

            if (
              userAnswer >= parsedAnswer - 5 &&
              userAnswer <= parsedAnswer + 5
            ) {
              let route = `/questions/${req.params.question_id}/answers/response?response=success&answer_id=${answer._id}&userAnswer=${req.body.answer}`;
              res.redirect(route);
            } else {
              let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=${req.body.answer}`;
              res.redirect(route);
            }
          })
          .catch((err) => console.log(err));
      } else {
        const regex = new RegExp(escapeRegex(req.body.answer), "gi");
        Answer.findOne({
          $and: [
            { question: req.params.question_id },
            { isCorrect: true },
            { text: regex },
          ],
        })
          .exec()
          .then((answer) => {
            if (answer) {
              let route = `/questions/${req.params.question_id}/answers/response?response=success&answer_id=${answer._id}&userAnswer=${req.body.answer}`;
              res.redirect(route);
            } else {
              let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=${req.body.answer}`;
              res.redirect(route);
            }
          })
          .catch((err) => console.log(err));
      }
    } else {
      let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=brak`;
      res.redirect(route);
    }
  }
};

export const createAnswer = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      let newAnswer = new Answer({
        text: req.body.text,
        question: question._id,
        isCorrect: req.body.isCorrect === "Poprawna",
      });
      Answer.create(newAnswer)
        .then((createdAnswer) => {
          question.answers.push(createdAnswer);
          question.save();
          res.redirect(`/dashboard`);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

export const renderAnswerEditForm = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      Answer.findById(req.params.answer_id)
        .exec()
        .then((answer) => {
          let header = `Edytuj odpowiedź | Pytanie | ${question._id} | Moviz`;
          res.render("./answers/edit", {
            question,
            answer,
            header,
            currentUser: req.user,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

export const editAnswer = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      Answer.findById(req.params.answer_id)
        .exec()
        .then((updatedAnswer) => {
          if (req.body.answer.isCorrect === "Poprawna") {
            updatedAnswer.isCorrect = true;
            updatedAnswer.text = req.body.answer.text;
            updatedAnswer.save();
            res.redirect("/dashboard");
          } else if (req.body.answer.isCorrect === "Niepoprawna") {
            updatedAnswer.isCorrect = false;
            updatedAnswer.text = req.body.answer.text;
            updatedAnswer.save();
            res.redirect("/dashboard");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

export const renderAnswerDeleteConfirmPage = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      Answer.findById(req.params.answer_id)
        .exec()
        .then((answer) => {
          let header = `Potwierdzenie usunięcia odpowiedzi ${answer.text} | Moviz`;
          res.render("./answers/delete", {
            header,
            currentUser: req.user,
            answer,
            question,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

export const deleteAnswer = (req, res, next) => {
  Question.findById(req.params.question_id)
    .exec()
    .then((question) => {
      Answer.findByIdAndRemove(req.params.answer_id)
        .exec()
        .then((deletedAnswer) => res.redirect("/dashboard"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
