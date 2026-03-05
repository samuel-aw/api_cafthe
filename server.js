const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Permet de charger les variables d'environnement depuis .env
require("dotenv").config();

// Connexion à la bdd (base de données)
const db = require("./db");

// ==== Importation des routes ====
const articleRoutes = require("./article/routes/ArticleRouter");
const clientRoutes = require("./client/routes/ClientRouter");
// Création de l'application Express
const app = express();

// MIDDLEWARE
// Parser les JSON
app.use(express.json());

// Logger de requêtes HTTP dans la console
app.use(morgan("dev"));

// Sert les fichiers statiques (images, produits)
app.use(express.static("public"));

// Permet les requêtes cross-origin (qui viennent du front)
// CORS = Cross-Origin Ressource Sharing
// OBLIGATOIRE sinon le navigateur bloque les requêtes

app.use(
    cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
    }),
);

// Parse les cookies dans req
app.use(cookieParser());

// ROUTES

// Route de test pour vérifier que l'api fonctionne
app.get("/health", (req, res) => {
    res.json({
    status: "OK",
    message: "API fonctionnelle",
    });
});

// Routes de l'API
app.use("/api/articles", articleRoutes);
app.use("/api/clients", clientRoutes);

// GESTIONS DES ERREURS
// Routes 404
app.use((req, res) => {
    res.status(404).json({
        message: "Route non trouvée",
    });
});

// DÉMARRAGE DU SERVEUR
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
    console.log(`Serveur démarré sur http://${host}:${port}`);
})