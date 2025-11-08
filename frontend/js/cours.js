// ===================================================================
// FICHIER COMPLET FINAL : backend/routes/cours.js
// ===================================================================

const express = require('express');
const router = express.Router();
const Cours = require('../models/Cours');

// === ROUTE DE CRÉATION (AVEC LOGIQUE DE STATUT) ===
router.post('/creer', async (req, res) => {
    // 1. On récupère toutes les données envoyées par le frontend
    const { titre, description, lien, auteur, auteurId, filiere, module, roleDemandeur } = req.body;
    
    // 2. On valide que les champs essentiels sont présents
    if (!titre || !lien || !auteur || !auteurId || !filiere || !module || !roleDemandeur) {
        return res.status(400).json({ message: "Erreur : Des données essentielles sont manquantes." });
    }

    // 3. On définit le statut en fonction du rôle
    let statutFinal = 'en attente';
    if (['prof', 'delegue', 'admin'].includes(roleDemandeur)) {
        statutFinal = 'approuvé';
    }
    
    try {
        // 4. On crée l'objet à sauvegarder avec TOUS les champs requis
        const newCours = new Cours({ 
            titre, 
            description, 
            lien, 
            auteur, 
            auteurId, 
            filiere, 
            module, 
            status: statutFinal 
        });

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
        console.error("ERREUR RÉCUPÉRATION COURS APPROUVÉS :", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === ROUTE : OBTENIR LES COURS EN ATTENTE (POUR LES MODÉRATEURS) ===
router.get('/en-attente', async (req, res) => {
    try {
        const coursEnAttente = await Cours.find({ status: 'en attente' }).sort({ createdAt: -1 });
        res.status(200).json(coursEnAttente);
    } catch (error) {
        console.error("ERREUR RÉCUPÉRATION COURS EN ATTENTE :", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// === ROUTE : APPROUVER UN COURS ===
router.patch('/:id/approuver', async (req, res) => {
    try {
        const { id } = req.params;
        const cours = await Cours.findByIdAndUpdate(id, { status: 'approuvé' }, { new: true });
        if (!cours) return res.status(404).json({ message: "Cours non trouvé." });
        res.status(200).json({ message: "Cours approuvé avec succès." });
    } catch (error) {
        console.error("ERREUR APPROBATION COURS :", error);
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

        // Un admin, un prof, un délégué, ou l'auteur original peuvent supprimer/rejeter
        if (!['admin', 'prof', 'delegue'].includes(userRole) && cours.auteurId !== userId) {
            return res.status(403).json({ message: "Accès refusé. Permissions insuffisantes." });
        }
        await Cours.findByIdAndDelete(id);
        res.status(200).json({ message: "Ressource supprimée/rejetée avec succès." });
    } catch (error) {
        console.error("ERREUR SUPPRESSION COURS :", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

module.exports = router;