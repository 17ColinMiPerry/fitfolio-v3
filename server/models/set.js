import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Set {
  static async create(exerciseId, reps, weight) {
    return await prisma.set.create({
      data: {
        reps: parseInt(reps),
        weight: parseFloat(weight),
        exerciseId,
      },
    });
  }

  static async delete(id) {
    return await prisma.set.delete({
      where: { id },
    });
  }

  static async update(id, reps, weight) {
    return await prisma.set.update({
      where: { id },
      data: {
        reps: parseInt(reps),
        weight: parseFloat(weight),
      },
    });
  }
}
