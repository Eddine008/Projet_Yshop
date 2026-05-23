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
        const reponse = await fetch(`http://localhost:3000/api/maillots/${id}`)
        
        if (!reponse.ok) {
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
    const imageSrc = (maillot.images && maillot.images.length > 0) ? maillot.images[0] : './assets/img/default.png'
    const description = maillot.description || "Aucune description disponible pour ce modèle."
    
    document.getElementById('img-produit').src = imageSrc
    document.getElementById('img-produit').alt = `Maillot ${maillot.nom}`
    
    document.getElementById('nom-produit').textContent = maillot.nom
    document.getElementById('prix-produit').textContent = `${maillot.prix} ${maillot.devise}`
    document.getElementById('desc-produit').textContent = description
    
    const elementStock = document.getElementById('stock-produit')
    if (maillot.quantite_stock > 0) {
        elementStock.textContent = `En stock : ${maillot.quantite_stock} unités`
        elementStock.className = "stock-disponible"
    } else {
        elementStock.textContent = "Rupture de stock"
        elementStock.className = "stock-rupture"
    }

    const boutonPanier = document.getElementById('btn-panier')
    boutonPanier.onclick = () => ajouterAuPanierDepuisDetail(maillot.id)
}

function afficherErreur(message) {
    document.getElementById('detail-produit').textContent = message
}