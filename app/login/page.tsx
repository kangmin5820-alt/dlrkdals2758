import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-3">
      <div className="w-full max-w-md">
        <div className="bg-[#0a0a0a] p-6 rounded border border-[#1a1a1a]">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            PT 트레이너 로그인
          </h1>
          <p className="text-gray-500 text-xs text-center mb-6">
            회원 관리 시스템에 로그인하세요
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

