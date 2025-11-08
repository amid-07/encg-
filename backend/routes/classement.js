// ===================================================================
// FICHIER COMPLET FINAL : backend/routes/classement.js
// ===================================================================

const express = require('express');
const router = express.Router();
const Cours = require('../models/Cours');

// === ROUTE GET /api/classement ===
// Renvoie le top 10 des contributeurs
router.get('/', async (req, res) => {
    try {
        const classement = await Cours.aggregate([
            // Étape 1 : Pré-filtrage pour ne garder que les documents valides
            { 
                $match: { 
                    status: 'approuvé', 
                    auteurId: { $exists: true, $ne: null }, // L'auteurId doit exister et ne pas être nul
                    auteur: { $exists: true, $ne: null }    // Le nom de l'auteur doit exister
                } 
            },

            // Étape 2 : Regrouper les documents par auteurId et compter ses publications
            { 
                $group: {
                    _id: "$auteurId", // Regrouper par l'ID unique de l'auteur
                    nom: { $first: "$auteur" }, // Garder la première occurrence du nom de l'auteur
                    publications: { $sum: 1 } // Compter 1 pour chaque document approuvé
                }
            },

            // Étape 3 : Trier les résultats par nombre de publications, en ordre décroissant
            { $sort: { publications: -1 } },

            // Étape 4 : Limiter les résultats au top 10
            { $limit: 10 },

            // Étape 5 : Mettre en forme le résultat final pour qu'il soit propre
            {
                $project: {
                    _id: 0, // Ne pas inclure l'ID de regroupement dans le résultat
                    nom: 1, // Inclure le nom
                    publications: 1 // Inclure le nombre de publications
                }
            }
        ]);

        res.status(200).json(classement);

    } catch (error) {
        console.error("ERREUR LORS DE LA GÉNÉRATION DU CLASSEMENT :", error);
        res.status(500).json({ message: "Erreur du serveur lors de la génération du classement." });
    }
});

module.exports = router;