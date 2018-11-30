var express = require("express");
var router = express.Router();
var User = require("../models/user.js");

var passport = require("passport");
router.get("/", function (req, res) {
    User.find({}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            var userLogin = user.username;
            res.render("landing", {
                userLogin: userLogin
            });
        }
    })

});
module.exports = router;
