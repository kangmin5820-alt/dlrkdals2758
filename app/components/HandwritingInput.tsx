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
  const containerRef = useRef<HTMLDivElement>(null);
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

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
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

  // 좌표 가져오기 (공통)
  const getPoint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // 그리기 함수
  const drawLine = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }, [color, lineWidth]);

  // 그리기 시작
  const startDraw = useCallback((x: number, y: number) => {
    setIsDrawing(true);
    setHasContent(true);
    lastPointRef.current = { x, y };
    
    // 첫 점을 작은 원으로 표시
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [color, lineWidth]);

  // 그리기 계속
  const continueDraw = useCallback((x: number, y: number) => {
    if (!isDrawing || !lastPointRef.current) return;
    
    drawLine(lastPointRef.current.x, lastPointRef.current.y, x, y);
    lastPointRef.current = { x, y };
  }, [isDrawing, drawLine]);

  // 그리기 종료
  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  // 마우스 이벤트
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const point = getPoint(e.clientX, e.clientY);
    if (point) {
      startDraw(point.x, point.y);
    }
  }, [getPoint, startDraw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();
    const point = getPoint(e.clientX, e.clientY);
    if (point) {
      continueDraw(point.x, point.y);
    }
  }, [isDrawing, getPoint, continueDraw]);

  const handleMouseUp = useCallback(() => {
    endDraw();
  }, [endDraw]);

  const handleMouseLeave = useCallback(() => {
    endDraw();
  }, [endDraw]);

  // 터치 이벤트
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      const point = getPoint(touch.clientX, touch.clientY);
      if (point) {
        startDraw(point.x, point.y);
      }
    }
  }, [getPoint, startDraw]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      const point = getPoint(touch.clientX, touch.clientY);
      if (point) {
        continueDraw(point.x, point.y);
      }
    }
  }, [isDrawing, getPoint, continueDraw]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    endDraw();
  }, [endDraw]);

  const handleTouchCancel = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    endDraw();
  }, [endDraw]);

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
    <div className={`relative ${className}`} ref={containerRef}>
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
          userSelect: 'none',
          position: 'relative'
        }}
      >
        <canvas
          ref={canvasRef}
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
            display: 'block',
            position: 'relative',
            zIndex: 1
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
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <p className="text-gray-600 text-xs">{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}
