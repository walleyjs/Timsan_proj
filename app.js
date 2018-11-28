var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Todo=require("./models/todo.js");
var User=require("./models/user.js");
var nodemailer=require("nodemailer");
// var twilio=require("twilio");
// const accountSid = 'ACc17442b0ab36cf4106de614b5693f943';
// const authToken = 'ad0ae41a14a4d70757a7f049c12b2e28';
// const client = twilio(accountSid, authToken);
mongoose.connect("mongodb://localhost/timsan_app");
// mongoose.connect("mongodb://Walley:WAlley160.@ds239873.mlab.com:39873/dsinternchallenge");
app.set("view engine","ejs");
app.set("views","views");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("./public"));

app.set("port",process.env.PORT || 5000);



app.get("/",function (req,res) {
    User.find({},function (err,user) {
        if (err) {
            console.log(err);
        } else {
            var userLogin=user.username;
            res.render("landing",{userLogin:userLogin});
        }
    })
    
});
app.get("/user/signup",function (req,res) {
   User.find({},function (err,user) {
        if (err) {
            console.log(err);
        } else {
            var userLogin=user.username;
            res.render("signup",{userLogin:userLogin});
        }
    })
        
});

app.post("/user/signup",function (req,res) {
    
    // var newUser=new User({
    //     username:req.body.username
    // });
    var password=req.body.password;
    var username=req.body.username;
    var email=req.body.email;
    var number=req.body.number;
    var user={
        username:username,
        email:email,
        number:number,
        password:password
    }
    User.create(user,function (err,user) {
        if (err) {
            console.log(err);
            return res.render("signup");
        } else {
            res.redirect("/todoapp/"+ user.id );
        }
    })
});
// app.get("/user/login",function (req,res) {
//         res.render("login");
// });
app.get("/user/login",function (req,res) { 
    var password=req.query.password;
    var username=req.query.username;
    var userLogin;
    if (username && password ) {
        User.find({username:username,password:password},function (err,user) {
        
           
        if (user.username==username && user.password==password) {
            console.log(user+"not right");
            res.render("login",{userLogin:userLogin});
        }
        else{
            user.forEach(user => {
            userLogin=user.username;
            console.log("==========sippose not in db=====");
             console.log("here")
            console.log(user);
            res.redirect("/todoapp/"+ user.id );    
            });
            
        }
            
});
    } else {
        res.render("login",{userLogin:userLogin});
    }
    
        }
        );
 

app.post("/todoapp/:todo",function (req,res) {
    var hobby;
    
    var usermail;
    var usernumber;
    User.findById(req.params.todo,function (err,user) {
        if (err) {
            console.log(err);
            console.log("there is an error some");
        } else {
            hobby=req.body.hobby; 
            var todoApp={hobby:hobby};
            usermail=user.email;
            usernumber="+234"+user.number;
            Todo.create(todoApp,function (err,todoinput) {
              if (err) {
                console.log(err);
             } else {
                user.todo.push(todoinput.id);
                user.save();
                res.redirect("/todoapp/"+ user.id);
                console.log(todoinput);
                    }
            });
            console.log(usermail);
    var output=`
    <h1>you just added a new hobby</h1>
    <p>Hobby:${hobby}</p>
    `;
    var twiliooutput="you just added a new hobby: "+ hobby
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
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Hobby adddds" <rajibashirolawale@gmail.com>', // sender address
        to: usermail, // list of receivers
        subject: 'your new hobby', // Subject line
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
//     client.messages
//   .create({
//      body: twiliooutput,
//      from: '(781) 875-8045',
//      to: usernumber
//    })
//   .then()
//   .done();
        }
    })
});
    app.get("/todoapp/:id",function (req,res) {
    User.findById(req.params.id).populate("todo").exec(function (err,usertodo) {
        var userLogin=usertodo.username;
        if (err) {
            console.log(err);
        } else {
            // console.log(usertodo);
            res.render("index",{
                usertodo:usertodo,
                userLogin:userLogin
            })
        }
    });
});
app.get("/logout", function (req, res) {
    // req.logout();
    res.redirect("/");
});
// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };

var server= app.listen(app.get("port"),function () {
    console.log("you are listening to port " +app.get("port"));
});