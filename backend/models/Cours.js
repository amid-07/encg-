// ===================================================================
// FICHIER COMPLET FINAL : backend/models/Cours.js
// ===================================================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// On définit la liste des modules autorisés pour la validation
const modulesValides = ['GP', 'GBT', 'SCM', 'INFO', 'GRH', 'Statistiques', 'Autre'];

const coursSchema = new Schema({
    titre: { type: String, required: true },
    description: { type: String },
    lien: { type: String, required: true },
    auteur: { type: String, required: true },
    auteurId: { type: String, required: true },
    filiere: { type: String, required: true },
    module: { type: String, required: true, enum: modulesValides },
    
    // NOUVEAU CHAMP pour le système d'approbation
    status: {
        type: String,
        required: true,
        enum: ['en attente', 'approuvé'],
        default: 'en attente' // Par défaut, toute nouvelle soumission est en attente
    }
}, { timestamps: true });

const Cours = mongoose.model('Cours', coursSchema);

module.exports = Cours;