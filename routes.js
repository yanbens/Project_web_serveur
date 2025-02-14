import { Router } from "express";
import { addTodo, getTodos, updateTodo } from "./model/todo.js";

const router = Router();

//Definition des routes

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

export default router;
