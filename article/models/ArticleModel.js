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

module.exports = {getAllArticles, getArticleById};
