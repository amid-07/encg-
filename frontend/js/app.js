// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/app.js
// ===================================================================

window.addEventListener('load', async function() {
    // --- 1. Gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    if (!userId || !userName || !userRole) {
        window.location.href = 'connexion.html';
        return;
    }

    document.getElementById('user-info').textContent = `Connecté en tant que: ${userName}`;
    document.getElementById('logout-btn-journal').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // --- 2. Charger et afficher les annonces ---
    const container = document.getElementById('annonces-container');
    try {
        const response = await fetch('http://localhost:3000/api/annonces');
        const annonces = await response.json();
        container.innerHTML = '';

        if (annonces.length === 0) {
            container.innerHTML = '<p>Aucune annonce pour le moment.</p>';
            return;
        }

        annonces.forEach(annonce => {
            const annonceCard = document.createElement('div');
            annonceCard.className = 'card shadow-sm mb-4';
            annonceCard.setAttribute('data-annonce-id', annonce._id);

            let deleteButtonHTML = '';
            if (userRole === 'admin' || userId === annonce.auteurId) {
                deleteButtonHTML = `<button class="btn btn-danger btn-sm float-end" data-id="${annonce._id}">Supprimer</button>`;
            }

            const cible = `Section ${annonce.section || 'tous'} - ${annonce.filiere || 'tous'} - Groupe ${annonce.groupe || 'tous'}`;
            const date = new Date(annonce.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

            annonceCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${annonce.titre}</h5>
                    <p class="card-text">${annonce.contenu}</p>
                    <p class="card-text"><small class="text-muted">Publié par: ${annonce.auteur || 'Auteur inconnu'} | ${date}</small></p>
                    <p class="card-text"><small class="text-muted">Cible: ${cible}</small></p>
                    ${deleteButtonHTML}
                </div>
            `;
            container.appendChild(annonceCard);
        });
    } catch (error) {
        container.innerHTML = '<p>Impossible de charger les annonces. Erreur du serveur.</p>';
    }

    // --- 3. Gérer les clics sur les boutons Supprimer ---
    container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-danger')) {
            const annonceId = event.target.getAttribute('data-id');
            if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
                try {
                    const response = await fetch(`http://localhost:3000/api/annonces/${annonceId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: userId, userRole: userRole })
                    });
                    if (response.ok) {
                        document.querySelector(`[data-annonce-id="${annonceId}"]`).remove();
                    } else {
                        alert("Erreur : vous n'avez pas la permission de supprimer cette annonce.");
                    }
                } catch (err) {
                    alert("Erreur de connexion avec le serveur.");
                }
            }
        }
    });
});