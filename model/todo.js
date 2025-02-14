// Liste des taches
let todos = [];

/**
 * Pour ajouter une tache
 * @param {*} description
 */
export const addTodo = (description) => {
    const todo = {
        id: todos.length + 1,
        description,
        est_faite: false,
    };
    todos.push(todo);
    return todo;
};

/**
 * Obtenir la liste de toutes les taches
 * @returns la liste des taches
 */
export const getTodos = () => todos;

/**
 * Pour la mise à jour de la tache
 * @param {*} id
 * @returns todo
 */
export const updateTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
        todo.est_faite = !todo.est_faite;
        return todo;
    } else throw new Error("Tache non trouvée");
};
