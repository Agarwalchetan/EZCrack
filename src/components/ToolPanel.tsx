import { useCanvasStore } from '../store/canvasStore';
import {
  Pencil,
  Paintbrush,
  Square,
  Circle,
  ArrowRight,
  Type,
  Eraser,
  MousePointer,
  StickyNote,
  MessageSquare,
  Image as ImageIcon,
  Ruler,
  Minus,
} from 'lucide-react';
import { ToolType } from '../types/canvas.types';

interface ToolButtonProps {
  tool: ToolType;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function ToolButton({ tool, icon, label, active, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
        active
          ? 'bg-blue-100 text-blue-600 shadow-sm'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
      title={label}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default function ToolPanel() {
  const { activeTool, setActiveTool, toolSettings, setToolSettings } = useCanvasStore();

  const tools: Array<{ tool: ToolType; icon: React.ReactNode; label: string }> = [
    { tool: 'select', icon: <MousePointer className="w-5 h-5" />, label: 'Select' },
    { tool: 'pen', icon: <Pencil className="w-5 h-5" />, label: 'Pen' },
    { tool: 'brush', icon: <Paintbrush className="w-5 h-5" />, label: 'Brush' },
    { tool: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Eraser' },
    { tool: 'line', icon: <Minus className="w-5 h-5" />, label: 'Line' },
    { tool: 'rectangle', icon: <Square className="w-5 h-5" />, label: 'Rectangle' },
    { tool: 'circle', icon: <Circle className="w-5 h-5" />, label: 'Circle' },
    { tool: 'arrow', icon: <ArrowRight className="w-5 h-5" />, label: 'Arrow' },
    { tool: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
    { tool: 'sticky-note', icon: <StickyNote className="w-5 h-5" />, label: 'Sticky' },
    { tool: 'callout', icon: <MessageSquare className="w-5 h-5" />, label: 'Callout' },
    { tool: 'image', icon: <ImageIcon className="w-5 h-5" />, label: 'Image' },
    { tool: 'measure', icon: <Ruler className="w-5 h-5" />, label: 'Measure' },
  ];

  return (
    <div className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2 overflow-y-auto">
      {tools.map((t) => (
        <ToolButton
          key={t.tool}
          tool={t.tool}
          icon={t.icon}
          label={t.label}
          active={activeTool === t.tool}
          onClick={() => setActiveTool(t.tool)}
        />
      ))}

      <div className="w-full border-t border-slate-200 my-2"></div>

      <div className="px-2 w-full space-y-2">
        <div>
          <label className="text-xs text-slate-600 block mb-1">Color</label>
          <input
            type="color"
            value={toolSettings.color}
            onChange={(e) => setToolSettings({ color: e.target.value })}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs text-slate-600 block mb-1">Size</label>
          <input
            type="range"
            min="1"
            max="100"
            value={toolSettings.strokeWidth}
            onChange={(e) => setToolSettings({ strokeWidth: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-center text-slate-600 mt-1">
            {toolSettings.strokeWidth}px
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-600 block mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={toolSettings.opacity}
            onChange={(e) => setToolSettings({ opacity: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-center text-slate-600 mt-1">
            {Math.round(toolSettings.opacity * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
