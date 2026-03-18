// ============================================================
//
// RESPONSABILITÉ : toutes les requêtes SQL liées aux commandes.
// Le Model ne contient QUE du SQL, aucune logique métier.
//
// FONCTIONS :
//   createCommande()      → INSERT dans commandes
//   createContenir()      → INSERT dans contenir (articles de la commande)
//   decrementStock()      → UPDATE stock dans articles
//   getCommandesByClient()→ SELECT commandes d'un client avec ses articles
//   getCommandeById()     → SELECT une commande par son ID
//
// TRANSACTION :
//   La création d'une commande utilise une transaction SQL pour
//   garantir que toutes les insertions réussissent ensemble.
//   Si une échoue → ROLLBACK (tout annuler).
//
// ============================================================

const db = require("../../db");

// ─────────────────────────────────────────────────────────
// CRÉER UNE COMMANDE COMPLÈTE (avec transaction)
// ─────────────────────────────────────────────────────────
// Paramètres :
//   ID_Client  : number  → identifiant du client connecté
//   montant    : number  → montant total TTC
//   articles   : array   → [{ ID_Article, quantite, prix_ttc }, ...]
//
// Retourne l'ID de la commande créée.
// ─────────────────────────────────────────────────────────
const createCommandeComplete = async (ID_Client, montant, articles) => {

    // On récupère une connexion dédiée depuis le pool
    // pour pouvoir gérer la transaction manuellement.
    // Avec une connexion dédiée, les requêtes START/COMMIT/ROLLBACK
    // s'appliquent toutes sur la même connexion.
    const connection = await db.getConnection();

    try {
        // --- Démarrage de la transaction ---
        await connection.beginTransaction();

        // --- 1. Créer la commande ---
        // date_commande et date_paiement = aujourd'hui
        // statut_commande = "En cours" par défaut
        // mode_commande = "Web" (c'est un site e-commerce)
        const [resultCommande] = await connection.query(
            `INSERT INTO commandes
            (date_commande, mode_commande, statut_commande, 
             montant_paiement, date_paiement, mode_paiement, ID_Client)
            VALUES (CURDATE(), 'Web', 'En cours', ?, CURDATE(), 'Carte', ?)`,
            [montant, ID_Client]
        );

        // insertId est l'ID auto-généré par MySQL pour la ligne créé
        const ID_Commande = resultCommande.insertId;

        // --- 2. Insérer chaque article dans la table "contenir" ---
        // Pour chaque article du panier, on crée une ligne dans
        // la table de liaison contenir(ID_Article, ID_Commande, Quantite)
        for (const article of articles) {
            await connection.query(
                `INSERT INTO contenir (ID_Article, ID_Commande, Quantite)
                VALUES (?, ?, ?)`,
                [article.ID_Article, ID_Commande, article.quantite]
            );
            // ── 3. Décrémenter le stock de chaque article ──
            // GREATEST(stock - quantite, 0) empêche le stock de passer négatif
            await connection.query(
                `UPDATE articles 
                SET stock = GREATEST (stock - ?, 0)
                WHERE ID_Article = ?`,
                [article.quantite, article.ID_Article]
            );
        }

        // --- Tout a réussi → on valide la transaction ---
        await connection.commit();

        return ID_Commande;
    } catch(error) {
        // --- Une erreur s'est produite → on annule TOUT ---
        // ROLLBACK remet la BDD dans l'état avant la transaction
        await connection.rollback();

        // On relance l'erreur pour que le controller puisse la gérer
        throw error;
    } finally {
        // Dans tous les cas, on libère la connexion vers le pool
        connection.release();
    }
};

// ─────────────────────────────────────────────────────────
// RÉCUPÉRER LES COMMANDES D'UN CLIENT
// ─────────────────────────────────────────────────────────
// On fait une jointure entre commandes, contenir et articles
// pour récupérer en une seule requête toutes les infos.
// ─────────────────────────────────────────────────────────
const getCommandesByClient = async (ID_Client) => {
    const [rows] = await db.query(
        `SELECT
            c.ID_Commande,
            c.date_commande,
            c.statut_commande,
            c.montant_paiement,
            c.mode_paiement,
            a.ID_Article,
            a.nom_produit,
            a.images,
            a.prix_ttc,
            co.Quantite
        FROM commandes c
        LEFT JOIN contenir co ON c.ID_Commande = co.ID_Commande
        LEFT JOIN articles a ON co.ID_Article = a.ID_Article
        WHERE c.ID_Client = ?
        ORDER BY c.date_commande DESC, c.ID_Commande DESC`,
        [ID_Client]
    );

    // Les données SQL sont "à plat" (une ligne par article).
    // On les regroupe par commande pour avoir une structure
    // plus pratique côté React :
    // [{ ID_Commande, date, statut, montant, articles: [...] }]
    return regrouperParCommande(rows);
};

// ─────────────────────────────────────────────────────────
// RÉCUPÉRER UNE COMMANDE PAR SON ID
// ─────────────────────────────────────────────────────────
const getCommandeById = async (ID_Commande, ID_Client) => {
    const [rows] = await db.query(
        `SELECT
            c.ID_Commande,
            c.date_commande,
            c.statut_commande,
            c.montant_paiement,
            c.mode_paiement,
            a.ID_Article,
            a.nom_produit,
            a.images,
            a.prix_ttc,
            co.Quantite
         FROM commandes c
         LEFT JOIN contenir co ON c.ID_Commande = co.ID_Commande
         LEFT JOIN articles a  ON co.ID_Article = a.ID_Article
         WHERE c.ID_Commande = ? AND c.ID_Client = ?`,
        [ID_Commande, ID_Client]
    );

    const regroupees = regrouperParCommande(rows);
    // Retourne la première (et unique) commande, ou null si pas trouvée
    return regroupees.length > 0 ? regroupees[0] : null;
};

// ─────────────────────────────────────────────────────────
// FONCTION UTILITAIRE : regrouper les lignes SQL par commande
// ─────────────────────────────────────────────────────────
// SQL renvoie une ligne par article :
//   { ID_Commande: 1, date: ..., nom_produit: 'Arabica', Quantite: 2 }
//   { ID_Commande: 1, date: ..., nom_produit: 'Théière', Quantite: 1 }
//
// On veut :
//   { ID_Commande: 1, date: ..., articles: [
//       { nom_produit: 'Arabica', quantite: 2 },
//       { nom_produit: 'Théière', quantite: 1 }
//   ]}
// ─────────────────────────────────────────────────────────
const regrouperParCommande = (rows) => {
    // Map : clé = ID_Commande, valeur = objet commande
    const commandesMap = new Map();

    for (const row of rows) {
        if (!commandesMap.has(row.ID_Commande)) {
            // Première fois qu'on voit cette commande → on l'initialise
            commandesMap.set(row.ID_Commande, {
                ID_Commande: row.ID_Commande,
                date_commande: row.date_commande,
                statut_commande: row.statut_commande,
                montant_paiement: row.montant_paiement,
                mode_paiement: row.mode_paiement,
                articles: [],
            });
        }

        // On ajoute l'article à la commande (si ce n'est pas null)
        if (row.ID_Article) {
            commandesMap.get(row.ID_Commande).articles.push({
                ID_Article: row.ID_Article,
                nom_produit: row.nom_produit,
                images: row.images,
                prix_ttc: row.prix_ttc,
                quantite: row.Quantite,
            });
        }
    }

    // On convertit la Map en tableau
    return Array.from(commandesMap.values());
};

module.exports = {
    createCommandeComplete,
    getCommandesByClient,
    getCommandeById,
};
