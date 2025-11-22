'use client';

import { addInbodyRecord } from '@/app/members/[id]/actions';
import { Member, InbodyRecord } from '@prisma/client';
import { useState } from 'react';

type MemberWithInbody = Member & {
  inbodyRecords: InbodyRecord[];
};

export default function InbodyTab({ member }: { member: MemberWithInbody }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;
    let imageUrl = '';

    if (file && file.size > 0) {
      // 파일 업로드
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('파일 업로드에 실패했습니다.');
          }
          return response.json();
        })
        .then((data) => {
          imageUrl = data.imageUrl;
          return processInbodyRecord(formData, imageUrl);
        })
        .catch((error) => {
          console.error('업로드 오류:', error);
          setUploadError('파일 업로드 중 오류가 발생했습니다.');
          setUploading(false);
        });
    } else {
      // 파일이 없으면 기존 imageUrl 사용 (URL 입력 필드)
      imageUrl = formData.get('imageUrl') as string || '';
      if (!imageUrl) {
        setUploadError('이미지를 선택하거나 URL을 입력해주세요.');
        setUploading(false);
        return;
      }
      processInbodyRecord(formData, imageUrl);
    }
  }

  function processInbodyRecord(formData: FormData, imageUrl: string) {
    const recordFormData = new FormData();
    recordFormData.append('date', formData.get('date') as string);
    recordFormData.append('imageUrl', imageUrl);

    addInbodyRecord(member.id, recordFormData).then(() => {
      window.location.reload();
    }).catch((error) => {
      console.error('기록 추가 오류:', error);
      setUploadError('인바디 기록 추가 중 오류가 발생했습니다.');
      setUploading(false);
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-white mb-2">인바디 기록 추가</h3>
        <form onSubmit={handleSubmit} className="bg-[#111111] p-3 rounded border border-[#1a1a1a]">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                날짜
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white text-xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                이미지 업로드
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 text-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                또는 URL 입력:
              </p>
              <input
                type="text"
                name="imageUrl"
                placeholder="이미지 URL"
                className="mt-1 w-full px-2 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-600 text-xs transition-all"
              />
            </div>
          </div>

          {uploadError && (
            <div className="mb-3 p-2 bg-[#1a0a0a] border border-[#2a1a1a] rounded text-gray-400 text-xs">
              {uploadError}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold border border-white/10"
          >
            {uploading ? '업로드 중...' : '추가'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-sm font-bold text-white mb-2">인바디 기록 목록</h3>
        {member.inbodyRecords.length === 0 ? (
          <div className="text-center py-6 bg-[#111111] rounded border border-[#1a1a1a]">
            <p className="text-gray-500 text-xs">인바디 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {member.inbodyRecords.map((record) => (
              <div
                key={record.id}
                className="border border-[#1a1a1a] rounded p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {new Date(record.date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {record.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={record.imageUrl}
                      alt="인바디 기록"
                      className="max-w-md rounded border border-[#1a1a1a]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
