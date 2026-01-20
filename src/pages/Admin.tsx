import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Feedback } from '../types/database.types';
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function Admin() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCanvases: 0,
    totalProjects: 0,
    activeSessions: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [profile]);

  const fetchAdminData = async () => {
    try {
      const [usersResult, canvasesResult, projectsResult, feedbackResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }),
        supabase.from('canvases').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalCanvases: canvasesResult.count || 0,
        totalProjects: projectsResult.count || 0,
        activeSessions: 0,
      });

      setUsers(usersResult.data || []);
      setFeedback(feedbackResult.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setFeedback(feedback.map((f) => (f.id === id ? { ...f, status: status as any } : f)));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-7 h-7 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Canvases</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalCanvases}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalProjects}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Feedback Items</p>
              <p className="text-3xl font-bold text-slate-900">{feedback.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Users</h2>
            <div className="space-y-3">
              {users.slice(0, 10).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{user.full_name || 'Unknown'}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        user.plan_type === 'free'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.plan_type}
                    </span>
                    {user.role === 'admin' && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Feedback</h2>
            <div className="space-y-3">
              {feedback.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            item.type === 'bug'
                              ? 'bg-red-100 text-red-700'
                              : item.type === 'feature'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {item.type}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            item.status === 'new'
                              ? 'bg-yellow-100 text-yellow-700'
                              : item.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {item.status !== 'resolved' && (
                      <>
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'in_progress')}
                          className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => updateFeedbackStatus(item.id, 'resolved')}
                          className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
