const express =require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../Models/models');
const privateKey =process.env.AUTH_PRIVETKEY;

// Authentication function
const signin = async (req, res) => {
  // Extract username or email and password from request body
  const  usernameoremail = req.body.usernameoremail
  const password  = req.body.password
  try {
    // Check if a user with the provided username or email exists
    const user = await db.user.findOne({email: usernameoremail})

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    /*if (user.verified){
      res.json({
      status: "FAILED",
      message:"Email hasn't been verified yet. Check your inbox"
        })
      }*/

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, privateKey, { expiresIn: '24h' });
    const username = user.username

    // Return a success response with the user object and token
    return res.status(200).json({
      message: `You have successfully logged in as ${user.role}`,
      token,
      [username]: {
        _id : user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        sexe: user.sexe,
        adresse: user.adresse
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while logging in", error: error.message });
  }
};

module.exports = signin;

