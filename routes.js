import { Router } from "express";
import {
    createTache,
    deleteTache,
    getAllTaches,
    updatedTache,
    getTacheById,
    getTacheHistory
} from "./model/taches.js";
import { validateTaskData } from "./validation.js";
import { addUser } from "./model/user.js";
import passport from "passport";
import { requireAuth } from "./middlewares/auth.js";

const router = Router();

// Connexion
router.get("/connexion", (req, res) => {
    res.render("connexion", {
        titre: "Connexion",
        styles: ["/css/style.css"]
    });
});

router.post("/connexion", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info);

        req.logIn(user, (err) => {
            if (err) return next(err);
            req.session.user = user;
            res.redirect("/");
        });
    })(req, res, next);
});

// Inscription
router.get("/inscription", (req, res) => {
    res.render("inscription", {
        titre: "Inscription",
        styles: ["/css/style.css"]
    });
});

router.post("/inscription", async (req, res) => {
    try {
        const { email, password, nom } = req.body;
        const user = await addUser(email, password, nom);
        req.session.user = user;
        res.redirect("/");
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "L'email existe déjà." });
        }
        return res.status(400).json({ error: error.message });
    }
});

// Déconnexion
router.post("/deconnexion", (req, res, next) => {
    if (!req.session.user) return res.status(401).end();
    req.logOut((err) => {
        if (err) return next(err);
        req.session.destroy(() => res.redirect("/connexion"));
    });
});

// Accueil
router.get("/", requireAuth, async (req, res) => {
    const taches = await getAllTaches();
    res.render("index", {
        titre: "Accueil",
        styles: ["/css/style.css"],
        taches,
        user: req.session.user
    });
});

// Voir toutes les tâches
router.get("/taches", requireAuth, async (req, res) => {
    const taches = await getAllTaches();
    res.render("taches", {
        titre: "Liste des tâches",
        styles: ["/css/style.css"],
        taches,
        user: req.session.user
    });
});

// Formulaire création tâche
router.get("/creer_Tache", requireAuth, (req, res) => {
    res.render("creer_Tache", {
        titre: "Créer une Tâche",
        styles: ["/css/style.css"],
        user: req.session.user
    });
});

// Créer une tâche
router.post("/api/taches", requireAuth, async (req, res) => {
    const { title, description, priorityId, statusId, due_date, pinned } = req.body;

    if (!validateTaskData({ title, description, priorityId, statusId, due_date })) {
        return res.status(400).json({ error: "Données invalides" });
    }

    await createTache({
        title,
        description,
        priorityId: Number(priorityId),
        statusId: Number(statusId),
        dueDate: new Date(due_date),
        pinned: pinned === "on"
    });

    res.redirect("/");
});

// Voir une tâche (API)
router.get("/taches/:id", requireAuth, async (req, res) => {
    const tache = await getTacheById(req.params.id);
    if (!tache) return res.status(404).json({ error: "Tâche introuvable" });
    res.json(tache);
});

// Formulaire d’édition
router.get("/edit/:id", requireAuth, async (req, res) => {
    const tache = await getTacheById(req.params.id);
    if (!tache) return res.status(404).send("Tâche introuvable");

    res.render("edit", {
        titre: "Modifier la Tâche",
        styles: ["/css/style.css"],
        tache,
        user: req.session.user
    });
});

// Modifier une tâche
router.put("/api/taches/:id", requireAuth, async (req, res) => {
    const { title, description, priorityId, statusId, due_date, pinned } = req.body;

    if (!validateTaskData({ title, description, priorityId, statusId, due_date })) {
        return res.status(400).json({ error: "Données invalides" });
    }

    const updated = await updatedTache(req.params.id, {
        title,
        description,
        priorityId: Number(priorityId),
        statusId: Number(statusId),
        dueDate: new Date(due_date),
        pinned: pinned === "on"
    });

    if (!updated) return res.status(404).json({ error: "Tâche introuvable" });

    res.json({ message: "Tâche mise à jour avec succès" });
});

// Supprimer une tâche
router.delete("/api/taches/:id", requireAuth, async (req, res) => {
    const deleted = await deleteTache(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Tâche introuvable" });

    res.json({ message: "Tâche supprimée avec succès" });
});

// Historique
router.get("/taches/:id/history", requireAuth, async (req, res) => {
    const history = await getTacheHistory(req.params.id);
    res.json(history);
});

// Marquer comme terminée
router.patch("/api/taches/:id/complete", requireAuth, async (req, res) => {
    const tache = await getTacheById(req.params.id);
    if (!tache) return res.status(404).json({ error: "Tâche introuvable" });

    const updated = await updatedTache(req.params.id, { statusId: 3 });
    res.json({ message: "Tâche marquée comme terminée", tache: updated });
});

export default router;
