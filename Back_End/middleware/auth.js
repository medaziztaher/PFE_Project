const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const db = require('../Models/models');
const privateKey = "privateKey"

// Authentication function
const auth = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await db.user.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        return res.status(404).json({ message: "Email doesn't exist !" });
    }
    // Check the password is correct
    let validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
    return res.status(400).json({ message: "invalid password !" });
    }
    let role = user.role

    console.log(user)
        // delete the password from the res
    delete user._doc["password"];
        // Create A Token
    var token = jwt.sign({ _id: user._id, role }, privateKey, {
        expiresIn: "24h",
        })

    res.cookie("jwt_token", token, { maxAge: 10800 });
    return res.status(200).json({ token, user });
    } catch (error) {
     console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = auth;
