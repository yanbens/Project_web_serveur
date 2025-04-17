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
import fs from "fs";
import https from "https";

import routerExterne from "./routes.js";
import cspOption from "./csp-options.js";
import "./authentification.js"; // config de passport

// 🚀 Création de l'app Express
const app = express();
const MemoryStore = memorystore(session);

// ⚙️ Configuration de Handlebars avec partials et layout
app.engine(
    "handlebars",
    engine({
        extname: ".handlebars",
        defaultLayout: "Main", // ✅ Utilise layouts/Main.handlebars
        layoutsDir: "./views/layouts", // ✅ Dossier des layouts
        partialsDir: "./views/partials", // ✅ Dossier des partials
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

// 🔐 Sessions + Passport
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

// ❌ 404
app.use((req, res) => {
    res.status(404).send(`${req.originalUrl} Route introuvable.`);
});

// ✅ Lancement du serveur HTTPS
const PORT = process.env.PORT || 5000;
const httpsOptions = {
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync("./ssl/cert.pem"),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.info("✅ Serveur HTTPS démarré :");
    console.info(`https://localhost:${PORT}`);
});
