// ===================================================================
// FICHIER COMPLET : backend/routes/classement.js
// ===================================================================

const express = require('express');
const router = express.Router();
const Cours = require('../models/Cours');

// === ROUTE GET /api/classement ===
// Renvoie le top 10 des contributeurs
router.get('/', async (req, res) => {
    try {
        const classement = await Cours.aggregate([
            // Étape 1 : Ne considérer que les cours qui ont été approuvés
            { $match: { status: 'approuvé' } },

            // Étape 2 : Regrouper les documents par auteur et compter ses publications
            { 
                $group: {
                    _id: "$auteurId", // Regrouper par l'ID unique de l'auteur
                    nom: { $first: "$auteur" }, // Garder le nom de l'auteur
                    publications: { $sum: 1 } // Compter 1 pour chaque document trouvé
                }
            },

            // Étape 3 : Trier les résultats par nombre de publications, en ordre décroissant
            { $sort: { publications: -1 } },

            // Étape 4 : Ne garder que le top 10
            { $limit: 10 },

            // Étape 5 : Mettre en forme le résultat final (optionnel mais propre)
            {
                $project: {
                    _id: 0, // Ne pas inclure l'ID dans le résultat final
                    nom: 1,
                    publications: 1
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