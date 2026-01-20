import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { transformCanvasData } from '../lib/canvasDataTransform';
import { Canvas } from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';
import { useCanvasStore } from '../store/canvasStore';
import { useRealtimeCollaboration } from '../hooks/useRealtimeCollaboration';
import EnhancedCanvas from '../components/EnhancedCanvas';
import LayersPanel from '../components/LayersPanel';
import ToolPanel from '../components/ToolPanel';
import CollaboratorList from '../components/CollaboratorList';
import VersionHistory from '../components/VersionHistory';
import { CanvasVersion } from '../types/database.types';
import {
  ArrowLeft,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  Settings,
  Grid,
  Layers,
} from 'lucide-react';

export default function AdvancedCanvasEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLayers, setShowLayers] = useState(true);

  const {
    layers,
    settings,
    zoom,
    setZoom,
    updateSettings,
    loadCanvas: loadCanvasState,
    resetCanvas,
  } = useCanvasStore();

  const { cursors, collaborators, sendCursorPosition } = useRealtimeCollaboration(
    id || '',
    user?.id || '',
    profile?.full_name || 'Anonymous'
  );

  useEffect(() => {
    if (id) {
      fetchCanvas();
    }

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveCanvas();
            break;
          case 'z':
            e.preventDefault();
            useCanvasStore.getState().undo();
            break;
          case 'y':
            e.preventDefault();
            useCanvasStore.getState().redo();
            break;
          case '+':
          case '=':
            e.preventDefault();
            setZoom(zoom * 1.2);
            break;
          case '-':
            e.preventDefault();
            setZoom(zoom * 0.8);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [id, zoom]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (id && canvas) {
        saveCanvas();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [id, canvas, title, layers]);

  const fetchCanvas = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        console.error('Canvas not found');
        navigate('/dashboard');
        return;
      }

      setCanvas(data);
      setTitle(data.title);

      const transformedData = transformCanvasData(data.canvas_data);
      loadCanvasState(transformedData);
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
          canvas_data: { layers },
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
          canvas_data: { layers },
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
      if (version.canvas_data?.layers) {
        loadCanvasState({ layers: version.canvas_data.layers });
        await saveCanvas();
        setShowVersions(false);
      }
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  const exportCanvas = async (format: 'png' | 'svg' | 'pdf') => {
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 flex-shrink-0 z-20">
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
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Zoom Out (Ctrl+-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-slate-700 min-w-[4rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(10, zoom * 1.2))}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Zoom In (Ctrl++)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Canvas Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowLayers(!showLayers)}
                className={`p-2 rounded-lg transition-colors ${
                  showLayers ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle Layers Panel"
              >
                <Layers className="w-5 h-5" />
              </button>

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

              <div className="relative group">
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => exportCanvas('png')}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg"
                  >
                    Export as PNG
                  </button>
                  <button
                    onClick={() => exportCanvas('svg')}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Export as SVG
                  </button>
                  <button
                    onClick={() => exportCanvas('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 last:rounded-b-lg"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        <ToolPanel />

        <div className="flex-1 relative overflow-hidden">
          <CollaboratorList
            collaborators={collaborators}
            currentUserName={profile?.full_name || 'You'}
          />

          {showSettings && (
            <div className="absolute top-4 left-4 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-10">
              <h3 className="font-semibold text-slate-900 mb-4">Canvas Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Background
                  </label>
                  <select
                    value={settings.background}
                    onChange={(e) =>
                      updateSettings({ background: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="white">White</option>
                    <option value="transparent">Transparent</option>
                    <option value="grid">Grid</option>
                    <option value="dots">Dots</option>
                    <option value="lined">Lined</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.snapToGrid}
                      onChange={(e) => updateSettings({ snapToGrid: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Snap to Grid</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.showRuler}
                      onChange={(e) => updateSettings({ showRuler: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">Show Ruler</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center p-4 bg-slate-100">
            <EnhancedCanvas
              width={settings.width}
              height={settings.height}
              onCursorMove={sendCursorPosition}
            />
          </div>
        </div>

        {showLayers && <LayersPanel />}

        {showVersions && id && (
          <VersionHistory
            canvasId={id}
            onRestore={restoreVersion}
            onClose={() => setShowVersions(false)}
          />
        )}
      </div>

      <div className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span>Canvas: {settings.width}x{settings.height}px</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Layers: {layers.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Shortcuts: Ctrl+S (Save) | Ctrl+Z (Undo) | Ctrl+Y (Redo)</span>
        </div>
      </div>
    </div>
  );
}
