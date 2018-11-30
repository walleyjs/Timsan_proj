const express=require("express");
const app= express();
const bodyParser=require("body-parser");
const localStrategy = require("passport-local");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const passport=require('passport');
const mongoose=require("mongoose");
var Todo=require("./models/todo.js");
var User=require("./models/user.js");
var Admin = require("./models/admin.js");
var Allmembers = require("./models/allmembers.js");
var nodemailer=require("nodemailer");
var adminRoute=require("./routes/adminRoute");
var userRoute=require("./routes/userRoute");
var indexRoute = require("./routes/indexRoute");
// var twilio=require("twilio");
// const accountSid = 'ACc17442b0ab36cf4106de614b5693f943';
// const authToken = 'ad0ae41a14a4d70757a7f049c12b2e28';
// const client = twilio(accountSid, authToken);
mongoose.connect("mongodb://localhost/timsan_app");
// mongoose.connect("mongodb://Walley:WAlley160.@ds039404.mlab.com:39404/timsan_database");
// mongodb: //<dbuser>:<dbpassword>@ds039404.mlab.com:39404/timsan_database
app.use(session({
    secret: "ita walley",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
app.set("view engine","ejs");
app.set("views","views");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("./public"));
app.set("port",process.env.PORT || 5000);
app.use(adminRoute);
app.use(userRoute);
app.use(indexRoute);
var server= app.listen(app.get("port"),function () {
    console.log("you are listening to port " +app.get("port"));
});