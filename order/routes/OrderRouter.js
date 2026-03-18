// ============================================================
//
// Toutes les routes sont PROTÉGÉES par verifyToken.
// Seul un client connecté peut créer ou consulter ses commandes.
//
// ROUTES :
//   POST /api/orders → créer une commande
//   GET  /api/orders → mes commandes
//   GET  /api/orders/:id → détail d'une commande
//
// CORRECTION IMPORTANTE (bug) :
//   router.post("/orders", ...) → router.post("/", ...)
//   (sinon la route devenait /api/orders/orders)
//
// ============================================================

const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require("../controllers/OrderController");
const { verifyToken } = require('../../middleware/authMiddleware');

// POST /api/orders - Créer une commande
// Corps : { articles: [...], montant_total: number }
router.post('/', verifyToken, createOrder);

// GET /api/orders - Récupérer toutes mes commandes
router.get('/', verifyToken, getMyOrders);

// GET /api/orders/:id - Récupérer le détail d'une commande
router.get('/:id', verifyToken, getOrderById);

module.exports = router;