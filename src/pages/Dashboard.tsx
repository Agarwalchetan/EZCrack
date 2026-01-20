import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Canvas } from '../types/database.types';
import { Plus, FileText, LogOut, User, Pencil, Trash2, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCanvases();
  }, [user]);

  const fetchCanvases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('canvases')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCanvases(data || []);
    } catch (error) {
      console.error('Error fetching canvases:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCanvas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('canvases')
        .insert({
          user_id: user.id,
          title: 'Untitled Canvas',
          canvas_data: { elements: [] },
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        navigate(`/canvas/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating canvas:', error);
    }
  };

  const deleteCanvas = async (id: string) => {
    if (!confirm('Are you sure you want to delete this canvas?')) return;

    try {
      const { error } = await supabase
        .from('canvases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCanvases(canvases.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting canvas:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pencil className="w-7 h-7 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">EZdraw</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/projects"
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{profile?.full_name || 'Profile'}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Canvases</h1>
            <p className="text-slate-600">Create and manage your drawing boards</p>
          </div>
          <button
            onClick={createCanvas}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Canvas</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : canvases.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No canvases yet</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first canvas</p>
            <button
              onClick={createCanvas}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Canvas</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                <Link to={`/canvas/${canvas.id}`}>
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-b border-slate-200 group-hover:from-blue-50 group-hover:to-cyan-50 transition-colors">
                    <Pencil className="w-12 h-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/canvas/${canvas.id}`}>
                    <h3 className="font-semibold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {canvas.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(canvas.updated_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/canvas/${canvas.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => deleteCanvas(canvas.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete canvas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
