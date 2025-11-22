'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addMeal, updateMeal, deleteMeal, updateDietGuideMemo } from '../actions';
import { DietGuide, Meal } from '@prisma/client';

type DietGuideWithMeals = DietGuide & {
  meals: Meal[];
};

export default function DietTab({
  memberId,
  dietGuide,
}: {
  memberId: number;
  dietGuide: DietGuideWithMeals | null;
}) {
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const editingMeal = editingMealId
    ? dietGuide?.meals.find((m) => m.id === editingMealId)
    : null;

  const totalCarbs = dietGuide?.meals.reduce((sum, meal) => sum + meal.carbs, 0) || 0;
  const totalProtein = dietGuide?.meals.reduce((sum, meal) => sum + meal.protein, 0) || 0;
  const totalFat = dietGuide?.meals.reduce((sum, meal) => sum + meal.fat, 0) || 0;
  const totalCalories = dietGuide?.meals.reduce((sum, meal) => sum + meal.calories, 0) || 0;

  return (
    <div className="space-y-4" style={{ pointerEvents: 'auto' }}>
      {/* 식사 목록 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-white">식사 목록</h3>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setEditingMealId(null);
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
          >
            + 식사 추가
          </button>
        </div>

        {/* 식사 추가/수정 폼 */}
        {showAddForm && (
          <div className="mb-3 p-3 bg-[#111111] border border-[#1a1a1a] rounded">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                const formData = new FormData(e.currentTarget);
                startTransition(async () => {
                  try {
                    if (editingMealId) {
                      await updateMeal(editingMealId, memberId, formData);
                      setShowAddForm(false);
                      setEditingMealId(null);
                      router.refresh();
                    } else {
                      await addMeal(memberId, formData);
                      setShowAddForm(false);
                      router.refresh();
                    }
                  } catch (err: any) {
                    setError(err.message || '식사를 저장하는 중 오류가 발생했습니다.');
                  }
                });
              }}
              className="space-y-2"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  식사명
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="예: 아침식사, 점심식사"
                  defaultValue={editingMeal?.name || ''}
                  className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    탄수화물 (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="carbs"
                    required
                    defaultValue={editingMeal?.carbs || ''}
                    className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    단백질 (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="protein"
                    required
                    defaultValue={editingMeal?.protein || ''}
                    className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    지방 (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="fat"
                    required
                    defaultValue={editingMeal?.fat || ''}
                    className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    칼로리 (kcal)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="calories"
                    required
                    defaultValue={editingMeal?.calories || ''}
                    className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                >
                  {isPending ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMealId(null);
                    setError(null);
                  }}
                  disabled={isPending}
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                >
                  취소
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
            </form>
          </div>
        )}

        {/* 식사 목록 테이블 */}
        {dietGuide && dietGuide.meals.length > 0 ? (
          <div className="overflow-x-auto rounded border border-[#1a1a1a]">
            <table className="min-w-full bg-[#0a0a0a]">
              <thead className="bg-black">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    식사명
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    탄수화물 (g)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    단백질 (g)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    지방 (g)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    칼로리 (kcal)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#0a0a0a] divide-y divide-[#1a1a1a]">
                {dietGuide.meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-[#111111] transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                      {meal.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                      {meal.carbs.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                      {meal.protein.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                      {meal.fat.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                      {meal.calories.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMealId(meal.id);
                            setShowAddForm(true);
                          }}
                          className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('이 식사를 삭제하시겠습니까?')) {
                              setError(null);
                              startTransition(async () => {
                                try {
                                  await deleteMeal(meal.id, memberId);
                                  router.refresh();
                                } catch (err: any) {
                                  setError(err.message || '식사를 삭제하는 중 오류가 발생했습니다.');
                                }
                              });
                            }
                          }}
                          disabled={isPending}
                          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                        >
                          {isPending ? '처리 중...' : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* 합계 행 */}
                <tr className="bg-[#111111] font-semibold">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-white">합계</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                    {totalCarbs.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                    {totalProtein.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                    {totalFat.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-white">
                    {totalCalories.toFixed(1)}
                  </td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-xs border border-[#1a1a1a] rounded bg-[#0a0a0a]">
            등록된 식사가 없습니다.
          </div>
        )}
      </div>

      {/* 메모 섹션 */}
      <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
        <h3 className="text-sm font-semibold text-white mb-2">식단 가이드라인 메모</h3>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              try {
                await updateDietGuideMemo(memberId, formData);
                router.refresh();
              } catch (err: any) {
                setError(err.message || '메모를 저장하는 중 오류가 발생했습니다.');
              }
            });
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <textarea
            name="memo"
            rows={10}
            defaultValue={dietGuide?.memo || ''}
            placeholder="식단 가이드라인에 대한 메모를 입력하세요..."
            className="w-full px-3 py-2 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs placeholder-gray-600 transition-all resize-none"
          />
          <div className="mt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors cursor-pointer font-semibold text-xs border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            >
              {isPending ? '저장 중...' : '메모 저장'}
            </button>
            {error && (
              <p className="text-red-400 text-xs mt-1">{error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

