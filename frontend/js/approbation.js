// ===================================================================
// FICHIER COMPLET : frontend/js/approbation.js
// ===================================================================
window.addEventListener('load', async () => {
    // --- 1. Sécurité et gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const rolesModerateurs = ['prof', 'delegue', 'admin'];
    
    // Si l'utilisateur n'est pas un modérateur, on le renvoie
    if (!userRole || !rolesModerateurs.includes(userRole)) {
        window.location.href = 'profil.html';
        return;
    }
    document.getElementById('welcome-message').textContent = `Bienvenue, ${userName}`;
    document.getElementById('logout-btn').addEventListener('click', (e) => { e.preventDefault(); localStorage.clear(); window.location.href = 'index.html'; });

    // --- 2. Charger les cours en attente ---
    const container = document.getElementById('pending-cours-container');
    try {
        const response = await fetch('/api/cours/en-attente');
        const coursEnAttente = await response.json();
        container.innerHTML = '';
        if (coursEnAttente.length === 0) {
            container.innerHTML = "<p>Aucune ressource n'est en attente d'approbation.</p>";
            return;
        }

        coursEnAttente.forEach(cours => {
            const coursDiv = document.createElement('div');
            coursDiv.className = 'annonce';
            coursDiv.setAttribute('data-cours-id', cours._id);
            coursDiv.innerHTML = `
                <h3>${cours.titre} <span class="module-tag">${cours.module}</span></h3>
                <p>${cours.description || 'Pas de description.'}</p>
                <a href="${cours.lien}" target="_blank">Vérifier le lien</a>
                <p><small>Soumis par: ${cours.auteur} | Pour: ${cours.filiere}</small></p>
                <div class="approval-actions" style="margin-top: 1rem;">
                    <button class="btn btn-approve" data-id="${cours._id}">Approuver</button>
                    <button class="btn-delete" data-id="${cours._id}">Rejeter</button>
                </div>
            `;
            container.appendChild(coursDiv);
        });
    } catch (error) {
        container.innerHTML = "<p>Erreur lors du chargement des ressources.</p>";
    }

    // --- 3. Gérer les actions d'approbation et de rejet ---
    container.addEventListener('click', async (event) => {
        const target = event.target;
        const coursId = target.getAttribute('data-id');
        if (!coursId) return;

        // Si on clique sur "Approuver"
        if (target.classList.contains('btn-approve')) {
            try {
                const response = await fetch(`/api/cours/${coursId}/approuver`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userRole }) // Pour la sécurité future
                });
                if (response.ok) {
                    document.querySelector(`[data-cours-id="${coursId}"]`).remove();
                } else { alert("Erreur lors de l'approbation."); }
            } catch (err) { alert("Erreur de connexion."); }
        }

        // Si on clique sur "Rejeter" (supprimer)
        if (target.classList.contains('btn-delete')) {
            if (confirm("Voulez-vous vraiment rejeter et supprimer cette ressource ?")) {
                try {
                    const response = await fetch(`/api/cours/${coursId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, userRole })
                    });
                    if (response.ok) {
                        document.querySelector(`[data-cours-id="${coursId}"]`).remove();
                    } else { alert("Erreur lors du rejet."); }
                } catch (err) { alert("Erreur de connexion."); }
            }
        }
    });
});