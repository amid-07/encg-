// ===================================================================
// FICHIER COMPLET : frontend/admin/js/admin.js
// ===================================================================

const path = window.location.pathname;

if (path.includes('connexion.html')) {
    document.getElementById('admin-login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        // Dans un vrai projet, la connexion renverrait le rôle de l'utilisateur
        // que l'on sauvegarderait. Pour ce test, on va le "tricher".
        localStorage.setItem('userRole', 'prof'); // On simule un prof connecté
        console.log("Connexion simulée. Redirection vers le tableau de bord.");
        window.location.href = 'tableau-de-bord.html';
    });

} else if (path.includes('tableau-de-bord.html')) {
    const form = document.getElementById('create-annonce-form');
    const messageElement = document.getElementById('form-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // On récupère le rôle simulé qu'on a sauvegardé
        const userRole = localStorage.getItem('userRole') || 'admin';

        const annonce = {
            titre: document.getElementById('titre').value,
            contenu: document.getElementById('contenu').value,
            filiere: document.getElementById('filiere').value,
            groupe: document.getElementById('groupe').value,
            roleDemandeur: userRole // On envoie le rôle pour la vérification de sécurité
        };

        try {
            const response = await fetch('http://localhost:3000/api/annonces/creer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(annonce)
            });

            const result = await response.json();
            if (response.ok) {
                messageElement.textContent = 'Annonce publiée avec succès !';
                messageElement.style.color = 'green';
                form.reset();
            } else {
                messageElement.textContent = `Erreur: ${result.message}`;
                messageElement.style.color = 'red';
            }
        } catch (err) {
            messageElement.textContent = 'Erreur de connexion au serveur.';
            messageElement.style.color = 'red';
        }
    });
}