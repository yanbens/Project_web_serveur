
import "dotenv/config";
import express, { json } from "express";
import { engine } from "express-handlebars";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cspOption from "./csp-options.js";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./Views");

// Middlewares de sécurité et d'optimisation
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());

// Servir les fichiers statiques depuis "public"
app.use(express.static("public"));

// Ajouter les routes
app.use(router);

// Gestion des erreurs 404 pour les routes non définies
app.use((req, res) => {
    res.status(404).send(`${req.originalUrl} - Route introuvable.`);
});

// Définition du port avec fallback pour local
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
    console.info(`✅ Serveur démarré sur : http://localhost:${PORT}`);
});
