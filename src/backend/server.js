const express = require('express')
const fs = require('fs')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())

const cheminFichierMaillots = path.join(__dirname, 'data', 'produits.json')

app.get('/api/maillots', (req, res) => {
    const donneesBrutes = fs.readFileSync(cheminFichierMaillots, 'utf-8')
    const maillots = JSON.parse(donneesBrutes)
    
    res.json(maillots)
})

app.get('/api/maillots/:id', (req, res) => {
    const idMaillot = req.params.id
    
    const donneesBrutes = fs.readFileSync(cheminFichierMaillots, 'utf-8')
    const maillots = JSON.parse(donneesBrutes)
    
    const maillotTrouve = maillots.find((maillot) => {
        return maillot.id === idMaillot
    })

    if (maillotTrouve) {
        res.json(maillotTrouve)
    } else {
        res.status(404).json({ message: "Maillot introuvable" })
    }
})

app.patch('/api/maillots/:id/acheter', (req, res) => {
    const idMaillot = req.params.id
    
    const donneesBrutes = fs.readFileSync(cheminFichierMaillots, 'utf-8')
    const maillots = JSON.parse(donneesBrutes)
    
    const index = maillots.findIndex((maillot) => {
        return maillot.id === idMaillot
    })

    if (index !== -1 && maillots[index].quantite_stock > 0) {
        maillots[index].quantite_stock = maillots[index].quantite_stock - 1
        
        fs.writeFileSync(cheminFichierMaillots, JSON.stringify(maillots, null, 4))
        
        res.status(200).json({ message: "Achat validé, stock diminué" })
    } else {
        res.status(400).json({ message: "Impossible d'acheter : stock épuisé ou maillot introuvable" })
    }
})

app.listen(3000, () => {
    console.log("Serveur démarré sur le port 3000")
})