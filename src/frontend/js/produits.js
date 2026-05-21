document.addEventListener('DOMContentLoaded', () => {
    const parametresUrl = new URLSearchParams(window.location.search);
    const idMaillot = parametresUrl.get('id');

    if (idMaillot) {
        chargerDetailMaillot(idMaillot);
    } else {
        document.getElementById('detail-produit').innerHTML = "<p>Aucun maillot sélectionné.</p>";
    }
});

async function chargerDetailMaillot(id) {
    try {
        const reponse = await fetch(`http://localhost:3000/api/maillots/${id}`);
        
        if (!reponse.ok) {
            throw new Error("Maillot introuvable");
        }

        const maillot = await reponse.json();
        afficherDetail(maillot);

    } catch (erreur) {
        console.error("Erreur :", erreur);
        document.getElementById('detail-produit').innerHTML = "<p>Impossible de charger ce maillot.</p>";
    }
}

function afficherDetail(maillot) {
    const conteneur = document.getElementById('detail-produit');
    
    conteneur.innerHTML = `
        <div style="display: flex; gap: 40px; flex-wrap: wrap; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="flex: 1; min-width: 300px; text-align: center;">
                <img src="${maillot.images && maillot.images.length > 0 ? maillot.images[0] : './assets/img/default.png'}" alt="Maillot ${maillot.nom}" style="max-width: 100%; border-radius: 10px;">
            </div>

            <div style="flex: 1; min-width: 300px;">
                <h2 style="margin-bottom: 10px; font-size: 2rem;">${maillot.nom}</h2>
                <p style="font-size: 1.5rem; color: #00a8ff; font-weight: bold; margin-bottom: 20px;">${maillot.prix} ${maillot.devise}</p>
                
                <h4 style="margin-bottom: 5px;">Description :</h4>
                <p style="margin-bottom: 20px; line-height: 1.5; color: #555;">${maillot.description || "Aucune description disponible pour ce modèle."}</p>
                
                <p style="margin-bottom: 20px;"><strong>Équipe :</strong> ${maillot.equipe}</p>
                <p style="margin-bottom: 20px;"><strong>Saison :</strong> ${maillot.saison}</p>
                
                <p style="margin-bottom: 20px; color: ${maillot.quantite_stock > 0 ? 'green' : 'red'};">
                    ${maillot.quantite_stock > 0 ? `En stock : ${maillot.quantite_stock} unités` : "Rupture de stock"}
                </p>

                <button onclick="ajouterAuPanierDepuisDetail('${maillot.id}')" style="background-color: #1a1a1a; color: white; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; font-size: 1.1rem; width: 100%;">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `;
}

