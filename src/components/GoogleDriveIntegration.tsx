'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Search, 
  Trash2, 
  Share2, 
  BarChart3, 
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react';
import { apiClient } from '../lib/api';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink: string;
}

interface FolderStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: Record<string, number>;
  lastModified: string;
}

export default function GoogleDriveIntegration() {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [stats, setStats] = useState<FolderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    fileName: '',
    content: '',
    mimeType: 'text/plain'
  });

  // Fetch files from Google Drive
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/google-drive/files');
      if (response.data.success) {
        setFiles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch folder statistics
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/google-drive/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Search files
  const searchFiles = async () => {
    if (!searchQuery.trim()) {
      fetchFiles();
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get('/api/google-drive/search', {
        params: { query: searchQuery }
      });
      if (response.data.success) {
        setFiles(response.data.data);
      }
    } catch (error) {
      console.error('Error searching files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const uploadFile = async () => {
    if (!uploadData.fileName || !uploadData.content) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/google-drive/upload', uploadData);
      if (response.data.success) {
        setShowUpload(false);
        setUploadData({ fileName: '', content: '', mimeType: 'text/plain' });
        fetchFiles();
        alert('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  // Delete file
  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    setLoading(true);
    try {
      const response = await apiClient.delete(`/api/google-drive/files/${fileId}`);
      if (response.data.success) {
        fetchFiles();
        alert('File deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    } finally {
      setLoading(false);
    }
  };

  // Download file
  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const response = await apiClient.get(`/api/google-drive/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      if (response.data instanceof Blob) {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchStats();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Drive Integration</h2>
            <p className="text-gray-600">Manage your daycare data and documents</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload File
            </button>
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Upload New File</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={uploadData.fileName}
                  onChange={(e) => setUploadData({ ...uploadData, fileName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter file name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MIME Type</label>
                <select
                  value={uploadData.mimeType}
                  onChange={(e) => setUploadData({ ...uploadData, mimeType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text/plain">Text File</option>
                  <option value="application/json">JSON</option>
                  <option value="text/csv">CSV</option>
                  <option value="application/pdf">PDF</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={uploadData.content}
                onChange={(e) => setUploadData({ ...uploadData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter file content"
              />
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={uploadFile}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Upload
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchFiles()}
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={searchFiles}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalFiles}</p>
                  <p className="text-sm text-gray-600">Total Files</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatFileSize(stats.totalSize)}</p>
                  <p className="text-sm text-gray-600">Total Size</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{Object.keys(stats.fileTypes).length}</p>
                  <p className="text-sm text-gray-600">File Types</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-bold text-orange-600">{formatDate(stats.lastModified)}</p>
                  <p className="text-sm text-gray-600">Last Modified</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files List */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Files ({files.length})</h3>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No files found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {file.size ? formatFileSize(parseInt(file.size)) : 'Unknown size'} • {formatDate(file.modifiedTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadFile(file.id, file.name)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Open in Drive"
                      >
                        <Share2 className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* File Details Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">File Details</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedFile.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedFile.mimeType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <p className="text-gray-900">
                    {selectedFile.size ? formatFileSize(parseInt(selectedFile.size)) : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Modified</label>
                  <p className="text-gray-900">{formatDate(selectedFile.modifiedTime)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link</label>
                  <a
                    href={selectedFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 break-all"
                  >
                    {selectedFile.webViewLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 