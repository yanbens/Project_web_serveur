import { Router } from "express";
import { createTache, deleteTache, getAllTaches, updatedTache, getTacheById } from "./model/taches.js";


const router = Router();

// 🏠 Home Page: Afficher toutes les tâches
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

// ➕ Formulaire de création de tâche
router.get("/creer_Tache", (req, res) => {
    res.render("creer_Tache", {
        titre: "Créer une Tâche",
        styles: ["/css/style.css"],
    });
});

// ✅ Création d'une nouvelle tâche
router.post("/api/taches", async (req, res) => {
    try {
        console.log("📝 Données reçues :", req.body);

        let { title, description, priorityId, statusId, due_date, pinned } = req.body;

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

// ✅ Liste des tâches
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


// ✅ Route pour modifier une tâche
router.get("/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("🔍 ID reçu pour modification :", id); // Debug

        if (!id || isNaN(id)) {
            return res.status(400).send("❌ Erreur : ID invalide.");
        }

        const tache = await getTacheById(id);
        if (!tache) {
            return res.status(404).send("❌ Tâche introuvable");
        }

        res.render("edit", { titre: "Modifier la Tâche", styles: ["/css/style.css"], tache });
    } catch (error) {
        console.error("❌ Erreur lors du chargement de la page d'édition :", error);
        res.status(500).send("Erreur serveur");
    }
});


// ✅ Mettre à jour une tâche
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

        const updated = await updatedTache(req.params.id, tache);
        if (!updated) {
            return res.status(404).json({ error: "Tâche introuvable" });
        }

        res.json({ message: "Tâche mise à jour avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la tâche:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Supprimer une tâche
router.delete("/api/taches/:id", async (req, res) => {
    try {
        const deleted = await deleteTache(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Tâche introuvable" });
        }
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la tâche:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Exporter le routeur
export default router;
