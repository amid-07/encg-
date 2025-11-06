// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/profil.js
// ===================================================================

window.addEventListener('load', () => {
    // --- 1. Gestion de l'utilisateur ---
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (!userId || !userName || !userRole) { window.location.href = 'connexion.html'; return; }
    document.getElementById('welcome-message').textContent = `Bienvenue, ${userName} (${userRole})`;

    // --- 2. Affichage conditionnel des sections ---
    const creationAnnonceSection = document.getElementById('creation-annonce-section');
    const creationCoursSection = document.getElementById('creation-cours-section');
    const rolesAutorises = ['prof', 'delegue', 'admin'];
    if (rolesAutorises.includes(userRole)) {
        creationAnnonceSection.style.display = 'block';
        creationCoursSection.style.display = 'block';
    }

    // --- 3. Logique des groupes dynamiques pour le formulaire d'annonces ---
    const filiereAnnonceSelect = document.getElementById('filiere-annonce');
    const groupeAnnonceSelect = document.getElementById('groupe-annonce');
    const groupesParFiliere = {
        'Gestion': ['GA', 'GB', 'GC', 'GD'],
        'Commerce': ['GA', 'GB']
    };

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

    // --- 4. Gérer le formulaire d'ANNONCES ---
    const annonceForm = document.getElementById('create-annonce-form');
    if (annonceForm) {
        annonceForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const messageElement = document.getElementById('form-annonce-message');
            const annonceData = {
                titre: document.getElementById('titre-annonce').value,
                contenu: document.getElementById('contenu-annonce').value,
                section: document.getElementById('section-annonce').value,
                filiere: document.getElementById('filiere-annonce').value,
                groupe: document.getElementById('groupe-annonce').value,
                auteur: userName,
                auteurId: userId,
                roleDemandeur: userRole
            };
            try {
                const response = await fetch('http://localhost:3000/api/annonces/creer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(annonceData)
                });
                const result = await response.json();
                if (response.ok) {
                    messageElement.textContent = 'Annonce publiée ! Redirection...';
                    messageElement.className = 'text-success';
                    setTimeout(() => { window.location.href = 'journal.html'; }, 2000);
                } else {
                    messageElement.textContent = `Erreur: ${result.message}`;
                    messageElement.className = 'text-danger';
                }
            } catch (err) {
                messageElement.textContent = 'Erreur de connexion au serveur.';
                messageElement.className = 'text-danger';
            }
        });
    }

    // --- 5. Gérer le formulaire de COURS ---
    const coursForm = document.getElementById('create-cours-form');
    if (coursForm) {
        coursForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const messageElement = document.getElementById('form-cours-message');
            const coursData = {
                titre: document.getElementById('titre-cours').value,
                module: document.getElementById('module-cours').value,
                description: document.getElementById('description-cours').value,
                lien: document.getElementById('lien-cours').value,
                filiere: document.getElementById('filiere-cours').value,
                auteur: userName,
                auteurId: userId,
                roleDemandeur: userRole
            };
            try {
                const response = await fetch('http://localhost:3000/api/cours/creer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(coursData)
                });
                const result = await response.json();
                if (response.ok) {
                    messageElement.textContent = 'Cours partagé ! Redirection...';
                    messageElement.className = 'text-success';
                    setTimeout(() => { window.location.href = 'cours.html'; }, 2000);
                } else {
                    messageElement.textContent = `Erreur: ${result.message}`;
                    messageElement.className = 'text-danger';
                }
            } catch (err) {
                messageElement.textContent = 'Erreur de connexion au serveur.';
                messageElement.className = 'text-danger';
            }
        });
    }

    // --- 6. Gérer la déconnexion ---
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });
});