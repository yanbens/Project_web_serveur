export function validateDescription(description) {
    if (!description || typeof description !== "string") {
        return false;
    }

    // Vérifier la longueur minimale et maximale
    if (description.length < 5 || description.length > 255) {
        return false;
    }

    return true;
}
