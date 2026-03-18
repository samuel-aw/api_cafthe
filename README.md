# API Site E-commerce CafThé
API REST développée avec Node.js et Express pour la gestion du site E-commerce CafThé.

## Prerequis

- [Node.js](https://nodejs.org/) >= 18
- npm
- MYSQL (Base de données fonctionnelle)



## Quickstart

```bash
# 1. Cloner le depot
git clone https://github.com/samuel-aw/api_cafthe
cd api_cafthe

# 2. Installer les dependances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Editer .env avec vos identifiants MySQL

# 4. Lancer le serveur de developpement
npm start
```

L'application sera accessible sur `http://localhost:3000`.

### Variables d'environnement

| Variable         | Description                          | Exemple               |
|------------------|--------------------------------------|-----------------------|
| `FRONTEND_URL`   | URL du front                         | http://localhost:4173 |
| `PORT`           | configuration du serveur             | 3000                  |
| `HOST`           | configuration du serveur             | localhost             |
| `DB_HOST`        | hôte de la base de données           | localhost             |
| `DB_USER`        | utilisateur MySQL                    | root                  |
| `DB_PASSWORD`    | mot de passe de la base de données   | mot_de_passe          |
| `DB_NAME`        | Nom de la base de données            | site_cafe             |
| `BCRYPT_ROUNDS`  | tours d'hachage mot de passe clients | 10                    |
| `JWT_SECRET`     | clé pour le AuthMiddleware           | ma_clé_secrete        |
| `JWT_EXPIRES_IN` | temps avant l'expirationde la clé    | 1800                  |

## Scripts disponibles

| Commande          | Description                    |
|-------------------|--------------------------------|
| `npm start`       | Lancer le serveur avec Node    |
| `npm run dev`     | Lancer le serveur avec nodemon |
| `npm run lint`    | Lancer ESLint sur le projet    |

## Exemples d'utilisation

<!-- Lister ici les principales routes de votre application avec une courte description -->

| URL                     | Description                          |
|-------------------------|--------------------------------------|
| `GET /api/articles`     | Récupérer tous les produits          |
| `POST /api/login`       | Connexion et création de cookie auth |
| `GET /api/articles/:id` | Récupérer un produit par son id      |

## Structure du projet

```
apicafthe/
├── article/
│   └── controllers/
│       └── ArticleController.js
│   └── models/
│       └── ArticleModel.js
│   └── routes/   
│       └── ArticleRouter.js      
├── client/        
│   └── controllers/
│       └── ClientController.js
│   └── models/
│       └── ClientModel.js
│   └── routes/
│       └── ClientRouter.js
├── middleware/             
│   └── authMiddleware.js
├── order/ 
│   └── controllers/
│       └── OrderController.js
│   └── models/
│       └── OrderModel.js
│   └── routes/     
│       └── OrderRoutes.js      
├── public/
│   └── images/
│       └── img_1.jpg
├── db.js            
└── server.js          
```

## Deploiement

### Build de production

```bash
npm run build
```

Les fichiers statiques sont generes dans le dossier `dist/`.

### Hebergement

<!-- Decrire la procedure de deploiement (Plesk, o2Switch, etc...) -->


## Tests
<!-- ATTENTION PAS ENCORE VU EN COURS -->
<!-- Decrire comment lancer les tests -->

```bash
# Lancer les tests
npm run test
```

## Stack technique

- **Node.js & Express** 
- **MySQL2** 
- **bcryptjs**
- **cookie-parserL**
- **cors**
- **dotenv**
- **jsonwebtoken**
- **morgan**
- **nodemon**

## Auteurs

- **Samuel AWODUN ARASOMWAN** — Développeur

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Liens utiles

- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vite.dev/)

