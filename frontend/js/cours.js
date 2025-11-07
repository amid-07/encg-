// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/cours.js
// ===================================================================

window.addEventListener('load', async function() {
    // --- 1. Gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (!userId || !userName || !userRole) { window.location.href = 'connexion.html'; return; }

    document.getElementById('user-info').textContent = `Connecté en tant que: ${userName}`;
    document.getElementById('logout-btn-cours').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // --- 2. Charger et afficher les cours ---
    const container = document.getElementById('cours-container');
    try {
        const response = await fetch('/api/cours'); // URL relative
        const coursList = await response.json();
        container.innerHTML = '';

        if (coursList.length === 0) {
            container.innerHTML = '<p>Aucune ressource partagée pour le moment.</p>';
            return;
        }

        coursList.forEach(cours => {
            const coursDiv = document.createElement('div');
            coursDiv.className = 'annonce';
            coursDiv.setAttribute('data-cours-id', cours._id);

            let deleteButtonHTML = '';
            if (userRole === 'admin' || userId === cours.auteurId) {
                deleteButtonHTML = `<button class="btn-delete" data-id="${cours._id}">Supprimer</button>`;
            }

            coursDiv.innerHTML = `
                <div class="cours-header">
                    <h3>${cours.titre}</h3>
                    <div class="header-right-part">
                        <span class="module-tag">${cours.module || 'N/A'}</span>
                        ${deleteButtonHTML}
                    </div>
                </div>
                <p>${cours.description || 'Pas de description.'}</p>
                <a href="${cours.lien}" target="_blank" class="btn btn-secondary">Accéder à la ressource</a>
                <p style="margin-top: 10px;"><small>Partagé par: ${cours.auteur} | Pour la filière: ${cours.filiere}</small></p>
            `;
            container.appendChild(coursDiv);
        });

    } catch (error) {
        container.innerHTML = '<p>Impossible de charger les ressources.</p>';
    }

    // --- 3. Gérer les clics sur les boutons Supprimer ---
    container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-delete')) {
            const coursId = event.target.getAttribute('data-id');
            if (confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
                try {
                    const response = await fetch(`/api/cours/${coursId}`, { // URL relative
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: userId, userRole: userRole })
                    });
                    if (response.ok) {
                        document.querySelector(`[data-cours-id="${coursId}"]`).remove();
                    } else {
                        alert("Erreur : vous n'avez pas la permission de supprimer cette ressource.");
                    }
                } catch (err) {
                    alert("Erreur de connexion avec le serveur.");
                }
            }
        }
    });
});