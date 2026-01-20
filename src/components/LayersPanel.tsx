import { useCanvasStore } from '../store/canvasStore';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, GripVertical } from 'lucide-react';

export default function LayersPanel() {
  const {
    layers,
    activeLayerId,
    addLayer,
    removeLayer,
    setActiveLayer,
    updateLayer,
  } = useCanvasStore();

  return (
    <div className="w-64 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Layers</h3>
          <button
            onClick={() => addLayer()}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Add Layer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
              activeLayerId === layer.id
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
              <GripVertical className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                updateLayer(layer.id, { visible: !layer.visible });
              }}
              className="flex-shrink-0"
            >
              {layer.visible ? (
                <Eye className="w-4 h-4 text-slate-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={layer.name}
                onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm font-medium text-slate-900 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              />
              <p className="text-xs text-slate-500">
                {layer.elements.length} elements
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLayer(layer.id, { locked: !layer.locked });
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                {layer.locked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${layer.name}"?`)) {
                      removeLayer(layer.id);
                    }
                  }}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-200 text-xs text-slate-600">
        <p>Active: {layers.find((l) => l.id === activeLayerId)?.name}</p>
        <p className="mt-1">Total: {layers.length} layers</p>
      </div>
    </div>
  );
}
