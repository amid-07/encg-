window.addEventListener('load', async () => {
    // --- 1. Sécurité et gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const rolesModerateurs = ['prof', 'delegue', 'admin'];
    
    if (!userRole || !rolesModerateurs.includes(userRole)) {
        window.location.href = 'profil.html';
        return;
    }
    document.getElementById('welcome-message').textContent = `Connecté: ${userName}`;
    document.getElementById('logout-btn').addEventListener('click', (e) => { e.preventDefault(); localStorage.clear(); window.location.href = 'index.html'; });

    // --- 2. Charger les cours en attente ---
    const container = document.getElementById('pending-cours-container');
    try {
        const response = await fetch('/api/cours/en-attente');
        const coursEnAttente = await response.json();
        container.innerHTML = '';
        if (coursEnAttente.length === 0) {
            container.innerHTML = "<div class='col-12'><p class='text-center text-muted'>Aucune ressource n'est en attente d'approbation.</p></div>";
            return;
        }

        coursEnAttente.forEach(cours => {
            const coursCol = document.createElement('div');
            coursCol.className = 'col-md-6'; // Crée une colonne pour la grille
            coursCol.setAttribute('data-cours-id', cours._id);

            coursCol.innerHTML = `
                <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">${cours.titre}</h5>
                        <span class="badge bg-primary">${cours.module}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${cours.description || 'Pas de description.'}</p>
                        <p class="card-text"><small class="text-muted">Soumis par: ${cours.auteur} | Pour: ${cours.filiere}</small></p>
                        <a href="${cours.lien}" class="btn btn-outline-secondary btn-sm" target="_blank">Vérifier le lien</a>
                    </div>
                    <div class="card-footer text-end">
                        <button class="btn btn-success btn-sm btn-approve" data-id="${cours._id}">Approuver</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${cours._id}">Rejeter</button>
                    </div>
                </div>
            `;
            container.appendChild(coursCol);
        });
    } catch (error) {
        container.innerHTML = "<div class='col-12'><p class='text-center text-danger'>Erreur lors du chargement des ressources.</p></div>";
    }

    // --- 3. Gérer les actions d'approbation et de rejet ---
    container.addEventListener('click', async (event) => {
        const target = event.target;
        const coursId = target.getAttribute('data-id');
        if (!coursId) return;

        const cardElement = document.querySelector(`[data-cours-id="${coursId}"]`);

        if (target.classList.contains('btn-approve')) {
            try {
                const response = await fetch(`/api/cours/${coursId}/approuver`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userRole })
                });
                if (response.ok) {
                    cardElement.remove();
                } else { alert("Erreur lors de l'approbation."); }
            } catch (err) { alert("Erreur de connexion."); }
        }

        if (target.classList.contains('btn-delete')) {
            if (confirm("Voulez-vous vraiment rejeter et supprimer cette ressource ?")) {
                try {
                    const response = await fetch(`/api/cours/${coursId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, userRole })
                    });
                    if (response.ok) {
                        cardElement.remove();
                    } else { alert("Erreur lors du rejet."); }
                } catch (err) { alert("Erreur de connexion."); }
            }
        }
    });
});