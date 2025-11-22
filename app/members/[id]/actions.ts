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
  const dateString = formData.get('date') as string;
  // 날짜 문자열을 Date 객체로 변환 (YYYY-MM-DD 형식)
  const date = new Date(dateString + 'T00:00:00');
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

// 식단 가이드라인 관련 액션
export async function createDietGuide(memberId: number) {
  try {
    await prisma.dietGuide.upsert({
      where: { memberId },
      create: {
        memberId,
      },
      update: {},
    });

    revalidatePath(`/members/${memberId}`);
  } catch (error: any) {
    if (error?.code === 'P2001' || error?.message?.includes('does not exist')) {
      throw new Error('식단 가이드라인 테이블이 데이터베이스에 없습니다. Supabase에서 테이블을 생성해주세요.');
    }
    throw error;
  }
}

export async function updateDietGuideMemo(memberId: number, formData: FormData) {
  try {
    const memo = formData.get('memo') as string | null;

    // DietGuide가 없으면 생성 (테이블이 없을 수 있음)
    try {
      await prisma.dietGuide.upsert({
        where: { memberId },
        create: {
          memberId,
          memo: memo || null,
        },
        update: {
          memo: memo || null,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2001' || error?.message?.includes('does not exist')) {
        throw new Error('식단 가이드라인 테이블이 데이터베이스에 없습니다. Supabase에서 테이블을 생성해주세요.');
      }
      throw error;
    }

    revalidatePath(`/members/${memberId}`);
  } catch (error: any) {
    console.error('메모 저장 오류:', error);
    throw new Error(error.message || '메모를 저장하는 중 오류가 발생했습니다.');
  }
}

export async function addMeal(memberId: number, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const carbs = parseFloat(formData.get('carbs') as string);
    const protein = parseFloat(formData.get('protein') as string);
    const fat = parseFloat(formData.get('fat') as string);
    const calories = parseFloat(formData.get('calories') as string);

    // DietGuide가 없으면 생성 (테이블이 없을 수 있음)
    let dietGuide;
    try {
      dietGuide = await prisma.dietGuide.upsert({
        where: { memberId },
        create: {
          memberId,
        },
        update: {},
      });
    } catch (error: any) {
      if (error?.code === 'P2001' || error?.message?.includes('does not exist')) {
        throw new Error('식단 가이드라인 테이블이 데이터베이스에 없습니다. Supabase에서 테이블을 생성해주세요.');
      }
      throw error;
    }

    await prisma.meal.create({
      data: {
        dietGuideId: dietGuide.id,
        name,
        carbs,
        protein,
        fat,
        calories,
      },
    });

    revalidatePath(`/members/${memberId}`);
  } catch (error: any) {
    console.error('식사 추가 오류:', error);
    throw new Error(error.message || '식사를 추가하는 중 오류가 발생했습니다.');
  }
}

export async function updateMeal(mealId: number, memberId: number, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const carbs = parseFloat(formData.get('carbs') as string);
    const protein = parseFloat(formData.get('protein') as string);
    const fat = parseFloat(formData.get('fat') as string);
    const calories = parseFloat(formData.get('calories') as string);

    await prisma.meal.update({
      where: { id: mealId },
      data: {
        name,
        carbs,
        protein,
        fat,
        calories,
      },
    });

    revalidatePath(`/members/${memberId}`);
  } catch (error: any) {
    console.error('식사 수정 오류:', error);
    throw new Error(error.message || '식사를 수정하는 중 오류가 발생했습니다.');
  }
}

export async function deleteMeal(mealId: number, memberId: number) {
  try {
    await prisma.meal.delete({
      where: { id: mealId },
    });

    revalidatePath(`/members/${memberId}`);
  } catch (error: any) {
    console.error('식사 삭제 오류:', error);
    throw new Error(error.message || '식사를 삭제하는 중 오류가 발생했습니다.');
  }
}

