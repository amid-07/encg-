window.addEventListener('load', async () => {
    // --- 1. Gestion de l'utilisateur ---
    const userName = localStorage.getItem('userName');
    if (!userName) { window.location.href = 'connexion.html'; return; }

    // La navbar est maintenant standard, plus besoin de gérer 'user-info' ici.
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // --- 2. Charger et afficher le classement ---
    const tableBody = document.getElementById('classement-body');
    try {
        const response = await fetch('/api/utilisateurs/classement'); // Correction de l'URL de l'API
        const classement = await response.json();
        tableBody.innerHTML = ''; // Vider le placeholder

        if (classement.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">Aucune contribution n\'a encore été enregistrée.</td></tr>';
            return;
        }

        classement.forEach((etudiant, index) => {
            const tableRow = document.createElement('tr');
            
            // Style pour le top 3
            if (index === 0) tableRow.classList.add('table-primary');
            if (index === 1) tableRow.classList.add('table-secondary');
            if (index === 2) tableRow.classList.add('table-info');

            tableRow.innerHTML = `
                <th scope="row" class="text-center">${index + 1}</th>
                <td>${etudiant.nom}</td>
                <td class="text-center">${etudiant.contributions}</td>
            `;
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error("Erreur de chargement du classement:", error);
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger py-4">Erreur lors du chargement du classement.</td></tr>';
    }
});