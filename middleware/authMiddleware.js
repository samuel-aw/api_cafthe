// ============================================================
//
// PROBLÈME DANS TON FICHIER ORIGINAL :
// Tu lisais le token depuis le header "Authorization: Bearer <token>"
// MAIS dans ClientController.js, tu envoies le token dans un COOKIE.
// Ces deux approches sont incompatibles → le middleware échouait toujours.
//
// CORRECTION :
// On lit maintenant le token depuis req.cookies.token
// (le cookie s'appelle "token" comme défini dans ClientController.js)
//
// POURQUOI LE COOKIE EST MEILLEUR ?
// - Le cookie est HTTPOnly → JavaScript ne peut pas le lire
//   (protection contre les attaques XSS)
// - Le navigateur l'envoie automatiquement à chaque requête
//   vers le même domaine (pas besoin de le gérer manuellement)
//
// ============================================================

const jwt = require("jsonwebtoken");

// Vérification du token
const verifyToken = (req, res, next) => {
    // On lit le token depuis le cookie (plus "req.headers.authorization")
    // Le cookie "token" est placé par ClientController.js lors du login
    const token = req.cookies?.token;
    //const authHeader = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({
            message: "Token manquant - veuillez vous connecter",
        });
    }

    // Le format attendu, cest "Bearer <token>"
    /*const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(403).json({
            message: "Format de token invalide",
        });
    }*/

    //const token = parts[1]; // <token>

    // Vérifier le token JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err){
            if (err.name === "TokenExpiredError"){
                return res.status(401).json({
                    message: "Token expiré - veuillez vous reconnecter"
                });
            }
            return res.status(401).json({
                message: "Token invalide",
            });
        }

        // Token valide : on ajoute les infos du client à la requête
        // decoded contient: { id:..., email:... } (c'est défini dans ClientController)
        req.client = decoded;
        // On passe au controller suivant
        next();
    });
};

module.exports = { verifyToken };