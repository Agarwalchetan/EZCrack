import { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { CanvasElement, Point } from '../types/canvas.types';

interface EnhancedCanvasProps {
  width: number;
  height: number;
  onCursorMove?: (x: number, y: number) => void;
}

export default function EnhancedCanvas({ width, height, onCursorMove }: EnhancedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const {
    layers,
    activeLayerId,
    activeTool,
    toolSettings,
    zoom,
    pan,
    addElement,
    settings,
  } = useCanvasStore();

  useEffect(() => {
    renderCanvas();
  }, [layers, zoom, pan, settings.background]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground(ctx);

    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    layers
      .filter((l) => l.visible)
      .sort((a, b) => a.order - b.order)
      .forEach((layer) => {
        ctx.globalAlpha = layer.opacity;
        layer.elements.forEach((element) => {
          drawElement(ctx, element);
        });
      });

    ctx.restore();
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    if (settings.background === 'grid') {
      drawGrid(ctx, settings.gridSize);
    } else if (settings.background === 'dots') {
      drawDots(ctx, settings.gridSize);
    } else if (settings.background === 'lined') {
      drawLines(ctx, settings.gridSize);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = settings.gridColor;
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawDots = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.fillStyle = settings.gridColor;

    for (let x = 0; x <= width; x += size) {
      for (let y = 0; y <= height; y += size) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawLines = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = settings.gridColor;
    ctx.lineWidth = 0.5;

    for (let y = 0; y <= height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.globalAlpha = element.opacity;
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.fillColor || element.color;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (element.type) {
      case 'pen':
      case 'brush':
      case 'pencil':
      case 'marker':
      case 'highlighter':
        if (element.points && element.points.length > 1) {
          drawPath(ctx, element.points, element);
        }
        break;

      case 'line':
        if (element.points && element.points.length === 2) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          ctx.lineTo(element.points[1].x, element.points[1].y);
          ctx.stroke();
        }
        break;

      case 'rectangle':
        if (element.width && element.height) {
          if (element.fillColor) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
          }
          ctx.strokeRect(element.x, element.y, element.width, element.height);
        }
        break;

      case 'circle':
        if (element.radius) {
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
          if (element.fillColor) ctx.fill();
          ctx.stroke();
        }
        break;

      case 'arrow':
        if (element.points && element.points.length === 2) {
          drawArrow(ctx, element.points[0], element.points[1], element.strokeWidth);
        }
        break;

      case 'text':
        if (element.text) {
          ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text, element.x, element.y);
        }
        break;

      case 'sticky-note':
        drawStickyNote(ctx, element);
        break;

      case 'callout':
        drawCallout(ctx, element);
        break;
    }

    ctx.globalAlpha = 1;
  };

  const drawPath = (ctx: CanvasRenderingContext2D, points: Point[], element: CanvasElement) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (toolSettings.smoothing > 0 && points.length > 2) {
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    } else {
      for (let i = 1; i < points.length; i++) {
        if (element.pressure && points[i].pressure) {
          ctx.lineWidth = element.strokeWidth * points[i].pressure!;
        }
        ctx.lineTo(points[i].x, points[i].y);
      }
    }

    ctx.stroke();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, from: Point, to: Point, width: number) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLength = width * 5;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const drawStickyNote = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    const w = element.width || 150;
    const h = element.height || 150;

    ctx.fillStyle = element.fillColor || '#fef08a';
    ctx.fillRect(element.x, element.y, w, h);

    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.strokeRect(element.x, element.y, w, h);

    if (element.note) {
      ctx.fillStyle = '#713f12';
      ctx.font = `${element.fontSize || 14}px sans-serif`;
      ctx.fillText(element.note, element.x + 10, element.y + 25);
    }
  };

  const drawCallout = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    const w = element.width || 200;
    const h = element.height || 100;

    ctx.fillStyle = element.fillColor || '#ffffff';
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.strokeWidth;

    ctx.beginPath();
    ctx.roundRect(element.x, element.y, w, h, 8);
    ctx.fill();
    ctx.stroke();

    if (element.text) {
      ctx.fillStyle = '#000000';
      ctx.font = `${element.fontSize || 14}px sans-serif`;
      ctx.fillText(element.text, element.x + 10, element.y + 25);
    }
  };

  const getCanvasPoint = (e: React.MouseEvent | React.PointerEvent): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const pressure = 'pressure' in e ? e.pressure : 1;
    const tilt =
      'tiltX' in e && 'tiltY' in e ? { x: e.tiltX as number, y: e.tiltY as number } : undefined;

    return { x, y, pressure, tilt, timestamp: Date.now() };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setStartPoint(point);

    if (activeTool === 'pen' || activeTool === 'brush' || activeTool === 'pencil') {
      setCurrentPath([point]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const point = getCanvasPoint(e);

    if (onCursorMove) {
      onCursorMove(point.x, point.y);
    }

    if (!isDrawing) return;

    if (activeTool === 'pen' || activeTool === 'brush' || activeTool === 'pencil') {
      setCurrentPath((prev) => [...prev, point]);
      drawPreview();
    } else {
      drawPreview();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing || !startPoint) return;

    const point = getCanvasPoint(e);
    let newElement: CanvasElement | null = null;

    if (activeTool === 'pen' || activeTool === 'brush' || activeTool === 'pencil') {
      if (currentPath.length > 1) {
        newElement = {
          id: `element-${Date.now()}`,
          type: activeTool,
          layerId: activeLayerId,
          points: currentPath,
          x: 0,
          y: 0,
          color: toolSettings.color,
          strokeWidth: toolSettings.strokeWidth,
          opacity: toolSettings.opacity,
          pressure: toolSettings.pressureSensitivity,
        };
      }
    } else if (activeTool === 'line' || activeTool === 'arrow') {
      newElement = {
        id: `element-${Date.now()}`,
        type: activeTool,
        layerId: activeLayerId,
        points: [startPoint, point],
        x: 0,
        y: 0,
        color: toolSettings.color,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity,
      };
    } else if (activeTool === 'rectangle') {
      newElement = {
        id: `element-${Date.now()}`,
        type: 'rectangle',
        layerId: activeLayerId,
        x: Math.min(startPoint.x, point.x),
        y: Math.min(startPoint.y, point.y),
        width: Math.abs(point.x - startPoint.x),
        height: Math.abs(point.y - startPoint.y),
        color: toolSettings.color,
        fillColor: toolSettings.fillColor,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity,
      };
    } else if (activeTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
      );
      newElement = {
        id: `element-${Date.now()}`,
        type: 'circle',
        layerId: activeLayerId,
        x: startPoint.x,
        y: startPoint.y,
        radius,
        color: toolSettings.color,
        fillColor: toolSettings.fillColor,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity,
      };
    }

    if (newElement) {
      addElement(newElement);
    }

    setIsDrawing(false);
    setCurrentPath([]);
    setStartPoint(null);
    renderCanvas();
  };

  const drawPreview = () => {
    renderCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    ctx.strokeStyle = toolSettings.color;
    ctx.fillStyle = toolSettings.fillColor;
    ctx.lineWidth = toolSettings.strokeWidth;
    ctx.globalAlpha = toolSettings.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setIsDrawing(false)}
      className="touch-none"
      style={{
        cursor: activeTool === 'select' ? 'default' : 'crosshair',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
