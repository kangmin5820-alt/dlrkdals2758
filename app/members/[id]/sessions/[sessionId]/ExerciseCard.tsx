'use client';

import {
  updateExerciseFeedback,
  addExerciseSet,
  updateExerciseSet,
  updateExerciseName,
  deleteExercise,
  deleteExerciseSet,
} from './actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ExerciseCard({ exercise }: { exercise: any }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="bg-[#111111] rounded p-2 mb-2 border border-[#1a1a1a]">
      {/* 운동 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        {isEditingName ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                try {
                  await updateExerciseName(exercise.id, formData);
                  setIsEditingName(false);
                  router.refresh();
                } catch (err: any) {
                  setError(err.message || '운동 이름을 저장하는 중 오류가 발생했습니다.');
                }
              });
            }}
            className="flex-1"
          >
            <input
              type="text"
              name="name"
              defaultValue={exercise.name}
              autoFocus
              disabled={isPending}
              className="px-2 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex-1 text-white text-xs transition-all disabled:opacity-50"
              onBlur={() => {
                if (!isPending) {
                  setIsEditingName(false);
                }
              }}
            />
          </form>
        ) : (
          <h3
            className="text-sm font-bold flex-1 cursor-pointer hover:text-gray-400 text-white transition-colors"
            onClick={() => setIsEditingName(true)}
          >
            {exercise.name}
          </h3>
        )}

        <div className="flex gap-1.5">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            disabled={isPending}
            className="px-2 py-1 bg-[#1a1a1a] text-gray-300 rounded hover:bg-[#2a2a2a] transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            피드백
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              startTransition(async () => {
                try {
                  await addExerciseSet(exercise.id, new FormData());
                  router.refresh();
                } catch (err: any) {
                  setError(err.message || '세트를 추가하는 중 오류가 발생했습니다.');
                }
              });
            }}
            disabled={isPending}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? '처리 중...' : '+ 세트'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('이 운동을 삭제하시겠습니까?')) {
                setError(null);
                startTransition(async () => {
                  try {
                    await deleteExercise(exercise.id);
                    router.refresh();
                  } catch (err: any) {
                    setError(err.message || '운동을 삭제하는 중 오류가 발생했습니다.');
                  }
                });
              }
            }}
            disabled={isPending}
            className="px-2 py-1 bg-[#1a0a0a] hover:bg-[#2a0a0a] text-gray-400 hover:text-gray-300 rounded transition-colors text-xs font-semibold border border-[#2a1a1a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? '처리 중...' : '삭제'}
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-1">{error}</p>
        )}
      </div>

      {/* 피드백 섹션 */}
      {(showFeedback || exercise.feedback) && (
        <div className="mb-2 p-2 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
          {exercise.feedback && !showFeedback && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">피드백</p>
              <p className="text-gray-300 whitespace-pre-wrap bg-black p-1.5 rounded text-xs">
                {exercise.feedback}
              </p>
              <button
                onClick={() => setShowFeedback(true)}
                className="mt-1 text-gray-400 hover:text-gray-300 text-xs transition-colors"
              >
                수정하기
              </button>
            </div>
          )}
          {showFeedback && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                const formData = new FormData(e.currentTarget);
                startTransition(async () => {
                  try {
                    await updateExerciseFeedback(exercise.id, formData);
                    setShowFeedback(false);
                    router.refresh();
                  } catch (err: any) {
                    setError(err.message || '피드백을 저장하는 중 오류가 발생했습니다.');
                  }
                });
              }}
            >
              <textarea
                name="feedback"
                rows={2}
                defaultValue={exercise.feedback || ''}
                className="w-full px-2 py-1 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-600 text-xs transition-all resize-none"
                placeholder="이 운동에 대한 피드백을 입력하세요..."
              />
              <div className="mt-2 flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedback(false);
                    setError(null);
                  }}
                  disabled={isPending}
                  className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded hover:bg-[#2a2a2a] transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors text-xs font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: 'auto' }}
                >
                  {isPending ? '저장 중...' : '저장'}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
            </form>
          )}
        </div>
      )}

      {/* 세트 테이블 */}
      {exercise.sets.length === 0 ? (
        <div className="text-center py-3 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
          <p className="text-gray-500 text-xs">
            세트가 없습니다. 세트를 추가해주세요.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded">
            <thead className="bg-black">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  세트
                </th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  무게(kg)
                </th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  횟수
                </th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  RIR
                </th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  볼륨
                </th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  휴식
                </th>
                <th className="px-2 py-1 text-left text-xs font-semibold text-gray-400">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {exercise.sets.map((set: any) => (
                <SetRow key={set.id} set={set} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SetRow({ set }: { set: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getRowInputs = (row: HTMLElement) => {
    return row.querySelectorAll<HTMLInputElement>(
      'input[type="number"]:not([type="hidden"]), input[type="text"]:not([type="hidden"])'
    );
  };

  const calculateVolume = (setNumber: number, reps: number | null, weight: number | null) => {
    if (!reps || !weight || reps <= 0 || weight <= 0) return '';
    return (setNumber * reps * weight).toFixed(1);
  };

  const updateVolume = (row: HTMLElement) => {
    const weightInput = row.querySelector<HTMLInputElement>('input[name="weightKg"]:not([type="hidden"])');
    const repsInput = row.querySelector<HTMLInputElement>('input[name="reps"]:not([type="hidden"])');
    const volumeInput = row.querySelector<HTMLInputElement>('input[name="volume"]:not([type="hidden"])');

    if (weightInput && repsInput && volumeInput) {
      const weight = parseFloat(weightInput.value) || 0;
      const reps = parseInt(repsInput.value) || 0;
      const setNumber = set.setNumber;
      
      const calculatedVolume = calculateVolume(setNumber, reps, weight);
      volumeInput.value = calculatedVolume;

      // 모든 form의 hidden volume input도 업데이트
      const allForms = row.querySelectorAll('form');
      allForms.forEach((form) => {
        const hiddenVolume = form.querySelector<HTMLInputElement>('input[type="hidden"][name="volume"]');
        if (hiddenVolume) {
          hiddenVolume.value = calculatedVolume;
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const row = e.target.closest('tr');
    if (!row) return;

    // 무게나 횟수가 변경되면 볼륨 업데이트
    if (e.target.name === 'weightKg' || e.target.name === 'reps') {
      updateVolume(row);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const row = e.target.closest('tr');
    if (!row) return;

    const form = e.target.closest('form');
    if (!form) return;

    // 볼륨 자동 계산
    if (e.target.name === 'weightKg' || e.target.name === 'reps') {
      updateVolume(row);
    }

    // 같은 행의 모든 input 값을 수집
    const inputs = getRowInputs(row);
    inputs.forEach((input) => {
      if (input.name && input !== e.target) {
        // form에 해당 name의 hidden input이 있는지 확인
        const existingHidden = form.querySelector(
          `input[type="hidden"][name="${input.name}"]`
        ) as HTMLInputElement;
        if (existingHidden) {
          existingHidden.value = input.value || '';
        } else {
          // 없으면 새로 생성
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = input.name;
          hiddenInput.value = input.value || '';
          form.appendChild(hiddenInput);
        }
      }
    });

    // 현재 input의 값도 hidden에 저장
    if (e.target.name) {
      const existingHidden = form.querySelector(
        `input[type="hidden"][name="${e.target.name}"]`
      ) as HTMLInputElement;
      if (existingHidden) {
        existingHidden.value = e.target.value || '';
      }
    }

    // 서버 액션 호출
    setError(null);
    const formData = new FormData(form);
    startTransition(async () => {
      try {
        await updateExerciseSet(set.id, formData);
        router.refresh();
      } catch (err: any) {
        setError(err.message || '세트 정보를 저장하는 중 오류가 발생했습니다.');
      }
    });
  };

  return (
    <>
      <tr className="hover:bg-[#111111] transition-colors">
      <td className="px-2 py-1 text-xs font-semibold text-gray-400">{set.setNumber}세트</td>
      <td className="px-2 py-1">
        <form className="inline">
          <input
            type="number"
            step="0.1"
            name="weightKg"
            defaultValue={set.weightKg || ''}
            className="w-16 px-1.5 py-1 bg-[#111111] border border-[#1a1a1a] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            onBlur={handleBlur}
            onChange={handleInputChange}
          />
          <input type="hidden" name="reps" value={set.reps || ''} />
          <input type="hidden" name="rir" value={set.rir || ''} />
          <input type="hidden" name="volume" value={set.volume || ''} />
          <input type="hidden" name="restSec" value={set.restSec || ''} />
        </form>
      </td>
      <td className="px-2 py-1">
        <form className="inline">
          <input
            type="number"
            name="reps"
            defaultValue={set.reps || ''}
            className="w-16 px-1.5 py-1 bg-[#111111] border border-[#1a1a1a] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            onBlur={handleBlur}
            onChange={handleInputChange}
          />
          <input type="hidden" name="weightKg" value={set.weightKg || ''} />
          <input type="hidden" name="rir" value={set.rir || ''} />
          <input type="hidden" name="volume" value={set.volume || ''} />
          <input type="hidden" name="restSec" value={set.restSec || ''} />
        </form>
      </td>
      <td className="px-2 py-1">
        <form className="inline">
          <input
            type="number"
            name="rir"
            defaultValue={set.rir || ''}
            className="w-12 px-1.5 py-1 bg-[#111111] border border-[#1a1a1a] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            onBlur={handleBlur}
          />
          <input type="hidden" name="weightKg" value={set.weightKg || ''} />
          <input type="hidden" name="reps" value={set.reps || ''} />
          <input type="hidden" name="volume" value={set.volume || ''} />
          <input type="hidden" name="restSec" value={set.restSec || ''} />
        </form>
      </td>
      <td className="px-2 py-1">
        <form className="inline">
          <input
            type="number"
            step="0.1"
            name="volume"
            defaultValue={set.volume || ''}
            readOnly
            className="w-16 px-1.5 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-xs text-gray-500 cursor-not-allowed"
          />
          <input type="hidden" name="weightKg" value={set.weightKg || ''} />
          <input type="hidden" name="reps" value={set.reps || ''} />
          <input type="hidden" name="rir" value={set.rir || ''} />
          <input type="hidden" name="restSec" value={set.restSec || ''} />
        </form>
      </td>
      <td className="px-2 py-1">
        <form className="inline">
          <input
            type="number"
            name="restSec"
            defaultValue={set.restSec || ''}
            className="w-16 px-1.5 py-1 bg-[#111111] border border-[#1a1a1a] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            onBlur={handleBlur}
          />
          <input type="hidden" name="weightKg" value={set.weightKg || ''} />
          <input type="hidden" name="reps" value={set.reps || ''} />
          <input type="hidden" name="rir" value={set.rir || ''} />
          <input type="hidden" name="volume" value={set.volume || ''} />
        </form>
      </td>
      <td className="px-2 py-1">
        <button
          type="button"
          onClick={() => {
            if (confirm('이 세트를 삭제하시겠습니까?')) {
              setError(null);
              startTransition(async () => {
                try {
                  await deleteExerciseSet(set.id);
                  router.refresh();
                } catch (err: any) {
                  setError(err.message || '세트를 삭제하는 중 오류가 발생했습니다.');
                }
              });
            }
          }}
          disabled={isPending}
          className="text-gray-500 hover:text-gray-400 transition-colors text-xs px-1.5 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '처리 중...' : '삭제'}
        </button>
      </td>
    </tr>
    {error && (
      <tr>
        <td colSpan={7} className="px-2 py-1">
          <p className="text-red-400 text-xs">{error}</p>
        </td>
      </tr>
    )}
    </>
  );
}
