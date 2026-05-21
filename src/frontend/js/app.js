document.addEventListener('DOMContentLoaded', () => {
    chargerMaillots();
    mettreAJourCompteurPanier(); 
});

async function chargerMaillots() {
    try {
        const reponse = await fetch('http://localhost:3000/api/maillots');
        
        if (!reponse.ok) {
            throw new Error("Erreur serveur ou backend éteint");
        }
        
        const maillots = await reponse.json();
        afficherMaillots(maillots);
    } catch (erreur) {
        console.error("Erreur lors du chargement des maillots :", erreur);
        document.getElementById('catalogue').innerHTML = "<p>Impossible de charger le catalogue. Vérifiez que le serveur Node.js est bien allumé dans le terminal.</p>";
    }
}
