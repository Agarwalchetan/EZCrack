import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CanvasVersion } from '../types/database.types';
import { Clock, RotateCcw, X } from 'lucide-react';

interface VersionHistoryProps {
  canvasId: string;
  onRestore: (version: CanvasVersion) => void;
  onClose: () => void;
}

export default function VersionHistory({ canvasId, onRestore, onClose }: VersionHistoryProps) {
  const [versions, setVersions] = useState<CanvasVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [canvasId]);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('canvas_versions')
        .select('*')
        .eq('canvas_id', canvasId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRestore = (version: CanvasVersion) => {
    if (confirm('Are you sure you want to restore this version? Your current work will be saved as a new version.')) {
      onRestore(version);
    }
  };

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Version History</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">No version history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-700">
                        Version {version.version_number}
                      </span>
                      {index === 0 && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{formatDate(version.created_at)}</p>
                  </div>
                  {index !== 0 && (
                    <button
                      onClick={() => handleRestore(version)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Restore this version"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
