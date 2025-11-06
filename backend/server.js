// ===================================================================
// FICHIER COMPLET FINAL : backend/server.js (Prêt pour Vercel)
// ===================================================================

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Création de l'application Express
const app = express();

// --- Configuration de la Connexion à MongoDB ---
// Pour le déploiement, la chaîne de connexion est stockée dans les variables d'environnement de Vercel.
// En local, on pourrait utiliser un fichier .env, mais pour ce projet, on la met directement.
// Assurez-vous que la variable MONGO_URI est bien définie dans les settings de votre projet Vercel.
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://journaladmin:SXIl29kJI1bzFNqz@cluster0.lbdukhx.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// --- Middlewares ---
// Autorise les requêtes depuis d'autres origines (votre frontend sur Vercel)
app.use(cors()); 
// Permet à Express de comprendre le format JSON dans le corps des requêtes
app.use(express.json());

// --- Routes de l'API ---
// Importation des fichiers de routes
const userRoutes = require('./routes/utilisateurs');
const annonceRoutes = require('./routes/annonces');
const coursRoutes = require('./routes/cours');

// Attribution des routes à leurs chemins de base
// Toute requête vers /api/utilisateurs/* sera gérée par userRoutes
app.use('/api/utilisateurs', userRoutes);
// Toute requête vers /api/annonces/* sera gérée par annonceRoutes
app.use('/api/annonces', annonceRoutes);
// Toute requête vers /api/cours/* sera gérée par coursRoutes
app.use('/api/cours', coursRoutes);

// Route de test pour vérifier que le serveur fonctionne
app.get('/api', (req, res) => {
  res.send('API du Journal Scolaire est en ligne !');
});


// --- Démarrage du Serveur ---
// La section app.listen() est retirée car Vercel gère le démarrage du serveur pour nous.
// En environnement local (si vous n'utilisez pas l'outil `vercel dev`), vous pouvez décommenter ces lignes.
/*
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré pour le développement local sur http://localhost:${PORT}`);
});
*/

// --- Exportation de l'application ---
// C'est cette ligne qui permet à Vercel de prendre le contrôle de votre application Express.
module.exports = app;