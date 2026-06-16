document.addEventListener('DOMContentLoaded', () => {
    chargerPagePanier()
})

async function chargerPagePanier() {
    const zonePanier = document.getElementById('liste-panier') 
    const totalPanier = document.getElementById('total-panier')
    
    let donneesLocales = localStorage.getItem('panier')
    let monPanier = []
    
    if (donneesLocales !== null) {
        monPanier = JSON.parse(donneesLocales)
    }

    if (monPanier.length === 0) {
        zonePanier.innerHTML = "<p>Ton panier est vide pour le moment.</p>"
        if (totalPanier) {
            totalPanier.textContent = "0.00 €"
        }
        return
    }

    zonePanier.textContent = ''
    let prixTotal = 0

    for (let id of monPanier) {
        const reponse = await fetch(`http://localhost:3000/api/maillots/${id}`)
        
        if (reponse.ok === true) {
            const maillot = await reponse.json()
            creerCartePanier(maillot, zonePanier)
            
            prixTotal = prixTotal + Number(maillot.prix)
        }
    }

    if (totalPanier) {
        totalPanier.textContent = prixTotal.toFixed(2) + " €"
    }

    const boutonValider = document.getElementById('btn-valider-achat')
    if (boutonValider) {
        boutonValider.onclick = () => validerAchat()
    }
}

function creerCartePanier(maillot, conteneur) {
    let imageSrc = './assets/img/default.png'
    if (maillot.images.length > 0) {
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
    
    const btnRetirer = document.createElement('button')
    btnRetirer.className = 'btn-retirer'
    btnRetirer.textContent = 'Retirer'
    btnRetirer.onclick = () => {
        supprimerDuPanier(maillot.id)
    }
    
    carte.appendChild(img)
    carte.appendChild(titre)
    carte.appendChild(prix)
    carte.appendChild(btnRetirer)
    
    conteneur.appendChild(carte)
}

function supprimerDuPanier(id) {
    let donneesLocales = localStorage.getItem('panier')
    let monPanier = JSON.parse(donneesLocales)
    
    const index = monPanier.indexOf(id)
    if (index !== -1) {
        monPanier.splice(index, 1)
    }
    
    localStorage.setItem('panier', JSON.stringify(monPanier))
    
    chargerPagePanier()
}

async function validerAchat() {
    let donneesLocales = localStorage.getItem('panier')
    let monPanier = JSON.parse(donneesLocales)

    if (monPanier.length === 0) {
        return
    }

    let toutEstOk = true

    for (let idArticle of monPanier) {
        const reponse = await fetch(`http://localhost:3000/api/maillots/${idArticle}/acheter`, {
            method: 'PATCH'
        })
        
        if (reponse.ok === false) {
            toutEstOk = false
            console.error("Erreur avec le maillot : " + idArticle)
        }
    }

    if (toutEstOk === true) {
        alert("Merci pour ton achat ! Ta commande a été validée et les stocks mis à jour.")
        localStorage.removeItem('panier')
        window.location.href = 'index.html' 
    } else {
        alert("L'achat a échoué")
    }
}