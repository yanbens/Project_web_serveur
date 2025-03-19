import express from "express";
import { engine } from "express-handlebars";
import methodOverride from "method-override";
import path from "path";

const app = express();

// 📌 Définir le dossier public pour les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(process.cwd(), "public"))); // ✅ Correction ici

// 📌 Ajouter le helper "eq"
const hbs = engine({
    extname: ".handlebars",
    helpers: {
        eq: (a, b) => a === b,
    }
});

app.engine("handlebars", hbs);
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "Views")); // ✅ Correction ici

// Middleware pour gérer les méthodes PUT et DELETE dans les formulaires
app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importer les routes
import router from "./routes.js";
app.use(router);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send(`${req.originalUrl} - Route introuvable.`);
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${PORT}`);
});
