const {request,response} = require('express');
const db = require('../Models/models')


const enoyer_inv = async (req, res) => {
    const username = req.body.username;

    try {
        // Check if sender and receiver exist
        const sender = await db.user.findById(req.user._id);
        const receiver = await db.user.findOne({ username: username });
        if (!sender || !receiver) {
            return res.status(404).send('User not found');
        }

        // If sender is a patient
        if (sender.role === 'patient') {
            // Check if receiver is a medecin and is not already in the patient's list of medecins
            if (receiver.role !== 'medecin' || sender.liste_de_medecins.includes(receiver._id)) {
                return res.status(400).send('Invalid receiver');
            }

            // Check if receiver's speciality is different from patient's list of medecins
            const receiverMedecin = await db.medecin.findById(receiver._id);
            if (!receiverMedecin || sender.liste_de_medecins.some(
                async medecinId => {
                    const medecin = await db.medecin.findById(medecinId);
                    return medecin.specialite === receiverMedecin.specialite;
                })) {
                return res.status(400).send('Invalid receiver');
            }

            // Add invitation to receiver's list
            const invitation = new db.invitation({ _emetteur:req.user._id, _recepteur: receiver._id });
            await invitation.save();
            receiver.liste_d_invitations.push(invitation._id);
            await receiver.save();
            return res.send('Invitation sent');
        }

        // If sender is a medecin
        if (sender.role === 'medecin') {
            // Check if receiver is a patient or a medecin
            if (receiver.role !== 'patient' && receiver.role !== 'medecin') {
                return res.status(400).send('Invalid receiver');
            }

            // If receiver is a patient, check if patient is not already in medecin's list of patients
            if (receiver.role === 'patient' && sender.liste_de_patients.includes(receiver._id)) {
                return res.status(400).send('Invalid receiver');
            }

            // If receiver is a medecin, check if specialties are different and if they have at least one common patient
            if (receiver.role === 'medecin') {
                const receiverMedecin = await db.medecin.findById(receiver._id);
                if (!receiverMedecin || sender.specialite === receiverMedecin.specialite) {
                    return res.status(400).send('Invalid receiver');
                }
                const commonPatients = sender.liste_de_patients.filter(async patientId => {
                    const patient = await db.patient.findById(patientId);
                    return patient.liste_de_medecins.includes(receiver._id);
                });
                if (commonPatients.length === 0) {
                    return res.status(400).send('Invalid receiver');
                }
            }

            // Add invitation to receiver's list
            const invitation = new db.invitation({ _emetteur:req.user._id, _recepteur: receiver._id });
            await invitation.save();
            receiver.liste_d_invitations.push(invitation._id);
            await receiver.save();
            return res.send('Invitation sent');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}
const receive_inv = async (req, res) => {
    try {
      // Find the user and populate the list of invitations
      const user = await db.user.findById(req.user._id).populate('liste_d_invitations');
  
      // Return the list of invitations
      res.send(user.liste_d_invitations);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
const accept_inv = async (req, res) => {
    try {
      const invitation = await db.invitation.findById(req.params.id);
      const receiver = await db.user.findById(req.user._id);
      const sender = await db.user.findById(invitation._emetteur);
  
      // Check if invitation exists and receiver is the one that received the invitation
      if (!invitation || !receiver.liste_d_invitations.includes(invitation._id)) {
        return res.status(404).send('Invitation not found');
      }
  
      // Update status of invitation
      invitation.status = 'Accepter';
      await invitation.save();
  
      // Add sender to receiver's list of medecins or receiver to sender's list of patients
      if (receiver.role === 'patient') {
        const senderMedecin = await db.medecin.findById(sender._id);
        receiver.liste_de_medecins.push(sender._id);
        senderMedecin.liste_de_patients.push(receiver._id);
        await senderMedecin.save();
      } else if (receiver.role === 'medecin') {
        const patient = await db.patient.findById(invitation._recepteur);
        receiver.liste_de_patients.push(patient._id);
        patient.liste_de_medecins.push(receiver._id);
        await patient.save();
      }
  
      // Remove invitation from receiver's list of invitations
      receiver.liste_d_invitations = receiver.liste_d_invitations.filter(invId => !invId.equals(invitation._id));
      await receiver.save();
  
      res.send('Invitation accepted');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};
const refuse_inv = async (req, res) => {
    try {
      const invitation = await db.invitation.findById(req.params.id);
      const receiver = await db.user.findById(req.user._id);
  
      // Check if invitation exists and receiver is the one that received the invitation
      if (!invitation || !receiver.liste_d_invitations.includes(invitation._id)) {
        return res.status(404).send('Invitation not found');
      }
  
      // Update status of invitation
      invitation.status = 'Refuser';
      await invitation.save();
  
      // Remove invitation from receiver's list of invitations
      receiver.liste_d_invitations = receiver.liste_d_invitations.filter(invId => !invId.equals(invitation._id));
      await receiver.save();
  
      res.send('Invitation declined');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};
  
  



const user ={
    enoyer_inv,
    receive_inv,
    accept_inv,
    refuse_inv
}


module.exports = user

