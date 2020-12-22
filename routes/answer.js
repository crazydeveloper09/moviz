const { response } = require("express");

const express = require("express"),
    Question = require("../models/question"),
    Answer = require("../models/answer"),
    methodOverride = require("method-override"),
    app = express(),
    flash = require("connect-flash"),
    router = express.Router({mergeParams: true});
app.use(flash());
app.use(methodOverride("_method"));


router.get("/redirect", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err){
            console.log(err)
        } else {
            
            let header = `Redirect page | Pytanie | ${question.title} | Moviz`;
            res.render("./answers/redirect", { header:header, question: question, currentUser: req.user})
            
            
        }
    })
})

router.get("/new", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err){
            console.log(err)
        } else {
            
            let header = `Dodaj odpowiedź | Pytanie | ${question.title} | Moviz`;
            res.render("./answers/new", {header: header, question: question, currentUser: req.user})
            
            
        }
    })
})
router.get("/response", (req, res) =>{
    if(req.query.response === "noTimeLeft" || req.query.response === "failure"){
        Answer.
            findOne({ 
                $and: [
                        {question: req.params.question_id}, 
                        {type: true}
                    ] 
                })
                .populate("question").exec((err, answer) => {
                    if(err){
                        console.log(err)
                    } else {
                        if(req.query.response === "noTimeLeft"){
                            let header = `Brak czasu | ${answer.question.title} | Moviz`
                            res.render("./answers/response", { header:header, response: req.query.response, answer: answer })
                        } else {
                            let header = `Fałszywa odpowiedź | ${answer.question.title} | Moviz`
                            res.render("./answers/response", { userAnswer: req.query.userAnswer, header:header, response: req.query.response, answer: answer })
                        }
                        
                    }
                })
    } else if(req.query.response = "success") {
        Answer.findById(req.query.answer_id).populate("question").exec((err, answer) => {
            if(err){
                console.log(err);
            } else {
                if(req.query.response === "success"){
                    let header = `Poprawna odpowiedź | ${answer.question.title} | Moviz`
                    res.render("./answers/response", { userAnswer: req.query.userAnswer, header:header, response: req.query.response, answer: answer })
                } 
            }
        })
       
    }
})
router.post("/check", (req, res) => {
    if(req.body.answer === ""){
       
                        

        let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=brak`;
        res.redirect(route)
                        
                   
    } else {
        if(req.body.answer){
            if (req.query.question_category === "Data produkcji" && req.query.question_dataType === "Rok produkcji") {
                let userAnswer = parseInt(req.body.answer);
                Answer.
                    findOne({
                        $and: [
                            { question: req.params.question_id },
                            { type: true }
                        ]
                    })
                    .populate("question").exec((err, answer) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let parsedAnswer = parseInt(answer.text);
        
                            console.log(parsedAnswer)
                            if (userAnswer >= (parsedAnswer - 5) && userAnswer <= (parsedAnswer + 5)) {
                                let route = `/questions/${req.params.question_id}/answers/response?response=success&answer_id=${answer._id}&userAnswer=${req.body.answer}`;
                                res.redirect(route)
                            } else {
                                let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=${req.body.answer}`;
                                res.redirect(route)
                            }
                        }
                    })
            } else {
                const regex = new RegExp(escapeRegex(req.body.answer), 'gi');
                Answer
                    .findOne({
                        $and:
                            [
                                { question: req.params.question_id },
                                { type: true },
                                { text: regex }
                            ]
                    }, (err, answer) => {
                        if (err) {
                            console.log(err)
                        } else {
                            if (answer) {
                                let route = `/questions/${req.params.question_id}/answers/response?response=success&answer_id=${answer._id}&userAnswer=${req.body.answer}`;
                                res.redirect(route)
                            } else {
                                let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=${req.body.answer}`;
                                res.redirect(route)
                            }
                        }
                    }
                    )
            }
        } else {
            let route = `/questions/${req.params.question_id}/answers/response?response=failure&userAnswer=brak`;
            res.redirect(route)
        }
        
    }
    
})

router.post("/", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err){
            console.log(err)
        } else {
            if(req.body.type === "Poprawna"){
                let newAnswer = new Answer({
                    text: req.body.text,
                    question: question._id,
                    type: true
                })
                Answer.create(newAnswer, (err, createdanswer) => {
                    if(err) {
                       console.log(err);
                    } else {
                        question.answers.push(createdanswer);
                        question.save();
                        res.redirect(`/dashboard`);
                    }
               })
            } else {
                let newAnswer = new Answer({
                    text: req.body.text,
                    question: question._id,
                    type: false
                })
                Answer.create(newAnswer, (err, createdanswer) => {
                    if(err) {
                       console.log(err);
                    } else {
                        question.answers.push(createdanswer);
                        question.save();
                        res.redirect(`/dashboard`);
                    }
               })
            }
           
        }
    })
})


router.get("/:answer_id/edit", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err) {
            console.log(err)
        } else {
            Answer.findById(req.params.answer_id, (err, answer) => {
                if(err){
                    console.log(err)
                } else {
                    
                    let header = `Edytuj odpowiedź | Pytanie | ${question._id} | Moviz`;
                    res.render("./answers/edit", { question: question, answer:answer, header: header, currentUser: req.user})
                    
                    
                }
            })
        }
    });
   
});

router.put("/:answer_id", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err) {
            console.log(err)
        } else {
            Answer.findById(req.params.answer_id, (err, updatedanswer) => {
                if(err){
                    console.log(err);
                } else {
                    if(req.body.answer.type === "Poprawna") {
                        updatedanswer.type = true;
                        updatedanswer.text = req.body.answer.text;
                        updatedanswer.save();
                        res.redirect("/dashboard");
                    } else if(req.body.answer.type === "Niepoprawna"){
                        updatedanswer.type = false;
                        updatedanswer.text = req.body.answer.text;
                        updatedanswer.save();
                        res.redirect("/dashboard");
                    }
                   
                }
            })
        }
    })
  
});
router.get("/:answer_id/delete/confirm", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err) {
            console.log(err)
        } else {
            Answer.findById(req.params.answer_id, (err, answer) => {
                if(err){
                    console.log(err);
                } else {
                    let header = `Potwierdzenie usunięcia odpowiedzi ${answer.text} | Moviz`;
                    res.render("./answers/delete", {header: header, currentUser: req.user, answer: answer, question: question})
                }
            })
        }
    })
  
})
router.get("/:answer_id/delete", isLoggedIn, (req, res) => {
    Question.findById(req.params.question_id, (err, question) => {
        if(err) {
            console.log(err)
        } else {
            Answer.findByIdAndRemove(req.params.answer_id, (err, updatedanswer) => {
                if(err){
                    console.log(err);
                } else {
                    res.redirect(`/dashboard`);
                }
            })
        }
    })
  
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect(`/`);
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;