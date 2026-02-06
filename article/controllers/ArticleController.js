// Contrelleur Articles
const {getAllArticles, getArticleById, getArticleByCategory} = require("../models/ArticleModel");

// Récupérer tous les articles

const getAll = async (req, res) => {
    try {
        const articles = await getAllArticles();

        res.json({
            message: "Articles récupérés avec succès",
            count: articles.length,
            articles,
        })
    } catch (error) {
        console.error("Erreur de récupération des articles", error.message)
        res.status(500).json({
            message: "Erreur de récupération des articles",
        });
    }
};

// Récupérer un article par son id
const getById = async (req, res) => {
    try {
        // const id = req.params.id;
        const { id } = req.params;
        const articleId = parseInt(id);

        const articles = await getArticleById(articleId);

        if (articles.length === 0){
            return res.status(404).json({
                message: "Article non trouvé"
            });
        }

        res.json({
            message: "Article récupéré avec succès",
            article: articles[0]
        });
    } catch (error) {
        console.error("Erreur de récupération de l'articles", error.message)
        res.status(500).json({
            message: "Erreur de récupération de l'articles",
        });
    }
};

// Récupérer les produits par catégorie
const getByCategory = async (req, res) => {
    try {
        const { categorie } = req.params;
        const articles = await getArticleByCategory(categorie);

        res.json({
            message: `Articles de la catégorie ${categorie}`,
            count: articles.length,
            articles,
        });
    } catch (error) {
        console.error("Erreur de récupération par catégorie", error.message);
        res.status(500).json({
            message: "Erreur de récupération des articles",
        });
    }
};

module.exports = {getAll, getById, getByCategory};