const { req, res } = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Models/models');
const privateKey = process.env.AUTH_PRIVETKEY;
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path")
require("dotenv").config();

/*
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log("ready for message");
    console.log(success);
  }
});
const sendVerificationEmail = ({ _id, email }, res) => {
  const currentUrl = req.protocol + "://" + req.get("host");
  const uniqueString = uuidv4() + _id
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${currentUrl + "/signup?id=" + _id + "&uniqueString=" + uniqueString}>here</a> to proceed.</p>`,
  };

  bcrypt
    .hash(uniqueString, 10)
    .then((hasheduniqueString) => {
      const newverification = new db.userverification({
        userId: _id,
        uniqueString: hasheduniqueString,
        createdAt: Date.now(),
        expiredAt: Date.now() + 2160000,
      });
      newverification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.json({
                status: "PENDING",
                message: "Verification Email Sent"
              })
            })
            .catch((error) => {
              console.log(error);
              res
                .status(400)
                .json({ message: "Verification email failed!" });
            })
        })
        .catch((error) => {
          console.log(error);
          res
            .status(400)
            .json({ message: "Couldn't save verification email data!" });
        })
    })
    .catch(() => {
      res
        .status(400)
        .json({ message: "An error occurred while hashing email data!" });
    })
}
const getverifiaction = (req, res) => {
  let { id: userId, uniqueString } = req.query;
  db.userverification
    .find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiredAt } = result[0];
        const hasheduniqueString = result[0].uniqueString;
        if (expiredAt < Date.now()) {
          db.userverification.deleteOne({ userId })
            .then((result) => {
              db.user.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has expired. Please sign up again.";
                  res.redirect(`/verified/error=true&message=${message}`);
                })
                .catch(error => {
                  let message = "Clearing user with expired unique string failed";
                  res.redirect(`/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              // Handle error
            });
        } else {
          bcrypt.compare(uniqueString, hasheduniqueString)
            .then((match) => {
              if (match) {
                db.userverification.deleteOne({ userId })
                  .then(() => {
                    db.user.updateOne({ _id: userId }, { $set: { isVerified: true } })
                      .then(() => {
                        let message = "Email verification successful. You can now log in.";
                        res.redirect(`/verified/success=true&message=${message}`);
                      })
                      .catch((error) => {
                        let message = "Updating user verification status failed";
                        res.redirect(`/verified/error=true&message=${message}`);
                      });
                  })
                  .catch((error) => {
                    let message = "Deleting user verification data failed";
                    res.redirect(`/verified/error=true&message=${message}`);
                  });
              } else {
                let message = "Invalid or expired link. Please sign up again.";
                res.redirect(`/verified/error=true&message=${message}`);
              }
            })
            .catch((error) => {
              let message = "An error occurred while verifying email data!";
              res.redirect(`/verified/error=true&message=${message}`);
            });
        }
      } else {
        let message = "Invalid or expired link. Please sign up again.";
        res.redirect(`/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      let message = "An error occurred while verifying email data!";
      res.redirect(`/verified/error=true&message=${message}`);
    });
}
const verified = (req,res) =>{
  res.sendFile(path.join(__dirname,"./../views/verified.html"))

}
*/
const signup = async (req, res) => {
  // Extract user data from request body
  const userData = req.body;

  // Check if any of the required fields are empty
  if (
    userData.username === "" ||
    userData.email === "" ||
    userData.password === "" ||
    userData.nom === "" ||
    userData.prenom === "" ||
    userData.sexe === ""
  ) {
    return res
      .status(400)
      .json({ message: "Empty input fields!" });
  }

  // Check if first name and last name only contain letters and spaces
  if (
    !/^[a-zA-Z ]*$/.test(userData.nom) ||
    !/^[a-zA-Z ]*$/.test(userData.prenom)
  ) {
    return res.status(400).json({
      message: "Invalid first name or last name fields!",
    });
  }

  // Check if the email is valid
  if (
    !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userData.email)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid email entered!" });
  }

  // Check if the password is at least 8 characters long
  if (userData.password.length < 8) {
    return res
      .status(400)
      .json({ message: "password is too short!" });
  }

  // Validate user input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await db.user.findOne({
      $or: [{ emai: userData.email }, { username: userData.username }],
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Un utilisateur avec le meme nom d utilisateur ou email existe deja",
      });
    }

    // Hash the password
    const hash = await bcrypt.hash(userData.password, 12);

    // Create a new user object
    let newUser;
    if (userData.role === "medecin") {
      if (!userData.specialite) {
        return res
          .status(400)
          .json({
            message: "La specialite est requise pour le role de medecin",
          });
      }
      newUser = new db.medecin(userData);
      newUser.password=hash
    } else if (userData.role === "patient") {
      if (!userData.date_naissance) {
        return res
          .status(400)
          .json({
            message:
              "La date de naissance est requise pour le role de patient",
          });
      }
      newUser = new db.patient(userData);
      newUser.password=hash
    } else {
      return res
        .status(400)
        .json({ message: 'Le role doit etre "medecin" ou "patient"' });
    }

    // Save the new user object to the database
    const savedUser = await newUser.save()
    /*
    .then((result)=>{
      sendVerificationEmail(result,res)
    });*/

    // Generate a JWT token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.AUTH_PRIVETKEY,
      { expiresIn: "24h" }
    );
    const username = savedUser.username;

    // Return a success response with the new user object and token
    return res.status(201).json({
      message: `Le ${savedUser.role} a ete cree avec succes`,
      token,
      [savedUser.username]: {
        _id : savedUser._id,
        email: savedUser.email,
        nom: savedUser.nom,
        prenom: savedUser.prenom,
        sexe:savedUser.sexe,
        adresse: savedUser.adresse
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la creation du medecin ou le patient', error: error.message });
  }
}

module.exports=signup