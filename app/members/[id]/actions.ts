'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateMemberBasicInfo(
  memberId: number,
  formData: FormData
) {
  const heightCm = formData.get('heightCm')
    ? parseFloat(formData.get('heightCm') as string)
    : null;
  const weightKg = formData.get('weightKg')
    ? parseFloat(formData.get('weightKg') as string)
    : null;
  const goalWeightKg = formData.get('goalWeightKg')
    ? parseFloat(formData.get('goalWeightKg') as string)
    : null;
  const bodyFatPct = formData.get('bodyFatPct')
    ? parseFloat(formData.get('bodyFatPct') as string)
    : null;
  const goalBodyFatPct = formData.get('goalBodyFatPct')
    ? parseFloat(formData.get('goalBodyFatPct') as string)
    : null;
  const skeletalMuscleKg = formData.get('skeletalMuscleKg')
    ? parseFloat(formData.get('skeletalMuscleKg') as string)
    : null;
  const goalSkeletalMuscleKg = formData.get('goalSkeletalMuscleKg')
    ? parseFloat(formData.get('goalSkeletalMuscleKg') as string)
    : null;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      heightCm,
      weightKg,
      goalWeightKg,
      bodyFatPct,
      goalBodyFatPct,
      skeletalMuscleKg,
      goalSkeletalMuscleKg,
    },
  });

  revalidatePath(`/members/${memberId}`);
}

export async function updateMemberLifestyle(
  memberId: number,
  formData: FormData
) {
  const sleepHours = formData.get('sleepHours')
    ? parseFloat(formData.get('sleepHours') as string)
    : null;
  const job = formData.get('job') as string | null;
  const exerciseLevel = formData.get('exerciseLevel') as string | null;
  const smoking = formData.get('smoking') as string | null;
  const drinking = formData.get('drinking') as string | null;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      sleepHours,
      job: job || null,
      exerciseLevel: exerciseLevel || null,
      smoking: smoking || null,
      drinking: drinking || null,
    },
  });

  revalidatePath(`/members/${memberId}`);
}

export async function updateMemberMemo(memberId: number, formData: FormData) {
  const memo = formData.get('memo') as string | null;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      memo: memo || null,
    },
  });

  revalidatePath(`/members/${memberId}`);
}

export async function addInbodyRecord(memberId: number, formData: FormData) {
  const date = new Date(formData.get('date') as string);
  const imageUrl = formData.get('imageUrl') as string;

  await prisma.inbodyRecord.create({
    data: {
      memberId,
      date,
      imageUrl,
    },
  });

  revalidatePath(`/members/${memberId}`);
}

export async function createPTSession(memberId: number) {
  // 기존 세션 중 가장 큰 sessionNumber 찾기
  const lastSession = await prisma.pTSession.findFirst({
    where: { memberId },
    orderBy: { sessionNumber: 'desc' },
  });

  const nextSessionNumber = lastSession ? lastSession.sessionNumber + 1 : 1;

  const session = await prisma.pTSession.create({
    data: {
      memberId,
      sessionNumber: nextSessionNumber,
      date: new Date(),
    },
  });

  revalidatePath(`/members/${memberId}`);
  redirect(`/members/${memberId}/sessions/${session.id}`);
}

export async function deletePTSession(sessionId: number) {
  // PT 세션과 관련된 모든 데이터를 트랜잭션으로 삭제
  const session = await prisma.pTSession.findUnique({
    where: { id: sessionId },
    select: { memberId: true },
  });

  if (!session) return;

  await prisma.$transaction(async (tx) => {
    // 운동 세트 삭제
    const exercises = await tx.exercise.findMany({
      where: { sessionId },
      include: {
        sets: true,
      },
    });

    for (const exercise of exercises) {
      await tx.exerciseSet.deleteMany({
        where: { exerciseId: exercise.id },
      });
    }

    // 운동 삭제
    await tx.exercise.deleteMany({
      where: { sessionId },
    });

    // PT 세션 삭제
    await tx.pTSession.delete({
      where: { id: sessionId },
    });
  });

  revalidatePath(`/members/${session.memberId}`);
}

export async function deleteMember(memberId: number) {
  // 회원과 관련된 모든 데이터를 트랜잭션으로 삭제
  await prisma.$transaction(async (tx) => {
    // 모든 PT 세션의 운동 세트 삭제
    const sessions = await tx.pTSession.findMany({
      where: { memberId },
      include: {
        exercises: {
          include: {
            sets: true,
          },
        },
      },
    });

    for (const session of sessions) {
      for (const exercise of session.exercises) {
        await tx.exerciseSet.deleteMany({
          where: { exerciseId: exercise.id },
        });
      }
      await tx.exercise.deleteMany({
        where: { sessionId: session.id },
      });
    }

    // PT 세션 삭제
    await tx.pTSession.deleteMany({
      where: { memberId },
    });

    // 인바디 기록 삭제
    await tx.inbodyRecord.deleteMany({
      where: { memberId },
    });

    // 회원 삭제
    await tx.member.delete({
      where: { id: memberId },
    });
  });

  revalidatePath('/members');
  redirect('/members');
}

