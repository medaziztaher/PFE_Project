const { user,medecin,patient } = require("./user")


module.exports={
    user,
    medecin,
    patient,
    userverification :require("./userverification") ,
    invitation :require("./invitations"),
    message : require("./message"),
    medicament : require("./medicament"),
    question : require("./question"),
    reponse : require("./reponse"),
    suivi : require('./suivi'),
    discussion: require('./discution')
}

