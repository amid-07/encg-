// ===================================================================
// FICHIER COMPLET FINAL : backend/routes/cours.js
// ===================================================================
const express = require('express');
const router = express.Router();
const Cours = require('../models/Cours');

// === ROUTE DE CRÉATION (MODIFIÉE) ===
router.post('/creer', async (req, res) => {
    const { titre, description, lien, auteur, auteurId, filiere, module } = req.body;
    if (!titre || !lien || !auteur || !auteurId || !filiere || !module) {
        return res.status(400).json({ message: "Champs requis manquants." });
    }
    try {
        const newCours = new Cours({ titre, description, lien, auteur, auteurId, filiere, module });
        await newCours.save();
        res.status(201).json({ message: "Cours partagé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === ROUTE DE SUPPRESSION (SÉCURISÉE) ===
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.body;

        const cours = await Cours.findById(id);
        if (!cours) {
            return res.status(404).json({ message: "Cours non trouvé." });
        }

        // ** RÈGLE DE SÉCURITÉ **
        if (userRole !== 'admin' && cours.auteurId !== userId) {
            return res.status(403).json({ message: "Accès refusé." });
        }

        await Cours.findByIdAndDelete(id);
        res.status(200).json({ message: "Cours supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});


// === ROUTE GET (VÉRIFIÉE) ===
router.get('/', async (req, res) => {
    try {
        const cours = await Cours.find().sort({ createdAt: -1 });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

module.exports = router;