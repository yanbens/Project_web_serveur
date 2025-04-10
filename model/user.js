// Importer Prisma Client
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Créer une instance de Prisma
const prisma = new PrismaClient();

// Pour recuperer un utilisateur par son email
export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
};

// Pour ajouter un utilisateur avec email, mot de passe et nom
export const addUser = async (email, password, nom) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            nom,
            type: "USER",
        },
    });
    return user;
};
