document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (validateForm(form)) {
                form.submit();
            }
        });
    }
});

/**
 * Vérifie si tous les champs du formulaire sont valides
 */
function validateForm(form) {
    let isValid = true;

    // Vérifier le titre
    const titleInput = form.querySelector("input[name='title']");
    if (!validateTitle(titleInput.value)) {
        showError(titleInput, "Le titre doit contenir entre 3 et 50 caractères.");
        isValid = false;
    } else {
        clearError(titleInput);
    }

    // Vérifier la description
    const descInput = form.querySelector("textarea[name='description']");
    if (!validateDescription(descInput.value)) {
        showError(descInput, "La description doit contenir entre 5 et 255 caractères.");
        isValid = false;
    } else {
        clearError(descInput);
    }

    // Vérifier la priorité
    const prioritySelect = form.querySelector("select[name='priorityId']");
    if (!prioritySelect.value) {
        showError(prioritySelect, "Veuillez choisir une priorité.");
        isValid = false;
    } else {
        clearError(prioritySelect);
    }

    // Vérifier le statut
    const statusSelect = form.querySelector("select[name='statusId']");
    if (!statusSelect.value) {
        showError(statusSelect, "Veuillez choisir un statut.");
        isValid = false;
    } else {
        clearError(statusSelect);
    }

    // Vérifier la date d'échéance
    const dueDateInput = form.querySelector("input[name='due_date']");
    if (!validateDate(dueDateInput.value)) {
        showError(dueDateInput, "Veuillez entrer une date valide.");
        isValid = false;
    } else {
        clearError(dueDateInput);
    }

    return isValid;
}

/**
 * Vérifie si le titre est valide
 */
function validateTitle(title) {
    return title.length >= 3 && title.length <= 50;
}

/**
 * Vérifie si la description est valide
 */
function validateDescription(description) {
    return description.length >= 5 && description.length <= 255;
}

/**
 * Vérifie si la date d'échéance est valide
 */
function validateDate(date) {
    return !!Date.parse(date);
}

/**
 * Affiche un message d'erreur
 */
function showError(element, message) {
    let errorDiv = element.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains("error-message")) {
        errorDiv = document.createElement("div");
        errorDiv.classList.add("error-message");
        element.parentNode.appendChild(errorDiv);
    }
    errorDiv.innerText = message;
    element.classList.add("input-error");
}

/**
 * Efface le message d'erreur
 */
function clearError(element) {
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("error-message")) {
        errorDiv.remove();
    }
    element.classList.remove("input-error");
}
