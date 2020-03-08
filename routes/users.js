const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
router.get("/", (req, res) => {
  res.json({ msg: "Get route for users..." });
});

// @route POST /api/users
// @desc  Create a new user
// @access authorization not required / public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password is required, needs to be 6 characters long..."
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Pull name, email, and password off the request body
    const { name, email, password } = req.body;

    try {
      // Check to see if email is free
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Create user
      user = new User({
        name,
        email,
        password
      });

      // Salt password
      const salt = await bcrypt.genSaltSync(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // res.json({ msg: "User saved..." });
      // Need to send back jsonToken now, instead of just a message that the user was saved.
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get("jsToken"), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error..." });
    }
  }
);

module.exports = router;
