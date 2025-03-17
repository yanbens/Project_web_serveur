import { validateDescription } from "./validation.js";
// Recupuration des elements du DOM
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoTemplate = document.getElementById("todo-template");

//Mettre a jour une tache
const updatedTache = async (event) => {
    await fetch(`/api/taches/${event.target.parentElement.dataset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
};

//Fonction pour ajouter une tache au DOM
const addTodoToClient = (tache) => {
    const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);

    const checkbox = todoElement.querySelector("input[type=checkbox]");
    todoElement.querySelector(".description").innerText = tache.description;

    todoElement.dataset.id = tache.id;

    checkbox.checked = tache.est_faite;
    checkbox.addEventListener("change", updateTask);

    todoList.appendChild(todoElement);
    todoInput.value = "";
};

//Fonction pour ajouter une tache
const addTacheToServer = async (event) => 
    {
    event.preventDefault();

    //Preparation des donnees a envoyer
    const addTacheToServer = async (event) => {
        event.preventDefault();
    
        //Preparation des donnees a envoyer
        const data = {
            description: todoInput.value,
        };
    
        //Envoie de la requete
        const response = await fetch("/api/tache", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

    //Traitement de la reponse
    if (response.ok) {
        const { tacheache } = await response.json();
        addTacheToClient(tache);
    } else {
        const { error } = await response.json();
        console.error(error);
    }
}};

//Fonction pour obtenir la liste des taches
const getAllTaches = async () => {
    const response = await fetch("/api/taches");
    if (response.ok) {
        const taches = await response.json();
        taches.forEach((tache) => {
            addTacheToClient(tache);
        });
    } else {
        const { error } = await response.json();
        console.error(error);
    }
};

//Ajouter event listener sur le formulaire
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTacheToServer(event);
});


