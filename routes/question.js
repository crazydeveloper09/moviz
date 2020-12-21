const express = require("express"),
    app = express(),
    Answer = require("../models/answer"),
    Question = require("../models/question"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    router = express.Router(),
    multer = require("multer"),
    dotenv 	= require("dotenv");
    dotenv.config();

var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
// accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3)$/i)) {
        return cb(new Error('Only image and mp3 files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'syberiancats', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(flash());
app.use(methodOverride("_method"));

  
router.get("/new", isLoggedIn, (req, res) => {
    Question.find({}, (err, questions) => {
        if(err){
            console.log(err)
        } else {
            res.render("./questions/new", {header: "Dodaj pytanie | Moviz", questions: questions});
        }
    })
   
})

router.get("/random", (req, res) => {
    Question
        .find({
            $and: [{type: req.query.type}, {category: req.query.category}]
        }, (err, questions) => {
        if(err){
            console.log(err)
        } else {
            if(questions.length === 0){
                req.flash("error", `Nie znaleźliśmy pytań w kategorii ${req.query.category} i typie ${req.query.type}`)
                res.redirect("back")
            } else if(questions.length === 1){
               
                res.redirect(`/questions/${questions[0]._id}?answerType=${req.query.answerType}`)
            } else {
               
                res.redirect(`/questions/${questions[Math.floor(Math.random() * questions.length)]._id}?answerType=${req.query.answerType}`)
            }
           
        }
    })
})

router.get("/search", isLoggedIn, (req, res) => {
    Question
        .find({
            $and: [
                {type: req.query.type}, 
                {category: req.query.category},
                {author: req.user._id}
            ]
        }).populate("answers").exec((err, questions) => {
        if(err){
            console.log(err)
        } else {
           let header = `Wyszukiwanie pytań dla kategorii ${req.query.category} i typie ${req.query.type} | Moviz`;
           res.render("./questions/search", {questions: questions, header: header, category: req.query.category, type: req.query.type, currentUser: req.user})
           
        }
    })
})

router.get("/:id", (req, res) => {
    Question.findById(req.params.id).populate("answers").exec((err, question) => {
        if(err){
            console.log(err)
        } else {
            function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
              
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
            res.render("./questions/show", {header: header, question: question, answers: mixedAnswers, answerType: req.query.answerType})
        }
    })
})

router.post("/", upload.single("file"), (req, res) => {
    if(req.isAuthenticated()){
        let newQuestion = new Question({
            title: req.body.title,
            category: req.body.category,
            type: req.body.type,
            heroType: req.body.heroType,
            dataType: req.body.dataType,
            timeToAnswer: req.body.timeToAnswer,
            quote: req.body.quote,
            author: req.user._id
        })
        Question.create(newQuestion, (err, createdQuestion) => {
           
                if(typeof req.file !== 'undefined'){
                    if(createdQuestion.type === "Soundtrack" || createdQuestion.type === "Piosenka"){
                        cloudinary.v2.uploader.upload(req.file.path, {resource_type: "video"}, function(err, result) {
                            console.log(result)
                            createdQuestion.file = result.secure_url;
                            createdQuestion.save();
                            res.redirect("/dashboard")
                        });
                    } else {
                        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                            console.log(result)
                            createdQuestion.file = result.secure_url;
                            createdQuestion.save();
                            res.redirect("/dashboard")
                        });
                    }
                   
                } else {
                    res.redirect("/dashboard")
                }
           
        })
        
    } else {
        req.flash("error", "Nie masz dostępu do tej strony");
        res.redirect(`/`);
    }
})

router.get("/:question_id/edit", isLoggedIn, (req, res) => {
    
    Question.findById(req.params.question_id, (err, question) => {
        if (err) {
            console.log(err)
        } else {

            let header = `Edytuj pytanie | ${question.title} | Moviz`;
            res.render("./questions/edit", { question: question, header: header })


        }
    })

   
});

router.put("/:question_id", isLoggedIn, (req, res) => {
  
    Question.findByIdAndUpdate(req.params.question_id, req.body.question, (err, updatedquestion) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/dashboard`);
        }
    })
       
  
});
router.get("/:question_id/editFile", isLoggedIn, (req, res) => {
    
    Question.findById(req.params.question_id, (err, question) => {
        if (err) {
            console.log(err)
        } else {

            let header = `Edytuj plik | ${question.title} | Moviz`;
            res.render("./questions/editFile", { question: question, header: header })


        }
    })

   
});

router.post("/:question_id/editFile", upload.single("file"), isLoggedIn, (req, res) => {
  
    Question.findById(req.params.question_id, (err, question) => {
        if (err) {
            console.log(err);
        } else {
            if(question.type === "Soundtrack" || question.type === "Piosenka"){
                cloudinary.v2.uploader.upload(req.file.path, {resource_type: "video"}, function(err, result) {
                    console.log(result)
                    question.file = result.secure_url;
                    question.save();
                    res.redirect("/dashboard")
                });
            } else {
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    console.log(result)
                    question.file = result.secure_url;
                    question.save();
                    res.redirect("/dashboard")
                });
            }
        }
    })
       
  
});
router.get("/:question_id/delete/confirm", isLoggedIn, (req, res) => {
   
    Question.findById(req.params.question_id, (err, question) => {
        if (err) {
            console.log(err);
        } else {
            let header = `Potweirdzenie usunięcia | ${question.title} | Moviz`;
            res.render("./questions/delete", {header: header, question: question, currentUser: req.user})
        }
    })
      
  
})

router.get("/:question_id/delete", isLoggedIn, (req, res) => {
   
    Question.findByIdAndRemove(req.params.question_id, (err, updatedquestion) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/dashboard`);
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