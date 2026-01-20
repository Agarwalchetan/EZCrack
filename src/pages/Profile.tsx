import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  Cloud,
  Download,
  Trash2,
  Camera,
  Save,
  ArrowLeft,
  Key,
  Activity,
  CreditCard,
} from 'lucide-react';

type TabType = 'profile' | 'account' | 'privacy' | 'integrations' | 'billing' | 'activity';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState({
    email: true,
    collaboration: true,
    updates: false,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      const { data: canvases } = await supabase
        .from('canvases')
        .select('*')
        .eq('user_id', user.id);

      const exportData = {
        user: profile,
        canvases,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ezdraw-data-${Date.now()}.json`;
      a.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
      )
    ) {
      return;
    }

    if (
      prompt('Type "DELETE" to confirm account deletion') !== 'DELETE'
    ) {
      return;
    }

    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'account' as TabType, label: 'Account', icon: <Shield className="w-4 h-4" /> },
    { id: 'privacy' as TabType, label: 'Privacy', icon: <Key className="w-4 h-4" /> },
    { id: 'integrations' as TabType, label: 'Integrations', icon: <Cloud className="w-4 h-4" /> },
    { id: 'billing' as TabType, label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'activity' as TabType, label: 'Activity', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Information</h2>
                    <p className="text-slate-600">Update your personal information and profile picture</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                        {fullName?.charAt(0) || 'U'}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-slate-50">
                        <Camera className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{fullName || 'No name set'}</h3>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Plan: <span className="font-medium capitalize">{profile?.plan_type}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Email cannot be changed. Contact support if you need to update it.
                      </p>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h2>
                    <p className="text-slate-600">Manage your account security and preferences</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900">Theme Preference</h3>
                          <p className="text-sm text-slate-600">Choose your preferred theme</p>
                        </div>
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                      <h3 className="font-medium text-slate-900">Notification Preferences</h3>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Email notifications</span>
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) =>
                            setNotifications({ ...notifications, email: e.target.checked })
                          }
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Collaboration updates</span>
                        <input
                          type="checkbox"
                          checked={notifications.collaboration}
                          onChange={(e) =>
                            setNotifications({ ...notifications, collaboration: e.target.checked })
                          }
                          className="rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Product updates</span>
                        <input
                          type="checkbox"
                          checked={notifications.updates}
                          onChange={(e) =>
                            setNotifications({ ...notifications, updates: e.target.checked })
                          }
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Privacy & Data</h2>
                    <p className="text-slate-600">Control your data and privacy settings</p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleExportData}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-slate-600" />
                        <div className="text-left">
                          <h3 className="font-medium text-slate-900">Export Your Data</h3>
                          <p className="text-sm text-slate-600">
                            Download all your canvases and account data
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">Export</span>
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div className="text-left">
                          <h3 className="font-medium text-red-900">Delete Account</h3>
                          <p className="text-sm text-red-700">
                            Permanently delete your account and all data
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-red-600 font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Integrations</h2>
                    <p className="text-slate-600">Connect with third-party services</p>
                  </div>

                  <div className="space-y-4">
                    {['Google Drive', 'Dropbox', 'OneDrive', 'Slack', 'Notion'].map((service) => (
                      <div key={service} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-slate-900">{service}</h3>
                          <p className="text-sm text-slate-600">Not connected</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Billing & Subscription</h2>
                    <p className="text-slate-600">Manage your subscription and payment methods</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 capitalize">
                          {profile?.plan_type} Plan
                        </h3>
                        <p className="text-sm text-slate-600">Active subscription</p>
                      </div>
                      <Link
                        to="/pricing"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Upgrade
                      </Link>
                    </div>
                    <p className="text-slate-600">
                      {profile?.plan_type === 'free'
                        ? 'You are on the free plan. Upgrade to unlock premium features.'
                        : 'Thank you for being a premium member!'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Activity Log</h2>
                    <p className="text-slate-600">View your recent account activity</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { action: 'Logged in', time: '2 hours ago', icon: <Shield /> },
                      { action: 'Created new canvas', time: '5 hours ago', icon: <User /> },
                      { action: 'Updated profile', time: '1 day ago', icon: <User /> },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-white rounded-lg">{item.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.action}</p>
                          <p className="text-sm text-slate-600">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
