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
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Canvas 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 고해상도 지원
    const dpr = window.devicePixelRatio || 1;
    
    // CSS 크기 설정
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // 실제 Canvas 크기 설정 (고해상도)
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // 스케일 조정
    ctx.scale(dpr, dpr);
    
    // 배경 설정
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);

    // 초기 이미지 로드
    if (initialImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
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
  }, [width, height, initialImage]);

  // 좌표 가져오기 (마우스)
  const getMousePos = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // 좌표 가져오기 (터치)
  const getTouchPos = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return null;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  // 그리기 함수
  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      // 이전 점에서 현재 점까지 선 그리기
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // 첫 점은 작은 원으로 표시
      ctx.beginPath();
      ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    lastPointRef.current = { x, y };
  }, [color, lineWidth]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getMousePos(e.nativeEvent);
    if (!pos) return;
    
    setIsDrawing(true);
    setHasContent(true);
    lastPointRef.current = pos;
    draw(pos.x, pos.y);
  }, [getMousePos, draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getMousePos(e.nativeEvent);
    if (!pos) return;
    draw(pos.x, pos.y);
  }, [isDrawing, getMousePos, draw]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e.nativeEvent);
    if (!pos) return;
    
    setIsDrawing(true);
    setHasContent(true);
    lastPointRef.current = pos;
    draw(pos.x, pos.y);
  }, [getTouchPos, draw]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getTouchPos(e.nativeEvent);
    if (!pos) return;
    draw(pos.x, pos.y);
  }, [isDrawing, getTouchPos, draw]);

  const handleTouchEnd = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  const handleTouchCancel = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  // 지우기
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);
    setHasContent(false);
    lastPointRef.current = null;
  }, [width, height]);

  // 저장
  const saveCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageDataUrl = canvas.toDataURL('image/png', 0.9);
      onSave(imageDataUrl);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
    }
  }, [onSave]);

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
            type="button"
            onClick={clearCanvas}
            disabled={!hasContent}
            className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded hover:bg-[#2a2a2a] transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            지우기
          </button>
          <button
            type="button"
            onClick={saveCanvas}
            disabled={!hasContent}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-xs font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      )}

      {/* Canvas */}
      <div 
        className="relative border border-[#1a1a1a] rounded bg-[#111111] overflow-hidden" 
        style={{ 
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          className="block"
          style={{ 
            width: `${width}px`, 
            maxWidth: '100%', 
            height: `${height}px`,
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            msTouchAction: 'none',
            cursor: 'crosshair',
            display: 'block'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
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
