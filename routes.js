import {  Router } from "express";
import {  createTache, deleteTache, getAllTaches,  updatedTache ,getTacheById, getTacheHistory} from "./model/taches.js";
import { validateDescription } from "./validation.js";

const router = Router();

//Definition des routes

// Route pour la page d'accueil
router.get("/", async (request, response) => {
  response.render("taches", {
      titre: "Accueil",
      styles: ["./css/style.css", "./css/index.css"],
      scripts: ["./js/main.js"],
      taches: await getAllTaches(),
  });
});

// Route pour obtenir la Liste des tâches
router.get('/api/taches', async (req, res) => {
    try {
      const taches = await getAllTaches();
      res.render('taches', { taches });
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(500).send('Erreur serveur');
    }
  });
  // Détails d'une tâche
router.get('/api/taches/:id', async (req, res) => {
    try {
      const tache = await getTacheById(req.params.id);
      const history = await getTacheHistory(req.params.id);
      if (tache) {
        res.render( { tache, history });
      } else {
        res.status(404).render('404');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).send('Erreur serveur');
    }
  });

  // Formulaire de création
router.get('/api/taches/new', (req, res) => {
    res.render('taches/new');
  });

  // Création d'une tâche
// Création d'une tâche
router.post('/api/taches', async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    if (!validateDescription(description)) {
      return res.status(400).json({ error: "Description invalide" });
    }
    const newTache = {
      title,
      description,
      priority,
      due_date: new Date(due_date).getTime()
    };
    await createTache(newTache);
    res.status(201).json({ message: "Tâche créée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

  // Formulaire de modification
router.get('/api/taches/:id/edit', async (req, res) => {
    try {
      const tache = await getTacheById(req.params.id);
      if (tache) {
        res.render('taches/edit', { tache });
      } else {
        res.status(404).render('404');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).send('Erreur serveur');
    }
  });

  // Modification d'une tâche
router.put('/api/taches/:id', async (req, res) => {
  try {
    const { title, description, priority, status, due_date } = req.body;
    const tache = {
      title,
      description,
      priority,
      status,
      due_date: new Date(due_date).getTime()
    };
    await updatedTache(req.params.id, tache);
    res.json({ message: "Tâche mise à jour avec succès" });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

 // Suppression d'une tâche
router.delete('/api/taches/:id', async (req, res) => {
  try {
    await deleteTache(req.params.id);
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
  
  export default router









