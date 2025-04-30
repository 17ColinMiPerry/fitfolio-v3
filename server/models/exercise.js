import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Exercise {
  static async getAll(workoutId) {
    return await prisma.exercise.findMany({
      where: { workoutId },
      include: {
        sets: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  static async create(workoutId, name) {
    if (!name) {
      throw new Error("Name is required");
    }

    return await prisma.exercise.create({
      data: {
        name,
        workoutId,
      },
      include: {
        sets: true,
      },
    });
  }

  static async delete(id) {
    // First delete all sets associated with this exercise
    await prisma.set.deleteMany({
      where: { exerciseId: id },
    });
    // Then delete the exercise
    return await prisma.exercise.delete({
      where: { id },
    });
  }

  static async update(id, name) {
    return await prisma.exercise.update({
      where: { id },
      data: { name },
      include: { sets: true },
    });
  }
}
