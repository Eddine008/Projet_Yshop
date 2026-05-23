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
        const catalogue = document.getElementById('catalogue');
        if (catalogue) {
            catalogue.innerHTML = "<p>Impossible de charger le catalogue. Vérifiez que le serveur Node.js est bien allumé dans le terminal.</p>";
        }
    }
}

function afficherMaillots(listeMaillots) {
    const conteneurCatalogue = document.getElementById('catalogue');
    
    if (!conteneurCatalogue) return; 

    conteneurCatalogue.innerHTML = '';

    listeMaillots.forEach(maillot => {
        const carte = document.createElement('div');
        carte.classList.add('carte-produit');

        carte.innerHTML = `
            <a href="produit.html?id=${maillot.id}" class="lien-produit" style="text-decoration: none; color: inherit;">
                <img src="${maillot.images && maillot.images.length > 0 ? maillot.images[0] : './assets/img/default.png'}" alt="Maillot ${maillot.nom}">
                <h3>${maillot.nom}</h3>
            </a>
            <p class="prix">${maillot.prix} ${maillot.devise}</p>
            <p class="stock">Stock : ${maillot.quantite_stock}</p>
            <button onclick="ajouterAuPanier('${maillot.id}')">Ajouter au panier</button>
        `;

        conteneurCatalogue.appendChild(carte);
    });
}

function ajouterAuPanier(idMaillot) {
    let panier = JSON.parse(localStorage.getItem('panierYShop')) || [];

    panier.push(idMaillot);

    localStorage.setItem('panierYShop', JSON.stringify(panier));

    alert("Le maillot a bien été ajouté à ton panier ");
    
    mettreAJourCompteurPanier();
}

function mettreAJourCompteurPanier() {
    let panier = JSON.parse(localStorage.getItem('panierYShop')) || [];
    const compteur = document.getElementById('compteur-panier');
    if (compteur) {
        compteur.innerText = "(" + panier.length + ")";
    }
}