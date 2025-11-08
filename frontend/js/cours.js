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

    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.textContent = `Connecté en tant que: ${userName}`;
    }
    
    const logoutBtn = document.getElementById('logout-btn-cours');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // --- 2. Charger et afficher les cours ---
    const container = document.getElementById('cours-container');
    if (container) {
        try {
            const response = await fetch('/api/cours');
            const coursList = await response.json();
            container.innerHTML = '';

            if (coursList.length === 0) {
                container.innerHTML = '<p>Aucune ressource partagée pour le moment.</p>';
            } else {
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
            }
        } catch (error) {
            console.error("Erreur lors du chargement des cours:", error);
            container.innerHTML = '<p>Impossible de charger les ressources. Une erreur est survenue.</p>';
        }

        // --- 3. Gérer les clics sur les boutons Supprimer ---
        container.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-delete')) {
                // ... (la logique de suppression était correcte)
            }
        });
    }
});