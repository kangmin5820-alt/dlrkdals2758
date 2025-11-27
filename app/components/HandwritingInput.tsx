'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface HandwritingInputProps {
  onSave: (imageDataUrl: string) => void;
  initialImage?: string | null;
  placeholder?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function HandwritingInput({
  onSave,
  initialImage,
  placeholder = '펜이나 손가락으로 작성해주세요',
  width = 800,
  height = 400,
  className = '',
}: HandwritingInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [color, setColor] = useState('#ffffff');
  const [hasContent, setHasContent] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);

  // Canvas 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 고해상도 지원
    const dpr = window.devicePixelRatio || 1;
    
    // 실제 픽셀 크기 (고해상도)
    const pixelWidth = width * dpr;
    const pixelHeight = height * dpr;
    
    // CSS 크기 설정
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // 실제 Canvas 크기 설정
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    
    // 스케일 조정
    ctx.scale(dpr, dpr);
    
    // 배경 설정
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);
    
    // 선 스타일 설정
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 초기 이미지 로드
    if (initialImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // 이미지를 Canvas 크기에 맞춰 그리기
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, width, height);
        
        // 이미지 비율 유지하면서 그리기
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;
        
        if (imgAspect > canvasAspect) {
          drawHeight = width / imgAspect;
          offsetY = (height - drawHeight) / 2;
        } else {
          drawWidth = height * imgAspect;
          offsetX = (width - drawWidth) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        setHasContent(true);
      };
      img.onerror = () => {
        console.error('이미지 로드 실패');
      };
      img.src = initialImage;
    }
  }, [width, height, color, lineWidth, initialImage]);

  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if ('touches' in e) {
      // 터치 이벤트 (손가락 또는 펜슬)
      const touch = e.touches[0] || (e.changedTouches && e.changedTouches[0]);
      if (!touch) return null;
      return {
        x: (touch.clientX - rect.left) * dpr,
        y: (touch.clientY - rect.top) * dpr,
      };
    } else {
      // 마우스 이벤트
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setHasContent(true);

    const dpr = window.devicePixelRatio || 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  }, [getCoordinates, color, lineWidth]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }, [isDrawing, getCoordinates]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  }, []);

  const saveCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 이미지를 Blob으로 변환
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Blob을 Data URL로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        onSave(imageDataUrl);
      };
      reader.readAsDataURL(blob);
    }, 'image/png', 0.9);
  }, [onSave]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    startDrawing(e);
  }, [startDrawing]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    draw(e);
  }, [draw]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  }, [stopDrawing]);

  const handleTouchCancel = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  }, [stopDrawing]);

  return (
    <div className={`relative ${className}`}>
      {/* 툴바 */}
      {showToolbar && (
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded p-1">
            <label className="text-xs text-gray-400">두께:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-400 w-6">{lineWidth}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded p-1">
            <label className="text-xs text-gray-400">색상:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-6 cursor-pointer"
            />
          </div>
          <button
            onClick={clearCanvas}
            disabled={!hasContent}
            className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded hover:bg-[#2a2a2a] transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            지우기
          </button>
          <button
            onClick={saveCanvas}
            disabled={!hasContent}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      )}

      {/* Canvas */}
      <div className="relative border border-[#1a1a1a] rounded bg-[#111111] overflow-hidden" style={{ touchAction: 'none' }}>
        <canvas
          ref={canvasRef}
          className="block cursor-crosshair"
          style={{ 
            width: `${width}px`, 
            maxWidth: '100%', 
            height: 'auto',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        />
        {!hasContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-600 text-xs">{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}

