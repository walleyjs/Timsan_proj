var express=require("express");
var router = express.Router();
var passport=require("passport");
var nodemailer = require("nodemailer");
var Allmembers = require("../models/allmembers.js");
var Todo = require("../models/todo.js");
var User = require("../models/user.js");
var Admin = require("../models/admin.js");
var User = require("../models/user.js");
router.get("/allmembers",isLoggedIn,function(req, res) {
    User.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
             var userLogin = user.username;
            Allmembers.find({},function (err,message) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("allmembers", {
                        userLogin: userLogin,
                        user: user,
                        message:message
                    });
                }
            });
           
            
        }
    });
});
router.post("/allmembers",isLoggedIn,function(req, res) {
        var message;
        // var usermail;
        User.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            message=req.body.message;
            //  usermail = user.email;
            var newmessage={message:message}
            Allmembers.create(newmessage,function name(err,message) { 
                if (err) {
                    console.log(err);
                } else {
                    message=message.message;
                    console.log(message)
                    res.redirect("/allmembers");
                }
            });
        }
        var output = `
    <b><h2>Hello ${user.username}<h2></b>
    <p><i><h3>${message}</h3></i></p>
    `;
        user.forEach(function (user) {
          var usermail = user.email;
            var account={
        user:"rajibashirolawale@gmail.com",
        pass:"Walley160..."
    };
    
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls:{
            rejectUnaauthorized:false
        }
    });
    transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
    });
    let mailOptions = {
        from: '"TIMSAN UNILAG" <rajibashirolawale@gmail.com>', // sender address
        to: usermail, // list of receivers
        subject: 'TIMSAN UNILAG', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
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
        });
        
    });
   
});
router.get("/admin/walley",function (req,res) {
     User.find({}, function (err, user) {
         if (err) {
             console.log(err);
         } else {
             var userLogin = user.username;
              res.render("adminsignup", {
                 userLogin: userLogin
             });
         }
     });
   
});
router.post("/admin/signup",function (req,res) {
    Admin.register(new Admin({username:req.body.username}),req.body.password,function (err,admin) {
        if (err) {
            console.log(err);
            console.log("================admin err ===");
            res.render("adminsignup");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/allmembers");
                console.log("registerd");
                // console.log(req.user);
            });
        }
    })
});
router.get("/admin/signin",function (req,res) {
    User.find({}, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            var userLogin = user.username;
            res.render("adminsignin", {
                userLogin: userLogin
            });
        }
    });
});
router.post("/admin/signin", passport.authenticate("local", {
    successRedirect: "/allmembers",
    failureRedirect: "/admin/signin"
}), (req, res) => {});
router.get("/userlogout", (req, res) => {
    // req.logout();
    res.redirect("/user/login");
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
module.exports =router;