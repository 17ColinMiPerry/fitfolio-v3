import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Set {
  static async create(exerciseId, reps, weight, notes = null) {
    return await prisma.set.create({
      data: {
        reps: parseInt(reps),
        weight: parseFloat(weight),
        notes,
        exerciseId,
      },
    });
  }

  static async delete(id) {
    return await prisma.set.delete({
      where: { id },
    });
  }

  static async update(id, reps, weight, notes = null) {
    // Only update notes if provided (otherwise leave unchanged)
    const data = {
      reps: parseInt(reps),
      weight: parseFloat(weight),
    };
    if (notes !== undefined) data.notes = notes;
    return await prisma.set.update({
      where: { id },
      data,
    });
  }
}
