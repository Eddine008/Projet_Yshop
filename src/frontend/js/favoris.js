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
    btnVoir.className = 'btn-voir'
    btnVoir.textContent = 'Voir le maillot'
    btnVoir.onclick = () => {
        window.location.href = 'produit.html?id=' + maillot.id
    }
    
    const btnRetirer = document.createElement('button')
    btnRetirer.className = 'btn-retirer'
    btnRetirer.textContent = 'Retirer'
    btnRetirer.onclick = () => {
        supprimerFavori(maillot.id)
    }
    
    carte.appendChild(img)
    carte.appendChild(titre)
    carte.appendChild(prix)
    carte.appendChild(btnVoir)
    carte.appendChild(btnRetirer)
    
    conteneur.appendChild(carte)
}

function supprimerFavori(id) {
    let mesFavoris = JSON.parse(localStorage.getItem('listeFavoris')) || []
    mesFavoris = mesFavoris.filter(idSauvegarde => idSauvegarde !== id)
    localStorage.setItem('listeFavoris', JSON.stringify(mesFavoris))
    chargerPageFavoris()
}