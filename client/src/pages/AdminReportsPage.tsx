import React, { useState, useEffect } from 'react';
import { Shield, Flag, Eye, Check, X, Ban, Trash2, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

interface Report {
  id: string;
  reporter: {
    id: string;
    name: string;
    username: string;
  };
  reportedUser: {
    id: string;
    name: string;
    username: string;
  };
  post?: {
    id: string;
    content: string;
    created_at: string;
  };
  duaRequest?: {
    id: string;
    title: string;
    content: string;
    created_at: string;
  };
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
}

const AdminReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const reasonLabels = {
    spam: 'Spam veya Reklam',
    inappropriate: 'Uygunsuz İçerik',
    harassment: 'Taciz veya Zorbalık',
    fake: 'Sahte Bilgi',
    other: 'Diğer'
  };

  const statusLabels = {
    pending: 'Beklemede',
    reviewed: 'İncelendi',
    resolved: 'Çözüldü',
    dismissed: 'Reddedildi'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes: adminNotes.trim() || undefined
        })
      });

      if (response.ok) {
        setReports(prev => prev.map(report => 
          report.id === reportId 
            ? { ...report, status: status as any, admin_notes: adminNotes.trim() || undefined }
            : report
        ));
        setSelectedReport(null);
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Failed to update report status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const banUser = async (userId: string, reason: string, banType: 'temporary' | 'permanent' = 'temporary') => {
    try {
      setActionLoading(true);
      const expiresAt = banType === 'temporary' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;
      
      const response = await fetch(`/api/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          banned_by: user?.id,
          reason,
          ban_type: banType,
          expires_at: expiresAt
        })
      });

      if (response.ok) {
        alert(`Kullanıcı ${banType === 'permanent' ? 'kalıcı olarak' : '7 gün'} banlandı.`);
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContent = async (reportId: string, contentType: 'post' | 'dua-request', contentId: string) => {
    try {
      setActionLoading(true);
      const endpoint = contentType === 'post' ? `/api/posts/${contentId}` : `/api/dua-requests/${contentId}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      if (response.ok) {
        await updateReportStatus(reportId, 'resolved');
        alert('İçerik silindi ve şikayet çözüldü olarak işaretlendi.');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center py-12">
            <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Erişim Reddedildi
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bu sayfaya erişim için admin yetkisi gerekli.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Flag className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Şikayet Yönetimi
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kullanıcı şikayetlerini incele ve yönet
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-yellow-600" size={20} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Beklemede</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Eye className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">İncelenen</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'reviewed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Check className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Çözülen</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Flag className="text-red-600" size={20} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Şikayetler yükleniyor...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Flag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz şikayet yok
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Kullanıcılardan gelen şikayetler burada görünecek.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                        {statusLabels[report.status]}
                      </div>
                      <div className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-full text-xs font-medium">
                        {reasonLabels[report.reason as keyof typeof reasonLabels]}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Şikayet Eden:</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {report.reporter.name} (@{report.reporter.username})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Şikayet Edilen:</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {report.reportedUser.name} (@{report.reportedUser.username})
                        </p>
                      </div>
                    </div>

                    {report.description && (
                      <div className="mt-3">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Açıklama:</p>
                        <p className="text-gray-900 dark:text-white text-sm">{report.description}</p>
                      </div>
                    )}

                    {/* Content Preview */}
                    {(report.post || report.duaRequest) && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                          Şikayet Edilen İçerik:
                        </p>
                        {report.post && (
                          <p className="text-gray-900 dark:text-white text-sm line-clamp-2">
                            {report.post.content}
                          </p>
                        )}
                        {report.duaRequest && (
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {report.duaRequest.title}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                              {report.duaRequest.content}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {report.admin_notes && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-blue-600 dark:text-blue-400 text-xs mb-1">Admin Notları:</p>
                        <p className="text-blue-900 dark:text-blue-200 text-sm">{report.admin_notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{formatDate(report.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      İncele
                    </button>
                    
                    {(report.post || report.duaRequest) && (
                      <button
                        onClick={() => deleteContent(
                          report.id, 
                          report.post ? 'post' : 'dua-request',
                          report.post?.id || report.duaRequest?.id || ''
                        )}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        İçeriği Sil
                      </button>
                    )}
                    
                    <button
                      onClick={() => banUser(report.reportedUser.id, `Şikayet sebebi: ${reasonLabels[report.reason as keyof typeof reasonLabels]}`, 'temporary')}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                      7 Gün Ban
                    </button>
                    
                    <button
                      onClick={() => banUser(report.reportedUser.id, `Şikayet sebebi: ${reasonLabels[report.reason as keyof typeof reasonLabels]}`, 'permanent')}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-red-700 text-white rounded text-sm hover:bg-red-800 disabled:opacity-50 transition-colors"
                    >
                      Kalıcı Ban
                    </button>
                    
                    <button
                      onClick={() => updateReportStatus(report.id, 'dismissed')}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Report Review Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Şikayet İnceleme
                  </h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Notları
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="İnceleme notlarınızı yazın..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => updateReportStatus(selectedReport.id, 'reviewed')}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    İncelendi Olarak İşaretle
                  </button>
                  <button
                    onClick={() => updateReportStatus(selectedReport.id, 'resolved')}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    Çözüldü Olarak İşaretle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;