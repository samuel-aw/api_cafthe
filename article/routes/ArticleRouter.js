// Router Articles
// chemin : /api/articles

const express = require("express");
const {getAll, getById, getByCategory} = require("../controllers/ArticleController");
//const {verifyToken} = require("../../middleware/authMiddleware");
const router = express.Router();

// GET /api/articles - Récupérer tous les articles
router.get("/",/*verifyToken*/ getAll);

// GET /api/articles/:id - Récupérer un article par son Id
router.get("/:id", getById);

// GET /api/articles/categorie/:categorie - Récupérer les article d'une catégorie
router.get("/categorie/:categorie", getByCategory);

// Il faut exporter router (l'objet d'Express) et non les fonctions (important)
module.exports = router;

