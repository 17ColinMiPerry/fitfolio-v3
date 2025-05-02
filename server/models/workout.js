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
    // First verify the workout belongs to the user
    const workout = await prisma.workout.findFirst({
      where: { 
        id: parseInt(id),
        userId,
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    if (!workout) {
      throw new Error("Workout not found or unauthorized");
    }

    // Delete in order: sets -> exercises -> workout
    await prisma.$transaction(async (tx) => {
      // Delete all sets for all exercises in this workout
      for (const exercise of workout.exercises) {
        await tx.set.deleteMany({
          where: { exerciseId: exercise.id }
        });
      }

      // Delete all exercises in this workout
      await tx.exercise.deleteMany({
        where: { workoutId: workout.id }
      });

      // Finally delete the workout
      await tx.workout.delete({
        where: { 
          id: workout.id,
          userId,
        }
      });
    });

    return { success: true };
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
