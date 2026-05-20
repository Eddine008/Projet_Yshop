const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/produits.json');

const getProducts = (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath);
        const produits = JSON.parse(rawData);
        res.status(200).json(produits);
    } catch (erreur) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getProductById = (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath);
        const produits = JSON.parse(rawData);
        const produit = produits.find(p => p.id === req.params.id);

        if (produit) {
            res.status(200).json(produit);
        } else {
            res.status(404).json({ message: "Maillot non trouvé" });
        }
    } catch (erreur) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const updateStock = (req, res) => {
    try {
        const rawData = fs.readFileSync(dataPath);
        const produits = JSON.parse(rawData);
        const { quantite } = req.body; 
        const index = produits.findIndex(p => p.id === req.params.id);

        if (index !== -1) {
            if (produits[index].quantite_stock >= quantite) {
                produits[index].quantite_stock -= quantite;
                fs.writeFileSync(dataPath, JSON.stringify(produits, null, 2));
                res.status(200).json({ message: "Stock mis à jour", produit: produits[index] });
            } else {
                res.status(400).json({ message: "Stock insuffisant" });
            }
        } else {
            res.status(404).json({ message: "Maillot non trouvé" });
        }
    } catch (erreur) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    updateStock
};