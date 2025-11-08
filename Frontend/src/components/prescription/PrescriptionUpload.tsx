import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function PrescriptionUpload({ doctorId }: { doctorId?: string }) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File|null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string|undefined>();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (!doctorId) {
      alert(t('select_doctor_first'));
      return;
    }
    
    setIsUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('doctorId', doctorId);

    const token = localStorage.getItem('token') || '';
    try {
      const res = await axios.post(`${backendUrl}/api/prescriptions`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUrl(res.data.url);
        setFile(null);
        alert(t('prescription_uploaded_success'));
      } else {
        alert(res.data.message || t('upload_failed'));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || t('upload_failed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('select_prescription_file')}
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
      </div>
      
      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={!file || isUploading}
      >
        {isUploading ? t('uploading') : t('upload_prescription_btn')}
      </button>
      
      {url && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium mb-2">✅ {t('prescription_uploaded_success')}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            {t('view_prescription')}
          </a>
        </div>
      )}
    </form>
  );
}