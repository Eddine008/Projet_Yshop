document.addEventListener('DOMContentLoaded', () => {
    chargerCatalogue()
    actualiserCompteurPanier()
})

async function chargerCatalogue() {
    const zoneCatalogue = document.getElementById('grille-accueil')

    if (!zoneCatalogue) return 

    try {
        const reponse = await fetch('http://localhost:3000/api/maillots')

        if (!reponse.ok) {
            throw new Error('Erreur  avec le serveur')
        }

        const maillots = await reponse.json()
        
        zoneCatalogue.textContent = '' 

        for (let i = 0; i < maillots.length; i++) {
            creerCarteCatalogue(maillots[i], zoneCatalogue)
        }

    } catch (erreur) {
        console.error("Erreur détectée :", erreur)
        zoneCatalogue.textContent = "Erreur"
    }
}

function creerCarteCatalogue(maillot, conteneur) {
    let imageSrc = './assets/img/default.png'
    if (maillot.images && maillot.images.length > 0) {
        imageSrc = maillot.images[0]
    }

    const carte = document.createElement('div')
    carte.className = 'carte-produit'

    const img = document.createElement('img')
    img.src = imageSrc
    img.alt = 'Maillot ' + maillot.nom

    const titre = document.createElement('h3')
    titre.textContent = maillot.nom

    const prix = document.createElement('p')
    prix.className = 'prix'
    prix.textContent = maillot.prix + ' ' + maillot.devise

    const btnVoir = document.createElement('button')
    btnVoir.textContent = 'Voir le maillot'
    btnVoir.onclick = () => {
        window.location.href = 'produit.html?id=' + maillot.id
    }

    carte.appendChild(img)
    carte.appendChild(titre)
    carte.appendChild(prix)
    carte.appendChild(btnVoir)

    conteneur.appendChild(carte)
}

function actualiserCompteurPanier() {
    const zoneCompteur = document.getElementById('compteur-panier')
    if (zoneCompteur) {
        let monPanier = JSON.parse(localStorage.getItem('panier')) || []
        zoneCompteur.textContent = monPanier.length
    }
}