// ===================================================================
// FICHIER COMPLET FINAL : backend/models/Utilisateur.js
// ===================================================================
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const utilisateurSchema = new Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    section: { 
        type: String, 
        required: function() { return this.role === 'etudiant'; }
    },
    filiere: { 
        type: String, 
        enum: ['Gestion', 'Commerce'],
        required: function() { return this.role === 'etudiant'; }
    },
    groupe: { 
        type: String, 
        required: function() { return this.role === 'etudiant'; }
    },
    role: {
        type: String,
        required: true,
        enum: ['etudiant', 'admin', 'prof', 'delegue'], 
        default: 'etudiant'
    }
}, { timestamps: true });

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;