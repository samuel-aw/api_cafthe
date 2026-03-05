// Model Clients

const db = require("../../db");
const bcrypt = require("bcryptjs");
// Pas besoin de hash car inutilisé
//const {hash} = require("bcryptjs");

// Rechercher un client par son ID
const findClientById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM clients WHERE ID_Client = ?",
        [id],
    );
    return rows;
}

// Rechercher un client par email
const findClientByEmail = async(email) => {
    const [rows] = await db.query(
        "SELECT * FROM clients WHERE email_client = ?",
        [email],
        );
    return rows;
};

// Créer un nouveau client
const createClient = async (clientData) => {
    // On extrait les données
    const {
        nom,
        prenom,
        email,
        mot_de_passe,
        adresse_facturation,
        cp_facturation,
        ville_facturation,
        adresse_livraison,
        cp_livraison,
        ville_livraison,
        telephone
    } = clientData;

    // Colonnes : nom_client, prenom_client, email_client, mdp_client... (selon SQL initial)
    // Aligner le nombre de points d'interrogation (?) avec le nombre de colonnes
    const [result] = await db.query(
        `INSERT INTO clients 
        (nom_client, prenom_client, email_client, mdp_client,
        adresse_facturation, cp_facturation, ville_facturation,
        adresse_livraison, cp_livraison, ville_livraison, 
        telephone_client) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nom,
            prenom,
            email,
            mot_de_passe,
            adresse_facturation || null,
            cp_facturation || null,
            ville_facturation || null,
            adresse_livraison || null,
            cp_livraison || null,
            ville_livraison || null,
            telephone || null,
        ],
    );
    return result;
};

// Hacher un mot de passe
const hashPassword = async (password) => {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    return await bcrypt.hash(password, rounds);
    // return await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
};

// Comparer un mot de passe
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};


module.exports = { findClientByEmail, createClient, hashPassword, comparePassword, findClientById };