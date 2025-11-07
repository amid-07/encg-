// ===================================================================
// FICHIER COMPLET FINAL : frontend/js/auth.js
// ===================================================================

// ----------- PARTIE 1 : GESTION DE L'INSCRIPTION -----------
const inscriptionForm = document.getElementById('inscription-form');

if (inscriptionForm) {
    const roleSelector = document.getElementById('role');
    const champsEtudiant = document.getElementById('champs-etudiant');
    const champCodeSecret = document.getElementById('champ-code-secret');
    
    roleSelector.addEventListener('change', function() {
        if (this.value === 'etudiant') {
            champsEtudiant.style.display = 'block';
            champCodeSecret.style.display = 'none';
        } else {
            champsEtudiant.style.display = 'none';
            champCodeSecret.style.display = 'block';
        }
    });

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

    inscriptionForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const messageElement = document.getElementById('message');
        messageElement.textContent = "Inscription en cours...";
        messageElement.style.color = 'blue';

        const role = roleSelector.value;
        const nom = document.getElementById('nom').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        let utilisateurData = { role, nom, email, password };

        if (role === 'etudiant') {
            utilisateurData.section = document.getElementById('section').value;
            utilisateurData.filiere = document.getElementById('filiere').value;
            utilisateurData.groupe = document.getElementById('groupe').value;
            if (!utilisateurData.section || !utilisateurData.filiere || !utilisateurData.groupe) {
                messageElement.textContent = "Erreur : Veuillez remplir tous les champs.";
                messageElement.style.color = 'red';
                return;
            }
        } else {
            utilisateurData.codeInscription = document.getElementById('code-inscription').value;
        }

        try {
            const response = await fetch('/api/utilisateurs/inscription', { // URL relative
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(utilisateurData),
            });
            const result = await response.json();
            if (response.ok) {
                messageElement.textContent = "Inscription réussie ! Vous pouvez vous connecter.";
                messageElement.style.color = 'green';
                inscriptionForm.reset();
                champsEtudiant.style.display = 'block';
                champCodeSecret.style.display = 'none';
                groupeSelect.disabled = true;
                groupeSelect.innerHTML = '<option value="">D\'abord choisir une filière...</option>';
            } else {
                messageElement.textContent = `Erreur: ${result.message}`;
                messageElement.style.color = 'red';
            }
        } catch (error) {
            messageElement.textContent = "Erreur de connexion au serveur.";
            messageElement.style.color = 'red';
        }
    });
}

// ----------- PARTIE 2 : GESTION DE LA CONNEXION -----------
const connexionForm = document.getElementById('connexion-form');
if (connexionForm) {
    connexionForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch('/api/utilisateurs/connexion', { // URL relative
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
                messageElement.style.color = 'green';
                setTimeout(() => { window.location.href = 'journal.html'; }, 1000);
            } else {
                messageElement.textContent = `Erreur: ${result.message}`;
                messageElement.style.color = 'red';
            }
        } catch (error) {
            messageElement.textContent = "Erreur de connexion au serveur.";
            messageElement.style.color = 'red';
        }
    });
}