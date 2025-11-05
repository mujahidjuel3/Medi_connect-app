import { useState } from 'react';
import axios from 'axios';

export default function PrescriptionUpload({ appointmentId }: { appointmentId?: string }) {
  const [file, setFile] = useState<File|null>(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string|undefined>();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    if (appointmentId) form.append('appointmentId', appointmentId);

    const token = localStorage.getItem('token') || '';
    try {
      const res = await axios.post(`${backendUrl}/api/prescriptions`, form, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: ev => setProgress(Math.round((ev.loaded * 100) / (ev.total || 1)))
      });
      setUrl(res.data.url);
      setFile(null);
      setProgress(0);
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Prescription File (Image or PDF)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
      </div>
      
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-1">Uploading: {progress}%</p>
        </div>
      )}
      
      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!file || progress > 0}
      >
        {progress > 0 ? 'Uploading...' : 'Upload Prescription'}
      </button>
      
      {url && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium mb-2">✅ Prescription uploaded successfully!</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            View Prescription
          </a>
        </div>
      )}
    </form>
  );
}