'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSessionNote(sessionId: number, formData: FormData) {
  const note = formData.get('note') as string | null;

  const session = await prisma.pTSession.update({
    where: { id: sessionId },
    data: {
      note: note || null,
    },
  });

  revalidatePath(`/members/${session.memberId}/sessions/${sessionId}`);
}

export async function updateSessionHomework(
  sessionId: number,
  formData: FormData
) {
  const homework = formData.get('homework') as string | null;

  const session = await prisma.pTSession.update({
    where: { id: sessionId },
    data: {
      homework: homework || null,
    },
  });

  revalidatePath(`/members/${session.memberId}/sessions/${sessionId}`);
}

export async function addExercise(sessionId: number, formData: FormData) {
  const name = formData.get('name') as string;

  if (!name || name.trim() === '') {
    return;
  }

  // 해당 세션의 마지막 order 찾기
  const lastExercise = await prisma.exercise.findFirst({
    where: { sessionId },
    orderBy: { order: 'desc' },
  });

  const nextOrder = lastExercise ? lastExercise.order + 1 : 1;

  await prisma.exercise.create({
    data: {
      name: name.trim(),
      order: nextOrder,
      session: {
        connect: {
          id: sessionId,
        },
      },
    },
  });

  const session = await prisma.pTSession.findUnique({
    where: { id: sessionId },
    select: { memberId: true },
  });

  if (session) {
    revalidatePath(`/members/${session.memberId}/sessions/${sessionId}`);
  }
}

export async function updateExerciseFeedback(
  exerciseId: number,
  formData: FormData
) {
  const feedback = formData.get('feedback') as string | null;

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      session: {
        select: { memberId: true, id: true },
      },
    },
  });

  if (!exercise) return;

  await prisma.exercise.update({
    where: { id: exerciseId },
    data: {
      feedback: feedback || null,
    },
  });

  revalidatePath(
    `/members/${exercise.session.memberId}/sessions/${exercise.session.id}`
  );
}

export async function addExerciseSet(exerciseId: number) {
  // 해당 운동의 마지막 setNumber 찾기
  const lastSet = await prisma.exerciseSet.findFirst({
    where: { exerciseId },
    orderBy: { setNumber: 'desc' },
  });

  const nextSetNumber = lastSet ? lastSet.setNumber + 1 : 1;

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      session: {
        select: { memberId: true, id: true },
      },
    },
  });

  if (!exercise) return;

  await prisma.exerciseSet.create({
    data: {
      setNumber: nextSetNumber,
      exercise: {
        connect: {
          id: exerciseId,
        },
      },
    },
  });

  revalidatePath(
    `/members/${exercise.session.memberId}/sessions/${exercise.session.id}`
  );
}

export async function updateExerciseSet(setId: number, formData: FormData) {
  const weightKgValue = formData.get('weightKg');
  const weightKg =
    weightKgValue && weightKgValue !== ''
      ? parseFloat(weightKgValue as string)
      : null;

  const repsValue = formData.get('reps');
  const reps =
    repsValue && repsValue !== '' ? parseInt(repsValue as string) : null;

  const rirValue = formData.get('rir');
  const rir = rirValue && rirValue !== '' ? parseInt(rirValue as string) : null;

  const volumeValue = formData.get('volume');
  const volume =
    volumeValue && volumeValue !== ''
      ? parseFloat(volumeValue as string)
      : null;

  const restSecValue = formData.get('restSec');
  const restSec =
    restSecValue && restSecValue !== ''
      ? parseInt(restSecValue as string)
      : null;

  const exerciseSet = await prisma.exerciseSet.findUnique({
    where: { id: setId },
    include: {
      exercise: {
        include: {
          session: {
            select: { memberId: true, id: true },
          },
        },
      },
    },
  });

  if (!exerciseSet) return;

  await prisma.exerciseSet.update({
    where: { id: setId },
    data: {
      weightKg,
      reps,
      rir,
      volume,
      restSec,
    },
  });

  revalidatePath(
    `/members/${exerciseSet.exercise.session.memberId}/sessions/${exerciseSet.exercise.session.id}`
  );
}

export async function updateExerciseName(exerciseId: number, formData: FormData) {
  const name = formData.get('name') as string;

  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      session: {
        select: { memberId: true, id: true },
      },
    },
  });

  if (!exercise) return;

  await prisma.exercise.update({
    where: { id: exerciseId },
    data: {
      name,
    },
  });

  revalidatePath(
    `/members/${exercise.session.memberId}/sessions/${exercise.session.id}`
  );
}

export async function deleteExercise(exerciseId: number) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      session: {
        select: { memberId: true, id: true },
      },
    },
  });

  if (!exercise) return;

  await prisma.exercise.delete({
    where: { id: exerciseId },
  });

  revalidatePath(
    `/members/${exercise.session.memberId}/sessions/${exercise.session.id}`
  );
}

export async function deleteExerciseSet(setId: number) {
  const exerciseSet = await prisma.exerciseSet.findUnique({
    where: { id: setId },
    include: {
      exercise: {
        include: {
          session: {
            select: { memberId: true, id: true },
          },
        },
      },
    },
  });

  if (!exerciseSet) return;

  await prisma.exerciseSet.delete({
    where: { id: setId },
  });

  revalidatePath(
    `/members/${exerciseSet.exercise.session.memberId}/sessions/${exerciseSet.exercise.session.id}`
  );
}

