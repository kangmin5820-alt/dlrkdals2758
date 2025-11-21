import { addExercise } from './actions';
import ExerciseCard from './ExerciseCard';

export default function ExerciseList({ session }: { session: any }) {
  return (
    <div className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold text-white">오늘의 운동</h2>
        <form action={addExercise.bind(null, session.id)} className="flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="운동 종목 이름"
            required
            className="px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-600 text-xs transition-all"
          />
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors text-xs font-semibold border border-white/10"
          >
            + 추가
          </button>
        </form>
      </div>

      {session.exercises.length === 0 ? (
        <div className="text-center py-4 bg-[#111111] rounded border border-[#1a1a1a]">
          <p className="text-gray-500 text-xs">
            운동이 없습니다. 운동을 추가해주세요.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {session.exercises.map((exercise: any) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
