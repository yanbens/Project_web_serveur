export function validateTaskData({ title, description, priorityId, statusId, due_date }) {
    const errors = [];

    if (!title || title.length < 3 || title.length > 50) {
        errors.push("Le titre doit contenir entre 3 et 50 caractères.");
    }

    if (!description || description.length < 5 || description.length > 255) {
        errors.push("La description doit contenir entre 5 et 255 caractères.");
    }

    if (!priorityId || isNaN(priorityId)) {
        errors.push("Priorité invalide.");
    }

    if (!statusId || isNaN(statusId)) {
        errors.push("Statut invalide.");
    }

    if (!due_date || isNaN(Date.parse(due_date))) {
        errors.push("Date d'échéance invalide.");
    }

    return errors;
}
