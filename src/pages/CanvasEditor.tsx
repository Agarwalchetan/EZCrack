import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Canvas } from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';
import { useRealtimeCollaboration } from '../hooks/useRealtimeCollaboration';
import CollaboratorCursors from '../components/CollaboratorCursors';
import CollaboratorList from '../components/CollaboratorList';
import VersionHistory from '../components/VersionHistory';
import { CanvasVersion } from '../types/database.types';
import {
  ArrowLeft,
  Save,
  Users,
  Pencil as PencilIcon,
  Square,
  Circle,
  Type,
  Eraser,
  Undo,
  Redo,
  Download,
  Trash2,
  Clock,
} from 'lucide-react';

type Tool = 'select' | 'pencil' | 'rectangle' | 'circle' | 'text' | 'eraser';

interface DrawElement {
  id: string;
  type: 'path' | 'rectangle' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: { x: number; y: number }[];
  text?: string;
  color: string;
  strokeWidth: number;
}

export default function CanvasEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('');
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<DrawElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  const { cursors, collaborators, sendCursorPosition, broadcastCanvasUpdate, userColor } =
    useRealtimeCollaboration(id || '', user?.id || '', profile?.full_name || 'Anonymous');

  useEffect(() => {
    if (id) {
      fetchCanvas();
    }
  }, [id]);

  useEffect(() => {
    redrawCanvas();
  }, [elements]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (id && canvas) {
        saveCanvas();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [id, canvas, title, elements]);

  const fetchCanvas = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCanvas(data);
        setTitle(data.title);
        if (data.canvas_data?.elements) {
          setElements(data.canvas_data.elements);
          setHistory([data.canvas_data.elements]);
          setHistoryStep(0);
        }
      }
    } catch (error) {
      console.error('Error fetching canvas:', error);
      navigate('/dashboard');
    }
  };

  const saveCanvas = async () => {
    if (!id || !canvas || !user) return;

    setSaving(true);
    try {
      const newVersion = canvas.version + 1;

      const { error: canvasError } = await supabase
        .from('canvases')
        .update({
          title,
          canvas_data: { elements },
          version: newVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (canvasError) throw canvasError;

      const { error: versionError } = await supabase
        .from('canvas_versions')
        .insert({
          canvas_id: id,
          version_number: newVersion,
          canvas_data: { elements },
          created_by: user.id,
        });

      if (versionError) throw versionError;

      setCanvas({ ...canvas, version: newVersion });
    } catch (error) {
      console.error('Error saving canvas:', error);
    } finally {
      setSaving(false);
    }
  };

  const restoreVersion = async (version: CanvasVersion) => {
    if (!id || !user) return;

    try {
      const restoredElements = version.canvas_data.elements || [];
      setElements(restoredElements);
      addToHistory(restoredElements);

      await saveCanvas();
      setShowVersions(false);
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  const addToHistory = (newElements: DrawElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      const newElements: DrawElement[] = [];
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (tool === 'pencil') {
      setCurrentPath([pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      sendCursorPosition(e.clientX - rect.left, e.clientY - rect.top);
    }

    if (!isDrawing) return;

    if (tool === 'pencil') {
      setCurrentPath([...currentPath, pos]);
      drawPreview(pos);
    } else if (tool === 'rectangle' || tool === 'circle') {
      drawPreview(pos);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;

    const pos = getMousePos(e);
    let newElement: DrawElement | null = null;

    if (tool === 'pencil' && currentPath.length > 0) {
      newElement = {
        id: Date.now().toString(),
        type: 'path',
        x: 0,
        y: 0,
        points: currentPath,
        color,
        strokeWidth,
      };
    } else if (tool === 'rectangle') {
      newElement = {
        id: Date.now().toString(),
        type: 'rectangle',
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(pos.x - startPos.x),
        height: Math.abs(pos.y - startPos.y),
        color,
        strokeWidth,
      };
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      newElement = {
        id: Date.now().toString(),
        type: 'circle',
        x: startPos.x,
        y: startPos.y,
        radius,
        color,
        strokeWidth,
      };
    }

    if (newElement) {
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      broadcastCanvasUpdate(newElements);
    }

    setIsDrawing(false);
    setCurrentPath([]);
    setStartPos(null);
  };

  const drawPreview = (currentPos: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !startPos) return;

    redrawCanvas();

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil' && currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        currentPos.x - startPos.x,
        currentPos.y - startPos.y
      );
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const redrawCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    elements.forEach((element) => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'path' && element.points && element.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        ctx.stroke();
      } else if (element.type === 'rectangle' && element.width && element.height) {
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      } else if (element.type === 'circle' && element.radius) {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${title}.png`;
    link.href = url;
    link.click();
  };

  const tools = [
    { id: 'pencil' as Tool, icon: PencilIcon, label: 'Pencil' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveCanvas}
                className="text-lg font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVersions(!showVersions)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Version History"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={saveCanvas}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={exportCanvas}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Export as PNG"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2 z-10">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`p-3 rounded-lg transition-colors ${
                tool === t.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={t.label}
            >
              <t.icon className="w-6 h-6" />
            </button>
          ))}

          <div className="my-4 w-10 border-t border-slate-200"></div>

          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-6 h-6" />
          </button>

          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="p-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-6 h-6" />
          </button>

          <button
            onClick={clearCanvas}
            className="p-3 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-6 h-6" />
          </button>

          <div className="mt-auto flex flex-col gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer"
              title="Color"
            />
            <select
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-10 h-10 text-xs border border-slate-300 rounded-lg cursor-pointer"
              title="Stroke Width"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-slate-100 flex items-center justify-center p-4 relative" ref={containerRef}>
          <CollaboratorList
            collaborators={collaborators}
            currentUserName={profile?.full_name || 'You'}
          />

          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
            className="bg-white shadow-2xl rounded-lg cursor-crosshair"
          />

          <CollaboratorCursors cursors={cursors} />
        </div>

        {showVersions && id && (
          <VersionHistory
            canvasId={id}
            onRestore={restoreVersion}
            onClose={() => setShowVersions(false)}
          />
        )}
      </div>
    </div>
  );
}
