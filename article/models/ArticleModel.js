// Model Articles

const db = require("../../db");

// Récupérer tous les articles
const getAllArticles = async () => {
    const [rows] = await db.query("SELECT * FROM articles");
    return rows;
};

// Récupérer un article par son ID (TRES IMPORTANT)
const getArticleById = async (id) => {
    const [rows] = await db.query("SELECT * FROM articles WHERE ID_article = ?", [id]);
    return rows;
};

// Récupérer un article par sa catégorie
const getArticleByCategory = async (categorie) => {
    const [rows] = await db.query("SELECT * FROM articles WHERE categorie = ?", [
        categorie,
    ]);
    return rows;
}
module.exports = {getAllArticles, getArticleById, getArticleByCategory};
