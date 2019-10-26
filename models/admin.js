var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
const saltRounds = 10;

var AdminModel = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

AdminModel.pre("save", function(next) {
  bcrypt.hash(this.password, saltRounds, (err, hashedPass) => {
    if (err) return next(err);
    this.password = hashedPass;
    next();
  });
});

var Admin = mongoose.model("Admin", AdminModel);
module.exports = Admin;
