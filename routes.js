import { Router } from "express";
import { createTache, deleteTache, getAllTaches, updatedTache, getTacheById } from "./model/taches.js";
import { validateDescription } from "./validation.js";

const router = Router();

// 🏠 Home Page: Show all tasks
router.get("/", async (req, res) => {
    try {
        const taches = await getAllTaches();
        res.render("index", {
            titre: "Accueil",
            styles: ["/css/style.css"],
            taches,
        });
    } catch (error) {
        console.error("❌ Erreur lors du chargement de la page d'accueil:", error);
        res.status(500).send("Erreur serveur");
    }
});

// ➕ Show Create Task Form
router.get("/creer_Tache", (req, res) => {
    res.render("creer_Tache", {
        titre: "Créer une Tâche",
        styles: ["/css/style.css"],
    });
});

// ✅ Handle Task Creation
router.post("/api/taches", async (req, res) => {
    try {
        console.log("📝 Données reçues :", req.body); // Debug: Voir les données envoyées

        let { title, description, priorityId, statusId, due_date, pinned } = req.body;

        // ✅ Vérifier si priorityId et statusId existent et sont valides
        priorityId = Number(priorityId);
        statusId = Number(statusId);

        if (isNaN(priorityId) || isNaN(statusId)) {
            return res.status(400).json({ error: "PriorityId ou StatusId invalide." });
        }

        

        // ✅ Créer la tâche
        await createTache({
            title,
            description,
            priorityId,
            statusId,
            dueDate: new Date(due_date),
            pinned: pinned === "on",
        });

        res.redirect("/");
    } catch (error) {
        console.error("❌ ERREUR SERVEUR :", error);
        res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
});

// ✅ Show Task List
router.get("/taches", async (req, res) => {
    try {
        const taches = await getAllTaches();
        res.render("taches", {
            titre: "Liste des tâches",
            styles: ["/css/style.css"],
            taches,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des tâches:", error);
        res.status(500).send("Erreur serveur");
    }
});

// ✅ Show Edit Task Page
router.get("/edit/:id", async (req, res) => {
    try {
        const tache = await getTacheById(req.params.id);
        if (!tache) {
            return res.status(404).send("Tâche introuvable");
        }
        res.render("edit", {
            titre: "Modifier la Tâche",
            styles: ["/css/style.css"],
            tache,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la tâche:", error);
        res.status(500).send("Erreur serveur");
    }
});

// ✅ Handle Task Update
router.put("/api/taches/:id", async (req, res) => {
    try {
        const { title, description, priorityId, statusId, due_date, pinned } = req.body;

        const tache = {
            title,
            description,
            priorityId: Number(priorityId),
            statusId: Number(statusId),
            dueDate: new Date(due_date),
            pinned: pinned === "on",
        };

        await updatedTache(req.params.id, tache);
        res.json({ message: "Tâche mise à jour avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la tâche:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Handle Task Deletion
router.delete("/api/taches/:id", async (req, res) => {
    try {
        await deleteTache(req.params.id);
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la tâche:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
