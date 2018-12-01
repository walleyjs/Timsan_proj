var express = require("express");
var router = express.Router();
var passport = require("passport");
var nodemailer = require("nodemailer");
var Todo = require("../models/todo.js");
var User = require("../models/user.js");
var Admin = require("../models/admin.js");
var Allmembers = require("../models/allmembers.js");
var ejs=require("ejs");
router.get("/user/signup", isLoggedIn, function (req, res) {
    User.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            var userLogin = user.username;
            res.render("signup", {
                userLogin: userLogin
            });
        }
    })

});

router.post("/user/signup", isLoggedIn, function (req, res) {

    // var newUser=new User({
    //     username:req.body.username
    // });
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;
    var number = req.body.number;
    var user = {
        username: username,
        email: email,
        number: number,
        password: password
    }
    User.create(user, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("signup");
        } else {
            res.redirect("/todoapp/" + user.id);
        }
    })
});
// app.get("/user/login",function (req,res) {
//         res.render("login");
// });
router.get("/user/login", isLoggedIn, function (req, res) {
    var password = req.query.password;
    var username = req.query.username;
    var userLogin;
    if (username && password) {
        User.find({
            username: username,
            password: password
        }, function (err, user) {


            if (user.username == username && user.password == password) {
                console.log(user + "not right");
                res.render("login", {
                    userLogin: userLogin
                });
            } else {
                user.forEach(user => {
                    userLogin = user.username;

                    console.log("here")
                    console.log(user);
                    res.redirect("/todoapp/" + user.id);
                });

            }

        });
    } else {
        res.render("login", {
            userLogin: userLogin
        });
    }

});


router.post("/todoapp/:todo", isLoggedIn, function (req, res) {
    var hobby;
    var usermail;
    var usernumber;
    User.findById(req.params.todo, function (err, user) {
        if (err) {
            console.log(err);
            console.log("there is an error some");
        } else {
            hobby = req.body.hobby;
            var todoApp = {
                hobby: hobby
            };
            usermail = user.email;
            usernumber = "+234" + user.number;
            Todo.create(todoApp, function (err, todoinput) {
                if (err) {
                    console.log(err);
                } else {
                    user.todo.push(todoinput.id);
                    user.save();
                    res.redirect("/todoapp/" + user.id);
                    console.log(todoinput);
                }
            });
            console.log(usermail);
            var mailMessage = hobby;
            var name=user.username;
            // var twiliooutput="you just added a new hobby: "+ hobby
            var account = {
                user: "rajibashirolawale@gmail.com",
                pass: "Walley160..."
            };

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass // generated ethereal password
                },
                tls: {
                    rejectUnaauthorized: false
                }
            });
            transporter.on('token', token => {
                console.log('A new access token was generated');
                console.log('User: %s', token.user);
                console.log('Access Token: %s', token.accessToken);
                console.log('Expires: %s', new Date(token.expires));
            });
            // setup email data with unicode symbols
            ejs.renderFile("views/templatedmail.ejs", {mailMessage:mailMessage,name:name}, function (err, data) {
                if (err) {
                     console.log(err);
                    } else {
            let mailOptions = {
                from: '"TIMSAN UNILAG" <rajibashirolawale@gmail.com>', // sender address
                to: usermail, // list of receivers
                subject: 'TIMSAN UNILAG', // Subject line
                text: 'Hello world?', // plain text body
                html: data // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            }

            });
            //     client.messages
            //   .create({
            //      body: twiliooutput,
            //      from: '(781) 875-8045',
            //      to: usernumber
            //    })
            //   .then()
            //   .done();
        }
    });
});
router.get("/todoapp/templatedmail/:id",function (req,res) {
    User.findById(req.params.id).populate("todo").exec(function (err, usertodo) {
        var userLogin = usertodo.username;
        if (err) {
            console.log(err);
        } else {
            // console.log(usertodo);
            res.render("templatedmail", {
                usertodo: usertodo,
                userLogin: userLogin
            })
        }
    });
});
router.get("/todoapp/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).populate("todo").exec(function (err, usertodo) {
        var userLogin = usertodo.username;
        if (err) {
            console.log(err);
        } else {
            // console.log(usertodo);
            res.render("index", {
                usertodo: usertodo,
                userLogin: userLogin
            })
        }
    });
});
router.get("/adminlogout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated());
        return next();
    }
    res.redirect("/admin/signin");
};


module.exports = router;