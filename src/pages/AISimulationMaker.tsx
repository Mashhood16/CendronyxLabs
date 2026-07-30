import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Save, Trash2, ArrowRight, Check, Share2, Play, Search, Key, Cpu, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { generateSimulationWithOpenRouter, FREE_OPENROUTER_MODELS, CLASS_OPTIONS, SUBJECT_OPTIONS, CLASS_AGE_MAPPING } from '../services/openRouterService';
import { customSimDB } from '../services/dbService';
import { AISimulationSpec } from '../types/aiSimulation';
import DynamicAISimulationLab from '../components/labs/generic/DynamicAISimulationLab';
import { useTheme } from '../store';

export default function AISimulationMaker() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { id: routeSimId } = useParams();

  const [prompt, setPrompt] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('Class 9');
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSpec, setCurrentSpec] = useState<AISimulationSpec | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedSims, setSavedSims] = useState<AISimulationSpec[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // OpenRouter Settings State
  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem('virtuallab_openrouter_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('virtuallab_openrouter_model') || FREE_OPENROUTER_MODELS[0].id);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Load user's saved simulations from IndexedDB/LocalStorage
  useEffect(() => {
    loadSavedSimulations();
  }, []);

  // Auto-load route simulation if opening via /lab/custom/:id
  useEffect(() => {
    if (routeSimId) {
      customSimDB.getSimulationById(routeSimId).then(spec => {
        if (spec) {
          setCurrentSpec(spec);
          setIsSaved(true);
        }
      });
    }
  }, [routeSimId]);

  const loadSavedSimulations = async () => {
    const sims = await customSimDB.getAllSimulations();
    setSavedSims(sims);
  };

  const handleSaveKey = (key: string, model: string) => {
    setOpenRouterKey(key.trim());
    setSelectedModel(model);
    localStorage.setItem('virtuallab_openrouter_api_key', key.trim());
    localStorage.setItem('virtuallab_openrouter_model', model);
    setShowKeyModal(false);
    setErrorMessage(null);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setErrorMessage(null);

    if (!openRouterKey && !localStorage.getItem('virtuallab_openrouter_api_key')) {
      setShowKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setIsSaved(false);

    try {
      const result = await generateSimulationWithOpenRouter(prompt.trim(), openRouterKey, selectedModel, selectedClass, selectedSubject);
      if (result.spec) {
        setCurrentSpec(result.spec);
      } else if (result.error === 'NO_API_KEY') {
        setShowKeyModal(true);
      } else {
        setErrorMessage(result.error || 'AI generation failed. Please try again or switch model.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'AI generation error.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentSpec) return;
    await customSimDB.saveSimulation(currentSpec);
    setIsSaved(true);
    await loadSavedSimulations();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this custom simulation?')) {
      await customSimDB.deleteSimulation(id);
      if (currentSpec?.id === id) {
        setCurrentSpec(null);
      }
      await loadSavedSimulations();
    }
  };

  const handleShareLink = (sim: AISimulationSpec) => {
    const shareableUrl = `${window.location.origin}/lab/custom/${sim.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Layout>
      <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header Banner */}
          <div className="text-center space-y-3 py-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by OpenRouter Free AI Models
              </div>

              <button
                onClick={() => setShowKeyModal(true)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  openRouterKey
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                {openRouterKey ? 'OpenRouter API Key Configured' : 'Configure Free OpenRouter Key'}
              </button>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
              AI Simulation Studio
            </h1>
            <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Type any scientific topic or natural language concept to generate dynamic 2D visual labs using Free OpenRouter LLMs.
            </p>

            {/* Selected Model Bar */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono pt-2">
              <span className="text-slate-400">Model:</span>
              <select
                value={selectedModel}
                onChange={e => {
                  setSelectedModel(e.target.value);
                  localStorage.setItem('virtuallab_openrouter_model', e.target.value);
                }}
                className={`px-2.5 py-1 rounded-lg border outline-none text-xs font-semibold ${
                  isDark ? 'bg-[#121216] border-slate-800 text-purple-300' : 'bg-white border-slate-300 text-purple-700'
                }`}
              >
                {FREE_OPENROUTER_MODELS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class, Subject & Prompt Form */}
          <form onSubmit={handleGenerate} className="max-w-3xl mx-auto space-y-3">
            {/* Class & Subject Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border bg-purple-500/5 border-purple-500/20">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-300">Class / Grade:</span>
                  <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border outline-none text-xs font-bold ${
                      isDark ? 'bg-[#121216] border-slate-800 text-purple-300' : 'bg-white border-slate-300 text-purple-700'
                    }`}
                  >
                    {CLASS_OPTIONS.map(c => (
                      <option key={c} value={c}>
                        {c} ({CLASS_AGE_MAPPING[c]?.ageGroup || 'All Ages'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-300">Subject:</span>
                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border outline-none text-xs font-bold ${
                      isDark ? 'bg-[#121216] border-slate-800 text-sky-300' : 'bg-white border-slate-300 text-sky-700'
                    }`}
                  >
                    {SUBJECT_OPTIONS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age Appropriateness Info Tag */}
              <div className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 font-medium hidden sm:block">
                🎯 Age Group: <span className="font-bold text-white">{CLASS_AGE_MAPPING[selectedClass]?.ageGroup}</span>
              </div>
            </div>

            {/* Prompt Search Bar */}
            <div className={`p-2 rounded-2xl border shadow-xl flex items-center gap-2 ${
              isDark ? 'bg-[#121216] border-slate-800 focus-within:border-purple-500' : 'bg-white border-slate-200 focus-within:border-purple-500'
            }`}>
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={`e.g., ${selectedSubject} concept for ${selectedClass} (e.g. Pendulum, Projectile, Ohm's law)...`}
                className={`w-full bg-transparent border-none outline-none text-sm md:text-base px-2 py-2 placeholder-slate-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-lg shadow-purple-600/30"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Lab</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setShowKeyModal(true)}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Configure Key
              </button>
            </div>
          )}

          {/* Active Generation Preview Box */}
          {currentSpec && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Generated Simulation Sandbox
                  </h2>

                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    Live AI ({selectedModel.split('/')[1] || selectedModel})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleShareLink(currentSpec)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                      isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copySuccess ? 'Link Copied!' : 'Share Link'}
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      isSaved
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                    }`}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {isSaved ? 'Saved to Website' : 'Save Simulation'}
                  </button>
                </div>
              </div>

              {/* Dynamic Lab Harness */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <DynamicAISimulationLab spec={currentSpec} />
              </div>
            </div>
          )}

          {/* User's Saved AI Simulations List */}
          <div className="pt-8 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Save className="w-5 h-5 text-purple-400" />
                My Custom AI Simulations ({savedSims.length})
              </h2>
            </div>

            {savedSims.length === 0 ? (
              <div className={`p-8 rounded-2xl text-center border ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-sm text-slate-400">
                  You haven't saved any custom simulations yet. Type a prompt above to generate and save your first lab!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSims.map(sim => (
                  <div
                    key={sim.id}
                    className={`p-5 rounded-2xl border transition-all hover:border-purple-500/50 flex flex-col justify-between ${
                      isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {sim.subject} • {sim.category}
                        </span>
                        <button
                          onClick={() => handleDelete(sim.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Delete Simulation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-base line-clamp-1">{sim.title}</h3>
                      <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {sim.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(sim.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setCurrentSpec(sim)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Run Simulation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* OpenRouter / Gemini API Key Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#121216] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  Free AI Key Setup (Gemini / OpenRouter)
                </h3>
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enter your free API Key to generate live AI simulations:
                </p>
                <div className="text-xs space-y-1.5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center justify-between font-semibold text-purple-300">
                    <span>1. Google Gemini API (Recommended - 100% Free)</span>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline text-sky-400">
                      Get Free Key
                    </a>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-purple-300">
                    <span>2. OpenRouter API Key</span>
                    <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="underline text-sky-400">
                      Get Key
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  API Key (Google AI Studio "AIzaSy..." or OpenRouter "sk-or-v1-...")
                </label>
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={e => setOpenRouterKey(e.target.value)}
                  placeholder="Paste your API key here"
                  className={`w-full p-3 rounded-xl border outline-none font-mono text-xs ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Select AI Provider / Model
                </label>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none font-sans text-xs ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {FREE_OPENROUTER_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveKey(openRouterKey, selectedModel)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30"
                >
                  Save API Key
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
