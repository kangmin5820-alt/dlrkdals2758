'use client';

import { useState, useTransition } from 'react';
import HandwritingInput from './HandwritingInput';
import { useRouter } from 'next/navigation';

interface FeedbackInputProps {
  initialFeedback?: string | null;
  onSave: (formData: FormData) => Promise<void>;
  placeholder?: string;
}

// 피드백이 이미지를 포함하는지 확인
const isImageUrl = (text: string | null | undefined): boolean => {
  if (!text) return false;
  return text.startsWith('data:image/') || text.startsWith('<img');
};

// 피드백에서 이미지 URL 추출
const extractImageUrl = (feedback: string | null | undefined): string | null => {
  if (!feedback) return null;
  
  // Data URL인 경우
  if (feedback.startsWith('data:image/')) {
    return feedback;
  }
  
  // HTML img 태그인 경우
  const match = feedback.match(/<img[^>]+src="([^"]+)"/);
  if (match) {
    return match[1];
  }
  
  return null;
};

export default function FeedbackInput({ initialFeedback, onSave, placeholder }: FeedbackInputProps) {
  // 초기 모드 결정: 이미지가 있으면 필기 모드, 아니면 텍스트 모드
  const [inputMode, setInputMode] = useState<'text' | 'handwriting'>(() => {
    return isImageUrl(initialFeedback) ? 'handwriting' : 'text';
  });
  const [handwritingImage, setHandwritingImage] = useState<string | null>(extractImageUrl(initialFeedback || null));
  const [textValue, setTextValue] = useState<string>(() => {
    if (!initialFeedback) return '';
    if (isImageUrl(initialFeedback)) return '';
    return initialFeedback;
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleHandwritingSave = async (imageDataUrl: string) => {
    setHandwritingImage(imageDataUrl);
    
    // 이미지를 서버에 업로드
    try {
      // base64 데이터를 Blob으로 변환
      const response = await fetch(imageDataUrl);
      if (!response.ok) {
        throw new Error('이미지를 읽을 수 없습니다.');
      }
      const blob = await response.blob();
      
      // 파일 업로드
      const uploadFormData = new FormData();
      const filename = `handwriting-${Date.now()}.png`;
      uploadFormData.append('file', blob, filename);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }
      
      const uploadData = await uploadResponse.json();
      if (!uploadData.imageUrl) {
        throw new Error('업로드된 이미지 URL을 받을 수 없습니다.');
      }
      
      // 피드백에 이미지 URL을 HTML로 저장
      const formData = new FormData();
      formData.append('feedback', `<img src="${uploadData.imageUrl}" alt="필기" style="max-width: 100%; height: auto; display: block;" />`);
      
      setError(null);
      startTransition(async () => {
        try {
          await onSave(formData);
          router.refresh();
        } catch (err: any) {
          setError(err.message || '피드백을 저장하는 중 오류가 발생했습니다.');
        }
      });
    } catch (err: any) {
      setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
      console.error('업로드 오류:', err);
    }
  };

  const handleTextSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await onSave(formData);
        router.refresh();
      } catch (err: any) {
        setError(err.message || '피드백을 저장하는 중 오류가 발생했습니다.');
      }
    });
  };

  const hasImage = handwritingImage || isImageUrl(initialFeedback || null);

  return (
    <div className="space-y-2">
      {/* 입력 모드 선택 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setInputMode('text');
            setHandwritingImage(null);
          }}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            inputMode === 'text'
              ? 'bg-white/10 text-white border border-white/10'
              : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-300'
          }`}
        >
          텍스트 입력
        </button>
        <button
          type="button"
          onClick={() => setInputMode('handwriting')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            inputMode === 'handwriting'
              ? 'bg-white/10 text-white border border-white/10'
              : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-300'
          }`}
        >
          ✏️ 필기 입력
        </button>
      </div>

      {/* 텍스트 입력 모드 */}
      {inputMode === 'text' && (
        <form onSubmit={handleTextSubmit}>
          <textarea
            name="feedback"
            rows={4}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full px-2 py-1.5 bg-[#111111] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-600 text-xs transition-all resize-none"
            placeholder={placeholder || '피드백을 입력하세요...'}
          />
          <div className="mt-2 flex justify-end gap-1.5">
            <button
              type="submit"
              disabled={isPending}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors text-xs font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}

      {/* 필기 입력 모드 */}
      {inputMode === 'handwriting' && (
        <div>
          <HandwritingInput
            onSave={handleHandwritingSave}
            initialImage={extractImageUrl(initialFeedback || null)}
            placeholder={placeholder || '펜이나 손가락으로 작성해주세요'}
            width={800}
            height={400}
            className="w-full"
          />
          {hasImage && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1">저장된 필기:</p>
              <div className="border border-[#1a1a1a] rounded overflow-hidden">
                {handwritingImage ? (
                  <img 
                    src={handwritingImage} 
                    alt="필기" 
                    className="max-w-full h-auto bg-white"
                  />
                ) : initialFeedback && isImageUrl(initialFeedback) ? (
                  <div 
                    className="bg-[#111111] p-2"
                    dangerouslySetInnerHTML={{ __html: initialFeedback }}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}

