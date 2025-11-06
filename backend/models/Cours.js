// ===================================================================
// FICHIER COMPLET FINAL : backend/models/Cours.js
// ===================================================================
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const modulesValides = ['GP', 'GBT', 'SCM', 'INFO', 'GRH', 'Statistiques', 'Autre'];

const coursSchema = new Schema({
    titre: { type: String, required: true },
    description: { type: String },
    lien: { type: String, required: true },
    auteur: { type: String, required: true },
    auteurId: { type: String, required: true }, // ID de l'auteur pour la sécurité
    section: { type: String, required: true, default: 'tous' },
    filiere: { type: String, required: true },
    module: { type: String, required: true, enum: modulesValides }
}, { timestamps: true });

const Cours = mongoose.model('Cours', coursSchema);
module.exports = Cours;