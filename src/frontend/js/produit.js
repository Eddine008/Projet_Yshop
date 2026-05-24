document.addEventListener('DOMContentLoaded', () => {
    const parametresUrl = new URLSearchParams(window.location.search)
    const idMaillot = parametresUrl.get('id')

    if (idMaillot) {
        chargerDetailMaillot(idMaillot)
    } else {
        afficherErreur("Aucun maillot n'a été sélectionné.")
    }
})

async function chargerDetailMaillot(id) {
    try {
        const reponse = await fetch(`http://localhost:3000/api/maillots/${id}`, {
            cache: 'no-store'
        })
        
        if (reponse.ok === false) {
            throw new Error(`Erreur HTTP: ${reponse.status}`)
        }

        const maillot = await reponse.json()
        afficherDetail(maillot)

    } catch (erreur) {
        console.error(erreur)
        afficherErreur("Impossible de charger les détails de ce maillot.")
    }
}

function afficherDetail(maillot) {
    const description = maillot.description || "Aucune description disponible pour ce modèle."
    
    const galerie = document.getElementById('galerie-produit')
    galerie.textContent = ''
    
    if (maillot.images && maillot.images.length > 0) {
        maillot.images.forEach(imgUrl => {
            const img = document.createElement('img')
            img.src = imgUrl
            img.alt = 'Maillot ' + maillot.nom
            galerie.appendChild(img)
        })
    } else {
        const img = document.createElement('img')
        img.src = './assets/img/default.png'
        img.alt = "Image par défaut"
        galerie.appendChild(img)
    }
    
    document.getElementById('nom-produit').textContent = maillot.nom
    document.getElementById('prix-produit').textContent = maillot.prix + ' ' + maillot.devise
    document.getElementById('desc-produit').textContent = description
    
    const elementStock = document.getElementById('stock-produit')
    if (maillot.quantite_stock > 0) {
        elementStock.textContent = 'En stock : ' + maillot.quantite_stock + ' unités'
        elementStock.className = "stock-disponible"
    } else {
        elementStock.textContent = "Rupture de stock"
        elementStock.className = "stock-rupture"
    }

    const boutonPanier = document.getElementById('btn-panier')
    if (boutonPanier) {
        boutonPanier.onclick = () => ajouterAuPanier(maillot.id)
    }

    const boutonFavori = document.getElementById('btn-favori')
    if (boutonFavori) {
        boutonFavori.onclick = () => ajouterAuxFavoris(maillot.id)
    }
}

function afficherErreur(message) {
    document.getElementById('nom-produit').textContent = "Erreur"
    document.getElementById('desc-produit').textContent = message
}

function ajouterAuxFavoris(id) {
    let donneesLocales = localStorage.getItem('listeFavoris')
    let mesFavoris = []
    
    if (donneesLocales !== null) {
        mesFavoris = JSON.parse(donneesLocales)
    }
    
    if (mesFavoris.includes(id) === false) {
        mesFavoris.push(id)
        localStorage.setItem('listeFavoris', JSON.stringify(mesFavoris))
        alert("Maillot ajouté à tes favoris")
    } else {
        alert("Ce maillot est déjà dans tes favoris")
    }
}

function ajouterAuPanier(id) {
    const selectTaille = document.getElementById('choix-taille')
    let tailleChoisie = 'M' 
    
    if (selectTaille !== null) {
        tailleChoisie = selectTaille.value
    }

    let donneesLocales = localStorage.getItem('panier')
    let monPanier = []
    
    if (donneesLocales !== null) {
        monPanier = JSON.parse(donneesLocales)
    }
    
    monPanier.push(id)
    localStorage.setItem('panier', JSON.stringify(monPanier))
    
    alert("Maillot ajouté au panier en taille " + tailleChoisie)
    
    if (typeof actualiserCompteurPanier === 'function') {
        actualiserCompteurPanier()
    }
}