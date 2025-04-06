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

const router = Router();
// Definition des routes 
// Route pour ajouter un utilisateur

//Route pour la connexion
router.post("/connexion", (request, response, next) => {
    // On vérifie le le courriel et le mot de passe
    // envoyé sont valides
    if (
        isEmailValid(request.body.email) &&
        isPasswordValid(request.body.password)
    ) {
        // On lance l'authentification avec passport.js
        passport.authenticate("local", (erreur, user, info) => {
            if (erreur) {
                // S'il y a une erreur, on la passe
                // au serveur
                next(erreur);
            } else if (!user) {
                // Si la connexion échoue, on envoit
                // l'information au client avec un code
                // 401 (Unauthorized)
                response.status(401).json(info);
            } else {
                // Si tout fonctionne, on ajoute
                // l'utilisateur dans la session et
                // on retourne un code 200 (OK)
                request.logIn(user, (erreur) => {
                    if (erreur) {
                        next(erreur);
                    }
                    // On retourne l'utilisateur au client
                    if (!request.session.user) {
                        request.session.user = user;
                    }
                    response.status(200).json({
                        message: "Connexion réussie",
                        user,
                    });
                });
            }
        })(request, response, next);
    } else {
        response.status(400).json({
            error: "Email ou mot de passe invalide",
        });
    }
});

//Route deconnexion
router.post("/deconnexion", (request, response) => {
    //Protection de la route
    if (!request.session.user) {
        response.status(401).end();
        return;
    }
    // Déconnecter l'utilisateur
    request.logOut((erreur) => {
        if (erreur) {
            next(erreur);
        }
        // Rediriger l'utilisateur vers une autre page
        response.redirect("/");
    });
});

//Route pour ajouter un utilisateur
router.post("/inscription", async (request, response) => {
    try {
        const { email, password, nom } = request.body;
        const user = await addUser(email, password, nom);
        return response.status(200).json({
            user,
            message: "Utilisateur ajouté avec succès",
        });
    } catch (error) {
        if (error.code === "P2002") {
            return response.status(400).json({
                error: "L'email existe déjà.",
            });
        }
        return response.status(400).json({ error: error.message });
    }
});
// 🏠 Accueil : Afficher toutes les tâches
router.get("/", async (req, res) => {
    if (!req.session.id_user) {
        req.session.id_user = 123;
    }
    
    try {
        const taches = await getAllTaches();
        res.render("index", { titre: "Accueil", styles: ["/css/style.css"], taches });
    } catch (error) {
        console.error("❌ Erreur lors du chargement de la page d'accueil:", error);
        res.status(500).send("Erreur serveur");
    }
});

// ➕ Formulaire de création de tâche
router.get("/creer_Tache", (req, res) => {
    res.render("creer_Tache", { titre: "Créer une Tâche", styles: ["/css/style.css"] });
});

// ✅ Créer une tâche avec validation
router.post("/api/taches", async (req, res) => {
    try {
        console.log("📝 Données reçues :", req.body);
        const { title, description, priorityId, statusId, due_date, pinned } = req.body;

        // Vérifier si les données sont valides
        if (!validateTaskData({ title, description, priorityId, statusId, due_date })) {
            return res.status(400).json({ error: "Données invalides" });
        }

        await createTache({
            title,
            description,
            priorityId: Number(priorityId),
            statusId: Number(statusId),
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
        res.render("taches", { titre: "Liste des tâches", styles: ["/css/style.css"], taches });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des tâches:", error);
        res.status(500).send("Erreur serveur");
    }
});

// 🔍 Voir une tâche spécifique
router.get("/taches/:id", async (req, res) => {
    try {
        const tache = await getTacheById(req.params.id);
        if (!tache) {
            return res.status(404).json({ error: "Tâche introuvable" });
        }
        res.json(tache);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la tâche:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 🔍 Voir l'historique des modifications d'une tâche
router.get("/taches/:id/history", async (req, res) => {
    try {
        const history = await getTacheHistory(req.params.id);
        res.json(history);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'historique:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✏️ Modifier une tâche
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

// ✅ Mettre à jour une tâche avec validation
router.put("/api/taches/:id", async (req, res) => {
    try {
        const { title, description, priorityId, statusId, due_date, pinned } = req.body;

        if (!validateTaskData({ title, description, priorityId, statusId, due_date })) {
            return res.status(400).json({ error: "Données invalides" });
        }

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

// ✅ Marquer une tâche comme terminée
router.patch("/api/taches/:id/complete", async (req, res) => {
    try {
        const tache = await getTacheById(req.params.id);
        if (!tache) {
            return res.status(404).json({ error: "Tâche introuvable" });
        }

        const updatedTache = await updatedTache(req.params.id, { statusId: 3 }); // 3 = Terminé
        res.json({ message: "Tâche marquée comme terminée", tache: updatedTache });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du statut de la tâche:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Exporter le routeur
export default router;
