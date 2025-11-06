// ===================================================================
// FICHIER COMPLET FINAL : backend/models/Annonce.js
// ===================================================================
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const annonceSchema = new Schema({
    titre: { type: String, required: true },
    contenu: { type: String, required: true },
    section: { type: String, required: true, default: 'tous' },
    filiere: { type: String, required: true, default: 'tous' },
    groupe: { type: String, required: true, default: 'tous' },
    auteur: { type: String, required: true },
    auteurId: { type: String, required: true }
}, { timestamps: true });

const Annonce = mongoose.model('Annonce', annonceSchema);
module.exports = Annonce;