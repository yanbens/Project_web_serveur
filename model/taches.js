// importer ler client prisma
import { PrismaClient } from "@prisma/client";

//Creer une instance de prisma
const prisma = new PrismaClient();

/**
 * Obtenir la liste de toutes les taches
 * @returns la liste des taches
 */
export async function getAllTaches() {
    return await prisma.tache.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
};

/**
 * Pour obtenir la liste de tout les taches par ID
 * @param {*} id
 * @returns la liste des taches 
 */
export async function getTacheById(id) {
    return await prisma.tache.findUnique({
      where: { id: parseInt(id) }
    });
  }
  /**
 * Pour la cration de la tache
 * @param {*} tache
 * @returns tache
 */
  export async function createTache(tache) {
    return await prisma.tache.create({
      data: {
        title: tache.title,
        description: tache.description,
        priority: tache.priority.toUpperCase(),
        dueDate: new Date(tache.due_date)
      }
    });
  }
/**
 * Pour la mise à jour de la tache
 * @param {*} id 
 * @returns tache
 */

export async function updatedTache(id, tache) {
    const oldTache = await getTacheById(id);
    
    const updatedTache = await prisma.tache.update({
      where: { id: parseInt(id) },
      data: {
        title: tache.title,
        description: tache.description,
        priority: tache.priority.toUpperCase(),
        status: tache.status.replace(/ /g, '_').toUpperCase(),
        dueDate: new Date(tache.due_date)
      }
    });

     // Enregistrement dans l'historique
  await prisma.tacheHistory.create({
    data: {
      taskId: parseInt(id),
      changeType: 'UPDATE',
      oldValues: JSON.stringify(oldTache),
      newValues: JSON.stringify(tache)
    }
  });

  return updatedTache;
}

export async function deleteTache(id) {
    return await prisma.tache.delete({
      where: { id: parseInt(id) }
    });
  }
  
  export async function getTacheHistory(taskId) {
    return await prisma.tacheHistory.findMany({
      where: { tacheId: parseInt(tacheId) },
      orderBy: { createdAt: 'desc' }
    });
  }