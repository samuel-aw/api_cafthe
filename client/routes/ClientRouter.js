// Client router
// chemin : /api/clients

 const express = require('express');
const {register, login} = require("../controllers/ClientController");
const router = express.Router();


// Incription d'un client
// POST /api/clients/register
// Body : { nom, prenom, email, mot_de_passe }
router.post("/register", register);

// Connexion d'un client
// POST /api/clients/login
// Body : { email, mot_de_passe }
// Retourne un token JWT
router.post("/login", login);

module.exports = router;