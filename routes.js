import { Router } from "express";
import {  createTache, deleteTache, getAllTaches,  updatedTache } from "./model/taches.js";

const router = Router();

//Definition des routes

// Route pour obtenir la Liste des tâches
router.get('/api/taches', async (req, res) => {
    try {
      const taches = await getAllTaches();
      res.render('tasks/index', { taches });
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
        res.render('tache/show', { tache, history });
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
router.post('/api/taches', async (req, res) => {
    try {
      const taches = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        due_date: new Date(req.body.due_date).getTime()
      };
      await createTache(tache);
      res.redirect('/taches');
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(500).send('Erreur serveur');
    }
  });
  
  // Formulaire de modification
router.get('/api/taches/:id/edit', async (req, res) => {
    try {
      const tache = await getTacheById(req.params.id);
      if (tache) {
        res.render('taches/edit', { task });
      } else {
        res.status(404).render('404');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).send('Erreur serveur');
    }
  });

  // Mise à jour d'une tâche
router.post('/api/taches/:id', async (req, res) => {
    try {
      const tache = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        due_date: new Date(req.body.due_date).getTime()
      };
      await updatedTache(req.params.id, task);
      res.redirect(`/taches/${req.params.id}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(500).send('Erreur serveur');
    }
  });
  // Suppression d'une tâche
router.post('/api/taches/:id/delete', async (req, res) => {
    try {
      await deleteTache(req.params.id);
      res.redirect('/api/taches');
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).send('Erreur serveur');
    }
  });
  
  export default router
// Route pour obtenir la liste des taches
router.get("/api/todos", (request, response) => {
    try {
        const todos = getTodos();
        return response.status(200).json(todos);
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// Route pour ajouter une tache
router.post("/api/todo", (request, response) => {
    try {
        const { description } = request.body;
        const todo = addTodo(description);
        return response
            .status(200)
            .json({ todo, message: "Tache ajoutée avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

// Route pour mettre à jour une tache
router.patch("/api/todo/:id", (request, response) => {
    try {
        const id = parseInt(request.params.id);
        const todo = updateTodo(id);
        return response
            .status(200)
            .json({ todo, message: "Tache mise à jour avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});

//Route pour mettre a jour une tache en utilisant la methode PUT avec query
router.put("/api/todo", (request, response) => {
    try {
        const id = parseInt(request.query.id);
        const todo = updateTodo(id);
        return response
            .status(200)
            .json({ todo, message: "Tache mise à jour avec succès" });
    } catch (error) {
        return response.status(400).json({ error: error.message });
    }
});


