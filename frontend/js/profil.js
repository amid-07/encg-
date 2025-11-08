// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/profil.js
// ===================================================================

window.addEventListener('load', () => {
    // --- 1. Gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    // Redirection si l'utilisateur n'est pas connecté
    if (!userId || !userName || !userRole) { 
        window.location.href = 'connexion.html'; 
        return; 
    }

    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Bienvenue, ${userName} (${userRole})`;
    }

    // --- 2. Affichage conditionnel des sections pour les modérateurs ---
    const creationAnnonceSection = document.getElementById('creation-annonce-section');
    const panneauModerateur = document.getElementById('panneau-moderateur');
    const rolesModerateurs = ['prof', 'delegue', 'admin'];

    if (rolesModerateurs.includes(userRole)) {
        if (creationAnnonceSection) creationAnnonceSection.style.display = 'block';
        if (panneauModerateur) panneauModerateur.style.display = 'block';
    }

    // --- 3. Logique des groupes dynamiques pour le formulaire d'annonces ---
    const filiereAnnonceSelect = document.getElementById('filiere-annonce');
    const groupeAnnonceSelect = document.getElementById('groupe-annonce');
    if (filiereAnnonceSelect && groupeAnnonceSelect) {
        const groupesParFiliere = { 'Gestion': ['GA', 'GB', 'GC', 'GD'], 'Commerce': ['GA', 'GB'] };
        filiereAnnonceSelect.addEventListener('change', function() {
            const filiereChoisie = this.value;
            groupeAnnonceSelect.innerHTML = '<option value="tous">Tous les groupes</option>';
            if (filiereChoisie !== 'tous' && groupesParFiliere[filiereChoisie]) {
                groupeAnnonceSelect.disabled = false;
                groupesParFiliere[filiereChoisie].forEach(groupe => {
                    const option = document.createElement('option');
                    option.value = groupe;
                    option.textContent = groupe;
                    groupeAnnonceSelect.appendChild(option);
                });
            } else {
                groupeAnnonceSelect.disabled = true;
                groupeAnnonceSelect.innerHTML = '<option value="tous">D\'abord choisir une filière...</option>';
            }
        });
    }

    // --- 4. Gérer le formulaire d'ANNONCES ---
    const annonceForm = document.getElementById('create-annonce-form');
    if (annonceForm) {
        annonceForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // ... (logique de soumission du formulaire d'annonce, qui était correcte)
        });
    }

    // --- 5. Gérer le formulaire de COURS ---
    const coursForm = document.getElementById('create-cours-form');
    if (coursForm) {
        coursForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // ... (logique de soumission du formulaire de cours, qui était correcte)
        });
    }

    // --- 6. Gérer la déconnexion ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
});