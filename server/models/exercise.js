import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Exercise {
  static async getAll(workoutId, userId) {
    // First verify the workout belongs to the user
    const workout = await prisma.workout.findFirst({
      where: { 
        id: parseInt(workoutId),
        userId 
      }
    });

    if (!workout) {
      throw new Error("Workout not found or unauthorized");
    }

    return await prisma.exercise.findMany({
      where: { workoutId: parseInt(workoutId) },
      include: {
        sets: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(workoutId, userId, name) {
    // First verify the workout belongs to the user
    const workout = await prisma.workout.findFirst({
      where: { 
        id: parseInt(workoutId),
        userId 
      }
    });

    if (!workout) {
      throw new Error("Workout not found or unauthorized");
    }

    return await prisma.exercise.create({
      data: { 
        name,
        workoutId: parseInt(workoutId),
      },
    });
  }

  static async delete(id, userId) {
    // First verify the exercise belongs to a workout owned by the user
    const exercise = await prisma.exercise.findFirst({
      where: { id: parseInt(id) },
      include: { workout: true }
    });

    if (!exercise || exercise.workout.userId !== userId) {
      throw new Error("Exercise not found or unauthorized");
    }

    // First delete all associated sets
    await prisma.set.deleteMany({
      where: { exerciseId: parseInt(id) }
    });

    // Then delete the exercise
    return await prisma.exercise.delete({
      where: { id: parseInt(id) }
    });
  }

  static async update(id, userId, name) {
    // First verify the exercise belongs to a workout owned by the user
    const exercise = await prisma.exercise.findFirst({
      where: { id: parseInt(id) },
      include: { workout: true }
    });

    if (!exercise || exercise.workout.userId !== userId) {
      throw new Error("Exercise not found or unauthorized");
    }

    return await prisma.exercise.update({
      where: { id: parseInt(id) },
      data: { name },
    });
  }
}

