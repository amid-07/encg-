// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/app.js
// ===================================================================

window.addEventListener('load', async function() {
    // --- 1. Gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (!userId || !userName || !userRole) { window.location.href = 'connexion.html'; return; }

    document.getElementById('user-info').textContent = `Connecté en tant que: ${userName}`;
    document.getElementById('logout-btn-journal').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // --- 2. Charger et afficher les annonces ---
    const container = document.getElementById('annonces-container');
    try {
        const response = await fetch('/api/annonces'); // URL relative
        const annonces = await response.json();
        container.innerHTML = '';

        if (annonces.length === 0) {
            container.innerHTML = '<p>Aucune annonce pour le moment.</p>';
            return;
        }

        annonces.forEach(annonce => {
            const annonceDiv = document.createElement('div');
            annonceDiv.className = 'annonce';
            annonceDiv.setAttribute('data-annonce-id', annonce._id);
            
            let deleteButtonHTML = '';
            if (userRole === 'admin' || userId === annonce.auteurId) {
                deleteButtonHTML = `<button class="btn-delete" data-id="${annonce._id}">Supprimer</button>`;
            }

            const cible = `Pour: Section ${annonce.section || 'tous'} - ${annonce.filiere || 'tous'} - Groupe ${annonce.groupe || 'tous'}`;
            annonceDiv.innerHTML = `
                <div class="annonce-header">
                    <h3>${annonce.titre}</h3>
                    ${deleteButtonHTML}
                </div>
                <p>${annonce.contenu}</p>
                <p><small>Publié par: ${annonce.auteur || 'Auteur inconnu'} | ${cible}</small></p>
            `;
            container.appendChild(annonceDiv);
        });
    } catch (error) {
        container.innerHTML = '<p>Impossible de charger les annonces. Erreur du serveur.</p>';
    }

    // --- 3. Gérer les clics sur les boutons Supprimer ---
    container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-delete')) {
            const annonceId = event.target.getAttribute('data-id');
            if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
                try {
                    const response = await fetch(`/api/annonces/${annonceId}`, { // URL relative
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