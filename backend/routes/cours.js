// ===================================================================
// FICHIER COMPLET FINAL : backend/routes/cours.js
// ===================================================================

const express = require('express');
const router = express.Router();
const Cours = require('../models/Cours');

// === ROUTE DE CRÉATION (AVEC LOGIQUE DE STATUT) ===
router.post('/creer', async (req, res) => {
    const { titre, description, lien, auteur, auteurId, filiere, module, roleDemandeur } = req.body;
    if (!titre || !lien || !auteur || !auteurId || !filiere || !module) {
        return res.status(400).json({ message: "Un ou plusieurs champs requis sont manquants." });
    }

    // Logique pour définir le statut en fonction du rôle de l'utilisateur
    let statutFinal = 'en attente';
    if (['prof', 'delegue', 'admin'].includes(roleDemandeur)) {
        statutFinal = 'approuvé';
    }
    
    try {
        const newCours = new Cours({ titre, description, lien, auteur, auteurId, filiere, module, status: statutFinal });
        await newCours.save();
        res.status(201).json({ message: "Ressource soumise avec succès." });
    } catch (error) {
        console.error("ERREUR LORS DU PARTAGE DU COURS :", error); 
        res.status(500).json({ message: "Erreur du serveur lors du partage du cours." });
    }
});

// === ROUTE GET PUBLIQUE (NE RENVOIE QUE LES COURS APPROUVÉS) ===
router.get('/', async (req, res) => {
    try {
        const cours = await Cours.find({ status: 'approuvé' }).sort({ createdAt: -1 });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === NOUVELLE ROUTE : OBTENIR LES COURS EN ATTENTE (POUR LES MODÉRATEURS) ===
router.get('/en-attente', async (req, res) => {
    try {
        const coursEnAttente = await Cours.find({ status: 'en attente' }).sort({ createdAt: -1 });
        res.status(200).json(coursEnAttente);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === NOUVELLE ROUTE : APPROUVER UN COURS ===
router.patch('/:id/approuver', async (req, res) => {
    try {
        const { id } = req.params;
        const cours = await Cours.findByIdAndUpdate(id, { status: 'approuvé' }, { new: true });
        if (!cours) return res.status(404).json({ message: "Cours non trouvé." });
        res.status(200).json({ message: "Cours approuvé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === ROUTE DE SUPPRESSION (REJET) ===
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userRole } = req.body;
        const cours = await Cours.findById(id);
        if (!cours) return res.status(404).json({ message: "Cours non trouvé." });

        // Un admin ou l'auteur original peuvent supprimer/rejeter
        if (userRole !== 'admin' && cours.auteurId !== userId) {
            return res.status(403).json({ message: "Accès refusé." });
        }
        await Cours.findByIdAndDelete(id);
        res.status(200).json({ message: "Ressource supprimée/rejetée avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

module.exports = router;