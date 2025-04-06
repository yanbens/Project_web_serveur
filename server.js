// 📌 Charger les variables d'environnement
import "dotenv/config";

// 📚 Importations
import express, { json } from "express";
import { engine } from "express-handlebars";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import methodOverride from "method-override";

import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";

import routerExterne from "./routes.js";
import cspOption from "./csp-options.js";

// 🚀 Création de l'app Express
const app = express();

// 🧠 Initialisation du stockage de session en mémoire
const MemoryStore = memorystore(session);

// ⚙️ Configuration de Handlebars avec helper personnalisé
app.engine(
    "handlebars",
    engine({
        extname: ".handlebars",
        defaultLayout: false,
        helpers: {
            eq: (a, b) => a === b,
        },
    })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

// 🛡️ Middlewares de sécurité et performance
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 🔐 Session + Passport
app.use(
    session({
        cookie: { maxAge: 3600000 },
        name: process.env.npm_package_name,
        store: new MemoryStore({ checkPeriod: 3600000 }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// 📁 Fichiers statiques
app.use(express.static("public"));

// 📍 Routes
app.use(routerExterne);

// ❌ Erreur 404
app.use((req, res) => {
    res.status(404).send(`${req.originalUrl} Route introuvable.`);
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.info("✅ Serveur démarré :");
    console.info(`http://localhost:${PORT}`);
});
