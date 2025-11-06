// ===================================================================
// FICHIER COMPLET FINAL AVEC DÉBOGAGE : backend/routes/utilisateurs.js
// ===================================================================

const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur'); 

// === ROUTE 1 : INSCRIPTION D'UN UTILISATEUR ===
router.post('/inscription', async (req, res) => {
    // Étape 1 : Confirmer la réception de la requête
    console.log("1. Requête d'inscription reçue. Données :", req.body);

    const SECRET_CODE = 'engj@promo18';
    const { nom, email, password, section, filiere, groupe, role, codeInscription } = req.body;

    // Logique de sécurité pour les rôles élevés
    if (role === 'prof' || role === 'delegue') {
        if (!codeInscription || codeInscription !== SECRET_CODE) {
            console.log("-> Échec : Code secret invalide ou manquant.");
            return res.status(403).json({ message: "Code d'inscription invalide." });
        }
    }

    // Validation de base des champs
    if (!nom || !email || !password) {
        console.log("-> Échec : Champs nom, email ou mot de passe manquants.");
        return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    try {
        // Étape 2 : Vérifier si l'utilisateur existe déjà
        console.log("2. Vérification si l'utilisateur existe dans la base de données...");
        const userExists = await Utilisateur.findOne({ email: email });
        if (userExists) {
            console.log("-> Échec : L'email existe déjà.");
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }
        
        // Étape 3 : Préparer le nouvel objet utilisateur
        console.log("3. Création du nouvel objet utilisateur...");
        const newUser = new Utilisateur({ 
            nom, 
            email, 
            password, 
            section, 
            filiere, 
            groupe, 
            role 
        });
        
        // Étape 4 : Sauvegarder dans la base de données (étape critique)
        console.log("4. Tentative de sauvegarde dans la base de données...");
        await newUser.save();
        
        // Étape 5 : Confirmer le succès
        console.log("5. Inscription réussie ! Envoi de la réponse au client.");
        res.status(201).json({ message: "Utilisateur créé avec succès." });

    } catch (error) {
        // Si une erreur se produit (souvent à l'étape 4), elle sera affichée ici
        console.error("ERREUR FINALE LORS DE L'INSCRIPTION :", error); 
        res.status(500).json({ message: "Erreur du serveur lors de la création de l'utilisateur." });
    }
});

// === ROUTE 2 : CONNEXION D'UN UTILISATEUR ===
router.post('/connexion', async (req, res) => {
    const { email, password } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ email: email });

        if (!utilisateur || utilisateur.password !== password) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        console.log("Utilisateur connecté:", utilisateur.nom);
        
        // On renvoie un objet contenant les informations complètes de l'utilisateur
        res.status(200).json({ 
            message: "Connexion réussie",
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                role: utilisateur.role
            }
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur du serveur lors de la connexion." });
    }
});

module.exports = router;