// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/cours.js
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
    document.getElementById('logout-btn-cours').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // --- 2. Charger et afficher les cours ---
    const container = document.getElementById('cours-container');
    try {
        const response = await fetch('http://localhost:3000/api/cours');
        const coursList = await response.json();
        container.innerHTML = '';

        if (coursList.length === 0) {
            container.innerHTML = '<p>Aucune ressource partagée pour le moment.</p>';
            return;
        }

        coursList.forEach(cours => {
            const coursCard = document.createElement('div');
            coursCard.className = 'card shadow-sm mb-4';
            coursCard.setAttribute('data-cours-id', cours._id);

            let deleteButtonHTML = '';
            if (userRole === 'admin' || userId === cours.auteurId) {
                deleteButtonHTML = `<button class="btn btn-danger btn-sm float-end" data-id="${cours._id}">Supprimer</button>`;
            }

            const date = new Date(cours.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

            coursCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${cours.titre} <span class="badge bg-primary">${cours.module || 'N/A'}</span></h5>
                    <p class="card-text">${cours.description || 'Pas de description.'}</p>
                    <a href="${cours.lien}" target="_blank" class="btn btn-primary">Accéder à la ressource</a>
                    <p class="card-text mt-2"><small class="text-muted">Partagé par: ${cours.auteur} | Pour la filière: ${cours.filiere} | ${date}</small></p>
                    ${deleteButtonHTML}
                </div>
            `;
            container.appendChild(coursCard);
        });

    } catch (error) {
        container.innerHTML = '<p>Impossible de charger les ressources.</p>';
    }

    // --- 3. Gérer les clics sur les boutons Supprimer ---
    container.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-danger')) {
            const coursId = event.target.getAttribute('data-id');
            if (confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
                try {
                    const response = await fetch(`http://localhost:3000/api/cours/${coursId}`, {
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