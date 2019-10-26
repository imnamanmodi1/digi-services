var express = require("express");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var Admin = require("../models/admin");
var router = express.Router();

//declaring my secret key to sign JSON Web Token(JWT) on successful login
const secret = "wXy@37Kb1L";

// handle admin registration = /admin/register
router.post("/register", (req, res, next) => {
  // destructuring data from request's body
  var { email, firstName, lastName, password } = req.body;
  // creating admin user
  Admin.create(
    {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password
    },
    (err, result) => {
      if (err) next(err);
      if (result) {
        res.json({
          status: 200,
          success: true,
          message: "ADMIN REGISTERED"
        });
      }
    }
  );
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  Admin.findOne({ email: email }, (err, userInfo) => {
    if (err) {
      res.json({ status: 400, success: false, message: "User not found" });
    }
    if (userInfo != null) {
      //match password
      if (bcrypt.compareSync(password, userInfo.password)) {
        const token = jwt.sign({ id: userInfo._id }, secret, {
          expiresIn: "1h"
        });
        res.json({
          status: 200,
          success: true,
          message: "USER LOGIN SUCCESSFUL",
          key: token,
          userData: {
            ...userInfo._doc
          }
        });
      } else {
        // handling error when password doesn't matches
        res.json({
          status: 400,
          success: false,
          message: "USER LOGIN UNSUCCESSFUL",
          description: "EMAIL ID OR PASSWORD INVALID"
        });
      }
    }
    if (!userInfo) {
      res.json({
        status: 400,
        success: false,
        message: "User email/password invalid"
      });
    }
  });
});

module.exports = router;
