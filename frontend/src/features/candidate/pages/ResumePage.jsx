import React from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getCandidateProfile, uploadResume, deleteResume } from '../services/candidateApi.js';
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx';

const ResumePage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['candidateProfile'], queryFn: getCandidateProfile });

  const profile = data?.profile || data || {};
  
  const uploadMutation = useMutation({
    mutationFn: (file) => uploadResume(file),
    onSuccess: () => {
      toast.success('Resume uploaded');
      qc.invalidateQueries({ queryKey: ['candidateProfile'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Upload failed'),
  });

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
    e.target.value = ''; // FIX: Reset input to allow re-selection
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteResume(),
    onSuccess: () => {
      toast.success('Resume removed');
      qc.invalidateQueries({ queryKey: ['candidateProfile'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  if (isLoading) return <DashboardPlaceholder message="Loading resume..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Resume</h2>
        <div className="mt-4 space-y-4">
          {profile.resume?.publicId ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-700">Uploaded: {profile.resume.originalFileName || 'resume.pdf'}</p>
              <div className="flex gap-2">
                <label className="rounded-lg bg-slate-900 px-4 py-2 text-white cursor-pointer">
                  Replace
                  {/* FIX: Added accept attribute */}
                  <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFileChange} />
                </label>
                <button onClick={() => deleteMutation.mutate()} className="rounded-lg border px-4 py-2">Delete</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-600">No resume uploaded yet.</p>
              <label className="mt-2 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white cursor-pointer">
                Upload resume
                {/* FIX: Added accept attribute */}
                <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFileChange} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;