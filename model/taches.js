// Importer Prisma Client
import { PrismaClient } from "@prisma/client";

// Créer une instance de Prisma
const prisma = new PrismaClient();

/**
 * ✅ Obtenir toutes les tâches avec leur priorité et statut
 * @returns Liste des tâches
 */
export async function getAllTaches() {
    return await prisma.tache.findMany({
        include: {
            priority: true,
            status: true,
        },
        orderBy: { dueDate: "asc" },
    });
}
// modification 
/**
 * ✅ Obtenir une tâche par son ID
 * @param {number} id - ID de la tâche
 * @returns Tâche avec priorité et statut
 */
// ✅ Fonction pour récupérer une tâche par ID
export async function getTacheById(id) {
    return await prisma.tache.findUnique({
        where: { id: Number(id) }, // 👈 Convertir en nombre pour éviter l'erreur
    });
}

/**
 * ✅ Créer une nouvelle tâche
 * @param {Object} taskData - Données de la tâche
 * @returns Tâche créée
 */
export async function createTache({ title, description, priorityId, statusId, dueDate }) {
    priorityId = Number(priorityId);
    statusId = Number(statusId);

    // Vérifier si les ID existent
    const priorityExists = await prisma.priority.findUnique({ where: { priorityId } });
    const statusExists = await prisma.status.findUnique({ where: { statusId } });

    if (!priorityExists || !statusExists) {
        throw new Error("PriorityId ou StatusId n'existe pas dans la base.");
    }

    return await prisma.tache.create({
        data: {
            title,
            description,
            priorityId,
            statusId,
            dueDate: new Date(dueDate),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

/**
 * ✅ Mettre à jour une tâche et enregistrer l'historique des changements
 * @param {number} id - ID de la tâche
 * @param {Object} taskData - Nouvelles données de la tâche
 * @returns Tâche mise à jour
 */
export async function updatedTache(id, { title, description, priorityId, statusId, dueDate }) {
    const oldTache = await getTacheById(id);
// test
    const updatedTache = await prisma.tache.update({
        where: { id: Number(id) },
        data: {
            title,
            description,
            priorityId: Number(priorityId),
            statusId: Number(statusId),
            dueDate: new Date(dueDate),
            updatedAt: new Date(),
        },
    });

    // ✅ Ajouter l'historique des changements
    await prisma.tacheHistory.create({
        data: {
            tacheId: Number(id),
            changeType: "UPDATE",
            oldValues: JSON.stringify(oldTache),
            newValues: JSON.stringify(updatedTache),
        },
    });

    return updatedTache;
}

/**
 * ✅ Supprimer une tâche
 * @param {number} id - ID de la tâche
 * @returns Suppression réussie
 */
export async function deleteTache(id) {
    // Supprimer l'historique avant de supprimer la tâche pour éviter les conflits FK
    await prisma.tacheHistory.deleteMany({
        where: { tacheId: Number(id) },
    });

    return await prisma.tache.delete({
        where: { id: Number(id) },
    });
}

/**
 * ✅ Obtenir l'historique des modifications d'une tâche
 * @param {number} tacheId - ID de la tâche
 * @returns Historique des modifications
 */
export async function getTacheHistory(tacheId) {
    return await prisma.tacheHistory.findMany({
        where: { tacheId: Number(tacheId) },
        orderBy: { createdAt: "desc" },
    });
}
