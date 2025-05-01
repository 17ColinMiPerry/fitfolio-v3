import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Workout {
  static async getAll(userId) {
    return await prisma.workout.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(userId, name) {
    return await prisma.workout.create({
      data: { 
        name,
        userId,
      },
    });
  }

  static async delete(id, userId) {
    return await prisma.workout.delete({
      where: { 
        id: parseInt(id),
        userId,
      },
    });
  }

  static async update(id, userId, name) {
    return await prisma.workout.update({
      where: { 
        id: parseInt(id),
        userId,
      },
      data: { name },
    });
  }
}
