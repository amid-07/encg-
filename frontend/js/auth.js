// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/auth.js
// ===================================================================

// ----------- PARTIE 1 : GESTION DE L'INSCRIPTION -----------
const inscriptionForm = document.getElementById('inscription-form');

if (inscriptionForm) {
    const roleSelector = document.getElementById('role');
    const champsEtudiant = document.getElementById('champs-etudiant');
    const champCodeSecret = document.getElementById('champ-code-secret');
    
    // Logique pour afficher/cacher les champs en fonction du rôle
    roleSelector.addEventListener('change', function() {
        if (this.value === 'etudiant') {
            champsEtudiant.style.display = 'block';
            champCodeSecret.style.display = 'none';
        } else {
            champsEtudiant.style.display = 'none';
            champCodeSecret.style.display = 'block';
        }
    });

    // Logique pour les groupes dynamiques en fonction de la filière
    const filiereSelect = document.getElementById('filiere');
    const groupeSelect = document.getElementById('groupe');

    const groupesParFiliere = {
        'Gestion': ['GA', 'GB', 'GC', 'GD'],
        'Commerce': ['GA', 'GB']
    };

    filiereSelect.addEventListener('change', function() {
        const filiereChoisie = this.value;
        groupeSelect.innerHTML = '<option value="" disabled selected>Choisir un groupe...</option>';

        if (filiereChoisie && groupesParFiliere[filiereChoisie]) {
            groupeSelect.disabled = false;
            groupesParFiliere[filiereChoisie].forEach(groupe => {
                const option = document.createElement('option');
                option.value = groupe;
                option.textContent = groupe;
                groupeSelect.appendChild(option);
            });
        } else {
            groupeSelect.disabled = true;
        }
    });

    // Logique de soumission du formulaire d'inscription
    inscriptionForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Empêche le rechargement

        const messageElement = document.getElementById('message');
        messageElement.textContent = "Inscription en cours..."; // Message d'attente
        messageElement.className = 'text-primary';

        // 1. Récupérer les données communes
        const role = roleSelector.value;
        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let utilisateurData = { role, nom, email, password };

        // 2. Ajouter les données spécifiques au rôle
        if (role === 'etudiant') {
            utilisateurData.section = document.getElementById('section').value;
            utilisateurData.filiere = document.getElementById('filiere').value;
            utilisateurData.groupe = document.getElementById('groupe').value;

            // Validation simple pour les étudiants
            if (!utilisateurData.section || !utilisateurData.filiere || !utilisateurData.groupe) {
                messageElement.textContent = "Erreur : Veuillez remplir tous les champs (section, filière, groupe).";
                messageElement.className = 'text-danger';
                return;
            }
        } else {
            utilisateurData.codeInscription = document.getElementById('code-inscription').value;
        }

        // 3. Envoyer les données au serveur
        try {
            const response = await fetch('http://localhost:3000/api/utilisateurs/inscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(utilisateurData),
            });
            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
                messageElement.className = 'text-success';
                inscriptionForm.reset();
                // Réinitialiser l'état des selects
                champsEtudiant.style.display = 'block';
                champCodeSecret.style.display = 'none';
                groupeSelect.disabled = true;
                groupeSelect.innerHTML = '<option value="">D\'abord choisir une filière...</option>';
            } else {
                messageElement.textContent = `Erreur: ${result.message}`;
                messageElement.className = 'text-danger';
            }
        } catch (error) {
            messageElement.textContent = "Erreur de connexion au serveur. Veuillez vérifier qu'il est bien démarré.";
            messageElement.className = 'text-danger';
        }
    });
}

// ----------- PARTIE 2 : GESTION DE LA CONNEXION (INCHANGÉE) -----------
const connexionForm = document.getElementById('connexion-form');
if (connexionForm) {
    connexionForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('http://localhost:3000/api/utilisateurs/connexion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('userId', result.utilisateur.id);
                localStorage.setItem('userName', result.utilisateur.nom);
                localStorage.setItem('userRole', result.utilisateur.role);
                
                messageElement.textContent = "Connexion réussie ! Redirection...";
                messageElement.className = 'text-success';
                
                setTimeout(() => { window.location.href = 'journal.html'; }, 1000);
            } else {
                messageElement.textContent = `Erreur: ${result.message}`;
                messageElement.className = 'text-danger';
            }
        } catch (error) {
            messageElement.textContent = "Erreur de connexion au serveur.";
            messageElement.className = 'text-danger';
        }
    });
}