import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, ShieldAlert, Award, Calendar, BookOpen, User, RefreshCw } from 'lucide-react';
import { useTranslate } from '../i18n';
import { theme } from '../utils/labTheme';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { customLabService, type CustomLab } from '../services/customLabService';
import CustomLabRunner from '../components/CustomLabRunner';

export default function AdminReview() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [pendingLabs, setPendingLabs] = useState<CustomLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewLabId, setPreviewLabId] = useState<string | null>(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const labs = await customLabService.getPendingLabs();
      setPendingLabs(labs);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this lab? It will be added to the public catalog for all users.')) {
      await customLabService.approveLab(id);
      alert('Lab approved successfully!');
      loadPending();
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Are you sure you want to reject this lab submission?')) {
      await customLabService.rejectLab(id);
      alert('Lab submission rejected.');
      loadPending();
    }
  };

  if (previewLabId) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center z-50">
          <span className="font-bold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Admin Review Preview Mode
          </span>
          <button
            onClick={() => setPreviewLabId(null)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-slate-700"
          >
            Exit Preview
          </button>
        </div>
        <div className="flex-1">
          <CustomLabRunner moduleId={previewLabId} onExit={() => setPreviewLabId(null)} />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-120px)]">
        <Breadcrumbs />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text.primary} flex items-center gap-2`}>
              <ShieldAlert className="text-indigo-500" /> Lab Submissions Review
            </h2>
            <p className={`${theme.text.muted} text-sm`}>
              Inspect, preview, and approve user-submitted labs for public release.
            </p>
          </div>
          <button
            onClick={loadPending}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title="Refresh submissions"
          >
            <RefreshCw size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : pendingLabs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-[#121212] border rounded-3xl">
            <Award className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">All Caught Up!</h3>
            <p className="text-sm text-slate-400 max-w-sm">No pending lab submissions require review at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingLabs.map((lab) => (
              <div
                key={lab.id}
                className={`p-6 bg-white dark:bg-[#121212] border ${theme.card.border} rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-full font-bold uppercase tracking-wider">
                      {lab.subject} - Class {lab.classLevel}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(lab.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{lab.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                    {lab.desc || 'No objective description provided.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 border-t pt-3 border-slate-100 dark:border-slate-800 mb-6">
                    <span className="flex items-center gap-1">
                      <User size={13} className="text-indigo-500" />
                      Creator: <strong className="text-slate-600 dark:text-slate-300">{lab.creatorName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} />
                      Components: <strong className="text-slate-600 dark:text-slate-300">{lab.layout.length}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewLabId(lab.id)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye size={14} /> Preview Lab
                  </button>
                  <button
                    onClick={() => handleApprove(lab.id)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                    title="Approve Submission"
                  >
                    <Check size={15} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(lab.id)}
                    className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 dark:bg-red-950/20 dark:text-red-400"
                    title="Reject Submission"
                  >
                    <X size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
