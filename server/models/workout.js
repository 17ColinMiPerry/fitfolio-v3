import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Workout {
  static async getAll() {
    return await prisma.workout.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(name) {
    return await prisma.workout.create({
      data: { name },
    });
  }

  static async delete(id) {
    return await prisma.workout.delete({
      where: { id: parseInt(id) },
    });
  }

  static async update(id, name) {
    return await prisma.workout.update({
      where: { id: parseInt(id) },
      data: { name },
    });
  }
}
