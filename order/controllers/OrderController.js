// ============================================================
//
// RESPONSABILITÉ : logique métier des commandes.
// Le Controller reçoit la requête HTTP, valide les données,
// appelle le Model, et renvoie la réponse JSON.
//
// ROUTES GÉRÉES :
//   POST /api/orders          → créer une commande (protégée)
//   GET  /api/orders          → mes commandes (protégée)
//   GET  /api/orders/:id      → détail d'une commande (protégée)
//
// ============================================================

const {
    createCommandeComplete,
    getCommandesByClient,
    getCommandeById,
} = require('../models/OrderModel');

// ─────────────────────────────────────────────────────────
// CRÉER UNE COMMANDE
// ─────────────────────────────────────────────────────────
// Body attendu :
// {
//   articles: [
//     { ID_Article: 1, quantite: 2, prix_ttc: 19.52 },
//     { ID_Article: 5, quantite: 1, prix_ttc: 15.72 }
//   ],
//   montant_total: 54.76
// }
// ─────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
    try {
        const { articles, montant_total } = req.body;

        // --- Validation des données ---
        // req.client.id vient du middleware werifyToken (JWT décodé)
        if(!articles || !Array.isArray(articles) || articles.length === 0) {
            return res.status(400).json({
                message: 'Le panier est vide ou invalide',
            });
        }

        if (!montant_total || isNaN(montant_total) || montant_total <= 0) {
            return res.status(400).json({
                message: 'Montant total invalide',
            });
        }

        // Vérifier que chaque article a les champs requis
        for (const article of articles) {
            if (!article.ID_Article || !article.quantite || article.quantite <= 0) {
                return res.status(400).json({
                    message: `Article invalide : ${JSON.stringify(article)}`,
                });
            }
        }

        // --- Création de la commande via le Model ---
        // req.client.id est injecté par verifyToken depuis le JWT
        const ID_Commande = await createCommandeComplete(
            req.client.id,
            montant_total,
            articles
        );

        res.status(201).json({
            message: 'Commande créée avec succès',
            ID_Commande,
            // Numéro de commande lisible (format CMD-XXXXX)
            numero_commande: `CMD-${ID_Commande}`,
        });
    } catch (error) {
        console.error('Erreur création commande :', error.message);
        res.status(500).json({
            message: 'Erreur lors de la création de la commande',
        });
    }
};

// ─────────────────────────────────────────────────────────
// MES COMMANDES
// ─────────────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
    try {
        const commandes = await getCommandesByClient(req.client.id);

        res.json({
            message: 'Commandes récupérés avec succès',
            count: commandes.length,
            commandes,
        });

    } catch (error) {
        console.error('Erreur récupération commandes :', error.message);
        res.status(500).json({
            message: 'Erreur lors de la récupération des commandes',
        });
    }
};

// ─────────────────────────────────────────────────────────
// DÉTAIL D'UNE COMMANDE
// ─────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
    try {
        const{ id } = req.params;
        const ID_Commande = parseInt(id);

        if (isNaN(ID_Commande)) {
            return res.status(400).json({
                message: 'ID commande invalide'
            });
        }

        // On passe aussi req.client.id pour s'assurer que la commande
        // appartient bien au client connecté (sécurité importante !)
        const commande = await getCommandeById(ID_Commande, req.client.id);

        if (!commande) {
            return res.status(404).json({
                message: 'Commande non trouvée'
            });
        }

        res.json({
            message: 'Commande récupérée avec succès',
            commande,
        });

    } catch (error) {
        console.error('Erreur récupération commande :', error.message);
        res.status(500).json({
            message: 'Erreur lors de la récupération de la commande',
        });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById };