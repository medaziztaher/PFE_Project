const {req,res}= require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Models/models');
const privateKey ='privateKey'
const { validationResult } = require('express-validator')

const signup = async (req, res) => {
  try {
    const userData = req.body;

    // Check if a user with the same email or username already exists
    const existingUser = await db.user.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec le meme nom d utilisateur ou email existe deja' });
    }

    

    // Create a new user document
    const newUser =  await db.user.create(userData);
    // Hash the password
    const hash = await bcrypt.hash(userData.password, 12)
    newUser.password = hash

    // Save the user document to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role },privateKey,
        {expiresIn: "24h"});

    // Create a new sub-document and save to the database based on user role
    if (userData.role === 'medecin') {
      if (!userData.specialite) {
        return res.status(400).json({ message: 'La specialite est requise pour le role de medecin' });
      }
      const newMedecin = new db.med(
        {
            specialite: userData.specialite,
            user: savedUser._id
        });
      await db.med.create(newMedecin)
      const savedMedecin = await newMedecin.save();
      savedUser.liste_d_invitations = [];
      savedUser.liste_de_messages = [];
      savedUser.liste_de_patients = [];
      savedUser.liste_de_medecins = [savedMedecin._id];
      await savedUser.save();
      return res.status(201).json({
        message: 'Le medecin a ete cree avec succes',
        token: token,
        medecin: {
          _id: savedMedecin._id,
          username: savedUser.username,
          email: savedUser.email,
          nom: savedUser.nom,
          prenom: savedUser.prenom,
          specialite: savedMedecin.specialite,
          adresse: savedUser.adresse
        },
      });
    } else if (userData.role === 'patient') {
      if (!userData.sexe) {
        return res.status(400).json({ message: 'le sexe sont requis pour le role de patient' });
      }
      const newPatient = new db.pat(
        {
            date_naissance: userData.date_naissance,
            sexe: userData.sexe,
            user: savedUser._id
        });
    await db.pat.create(newPatient)
    const savedPatient = await newPatient.save()
    savedUser.liste_d_invitations = [];
    savedUser.liste_de_messages = [];
    savedUser.liste_de_patients = [savedPatient._id];
    savedUser.liste_de_medecins = [];
    await savedUser.save();
    return res.status(201).json({
        message: 'Le patient a ete cree avec succes',
        token: token,
        patient: {
        _id: savedPatient._id,
        username: savedUser.username,
        email: savedUser.email,
        nom: savedUser.nom,
        prenom: savedUser.prenom,
        date_naissance: savedPatient.date_naissance,
        sexe: savedPatient.sexe,
        adresse: savedUser.adresse
        },
    });
    } else {
        return res.status(400).json({ message: 'Le role doit etre "medecin" ou "patient"' });
    }
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de la creation du medecin ou le patient', error: error.message });
  }
}

module.exports=signup