import { useState } from 'react';
import axios from 'axios';

export default function PrescriptionUpload({ appointmentId }: { appointmentId?: string }) {
  const [file, setFile] = useState<File|null>(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string|undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    if (appointmentId) form.append('appointmentId', appointmentId);

    const token = localStorage.getItem('token') || '';
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/prescriptions`, form, {
      headers: { Authorization: `Bearer ${token}` },
      onUploadProgress: ev => setProgress(Math.round((ev.loaded * 100) / (ev.total || 1)))
    });
    setUrl(res.data.url);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      {progress > 0 && <div>Uploading: {progress}%</div>}
      <button className="px-4 py-2 text-white bg-black rounded" disabled={!file}>Upload</button>
      {url && <p className="text-green-600">Uploaded: <a className="underline" href={url} target="_blank">View</a></p>}
    </form>
  );
}