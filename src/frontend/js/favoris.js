document.addEventListener('DOMContentLoaded', () => {
    chargerPageFavoris()
})

async function chargerPageFavoris() {
    const zoneFavoris = document.getElementById('liste-favoris') 
    let mesFavoris = JSON.parse(localStorage.getItem('listeFavoris')) || []

    if (mesFavoris.length === 0) {
        zoneFavoris.innerHTML = "<p>Tu n'as aucun favori pour le moment.</p>"
        return
    }

    zoneFavoris.innerHTML = ''

    for (let id of mesFavoris) {
        try {
            const reponse = await fetch(`http://localhost:3000/api/maillots/${id}`)
            
            if (reponse.ok) {
                const maillot = await reponse.json()
                creerCarteFavori(maillot, zoneFavoris)
            }
            
        } catch (erreur) {
            console.error(erreur)
        }
    }
}

function creerCarteFavori(maillot, conteneur) {
    const gabarit = document.getElementById('gabarit-maillot')
    const clone = gabarit.content.cloneNode(true)
    
    const imageSrc = (maillot.images && maillot.images.length > 0) ? maillot.images[0] : './assets/img/default.png'
    
    clone.querySelector('.favori-img').src = imageSrc
    clone.querySelector('.favori-img').alt = `Maillot ${maillot.nom}`
    clone.querySelector('.favori-nom').textContent = maillot.nom
    clone.querySelector('.favori-prix').textContent = `${maillot.prix} ${maillot.devise}`
    
    clone.querySelector('.btn-voir').onclick = () => {
        window.location.href = `produit.html?id=${maillot.id}`
    }
    
    clone.querySelector('.btn-retirer').onclick = () => {
        supprimerFavori(maillot.id)
    }
    
    conteneur.appendChild(clone)
}

function supprimerFavori(id) {
    let mesFavoris = JSON.parse(localStorage.getItem('listeFavoris')) || []
    mesFavoris = mesFavoris.filter(idSauvegarde => idSauvegarde !== id)
    localStorage.setItem('listeFavoris', JSON.stringify(mesFavoris))
    chargerPageFavoris()
}