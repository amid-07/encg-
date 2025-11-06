// ===================================================================
// FICHIER COMPLET FINAL : backend/routes/annonces.js
// ===================================================================
const express = require('express');
const router = express.Router();
const Annonce = require('../models/Annonce');

// === ROUTE DE CRÉATION (CORRIGÉE ET FINALISÉE) ===
router.post('/creer', async (req, res) => {
    // On récupère toutes les données envoyées par le frontend
    const { titre, contenu, filiere, groupe, auteur, auteurId, roleDemandeur } = req.body;
    
    // 1. Vérification des permissions
    if (!roleDemandeur || !['admin', 'prof', 'delegue'].includes(roleDemandeur)) {
        return res.status(403).json({ message: "Accès refusé. Permissions insuffisantes." });
    }
    
    // 2. Vérification des champs obligatoires pour le modèle
    if (!titre || !contenu || !auteur || !auteurId) {
        return res.status(400).json({ message: "Erreur : le titre, le contenu ou les informations de l'auteur sont manquants." });
    }
    
    try {
        // 3. On crée l'objet à sauvegarder avec TOUS les champs requis
        const newAnnonce = new Annonce({ 
            titre: titre, 
            contenu: contenu, 
            filiere: filiere, 
            groupe: groupe, 
            auteur: auteur, 
            auteurId: auteurId 
        });

        await newAnnonce.save();
        res.status(201).json({ message: "Annonce créée avec succès." });

    } catch (error) {
        console.error("ERREUR LORS DE LA CRÉATION DE L'ANNONCE :", error);
        res.status(500).json({ message: "Erreur du serveur lors de la création de l'annonce." });
    }
});

// === ROUTE DE SUPPRESSION (VÉRIFIÉE) ===
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.body;
        const annonce = await Annonce.findById(id);
        if (!annonce) return res.status(404).json({ message: "Annonce non trouvée." });

        if (userRole !== 'admin' && annonce.auteurId !== userId) {
            return res.status(403).json({ message: "Accès refusé." });
        }
        await Annonce.findByIdAndDelete(id);
        res.status(200).json({ message: "Annonce supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === ROUTE GET (VÉRIFIÉE) ===
router.get('/', async (req, res) => {
    try {
        const annonces = await Annonce.find().sort({ createdAt: -1 });
        res.status(200).json(annonces);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

module.exports = router;