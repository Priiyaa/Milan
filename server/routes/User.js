//* All routes related to user's LOGIN AND REGISTER

const express = require("express");
const User = require("../models/UserSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//* Route 1  - User Registration
router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const { email } = req.body;
    let exists = await User.findOne({
      email,
    });
    if (exists) {
      return res.json({ exists: true });
    }
    const UserData = User({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      address: data.address,
      pincode: data.pincode,
    });

    //hashing the data
    const hashpassword = await bcrypt.hash(data.password, 10);
    UserData.password = hashpassword;
    //saving the data to mongodb
    UserData.save();
    return res.json({ success: true });
  } catch (e) {
    console.log(e);
  }
});

//* Route 2 - User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let exists = await User.findOne({
      email,
    });
    const validPassword = await bcrypt.compare(password, exists.password);
    const payload = {
      User: {
        id: exists.email,
      },
    };
    if (validPassword) {
      jwt.sign(payload, "HELLOSECRET123", (err, token) => {
        return res.json({ status: true, token });
      });
    } else {
      return res.json({ status: false });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
