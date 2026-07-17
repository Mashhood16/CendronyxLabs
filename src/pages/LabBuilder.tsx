import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, Edit3, Trash2, Plus, ArrowLeft, ArrowUp, ArrowDown, HelpCircle, Layers, Settings, User, Sparkles } from 'lucide-react';
import { useTranslate } from '../i18n';
import { theme } from '../utils/labTheme';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../store';
import { customLabService, type CustomLab } from '../services/customLabService';
import CustomLabRunner from '../components/CustomLabRunner';
import { customSimService } from '../services/customSimService';

const SUBJECT_OPTIONS = ['physics', 'chemistry', 'biology', 'math', 'computer', 'science', 'english'];
const CLASS_OPTIONS = ['6', '7', '8', '9', '10', '11', '12'];

// Available Draggable Elements
const DRAGGABLE_ELEMENTS = [
  { type: 'instruction', title: 'Instruction Panel', icon: '📝', defaultProps: { content: 'Step 1: Adjust controls.\nStep 2: Observe simulation results.' } },
  { type: 'slider', title: 'Parameter Slider', icon: '🎚️', defaultProps: { stateKey: 'pendulumLength', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.5, unit: 'm' } },
  { type: 'toggle', title: 'Switch Toggle', icon: '🔌', defaultProps: { stateKey: 'circuitSwitch', defaultValue: false } },
  { type: 'select', title: 'Dropdown Select', icon: '🔽', defaultProps: { stateKey: 'materialType', options: 'Iron, Copper, Wood, Glass', defaultValue: 'Iron' } },
  { type: 'button', title: 'Action Button', icon: '🔘', defaultProps: { stateKey: 'resetState', actionType: 'reset', defaultValue: 0 } },
  { type: 'simulation', title: 'Interactive Simulation', icon: '🥽', defaultProps: { simType: 'pendulum' } },
  { type: 'chart', title: 'Data Plotter Chart', icon: '📈', defaultProps: { stateKey: 'dataLog' } }
];

const TEMPLATE_PRESETS = [
  {
    id: 'pendulum_preset',
    title: '🎛️ Swinging Pendulum',
    description: 'Real-time swinging pendulum with adjustable rod length and gravity controls.',
    layout: [
      {
        id: 'widget_instr',
        type: 'instruction',
        title: 'Experiment Guide',
        props: { content: 'Step 1: Increase the rod length and observe how the swing period changes.\nStep 2: Increase gravity and notice if the pendulum swings faster.\nStep 3: Analyze the period in the real-time plot below.' }
      },
      {
        id: 'widget_length_slider',
        type: 'slider',
        title: 'Rod Length',
        props: { stateKey: 'pendulumLength', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.5, unit: 'm' }
      },
      {
        id: 'widget_gravity_slider',
        type: 'slider',
        title: 'Gravity Strength',
        props: { stateKey: 'pendulumGravity', min: 1.0, max: 20.0, step: 0.5, defaultValue: 9.8, unit: 'm/s²' }
      },
      {
        id: 'widget_sim',
        type: 'simulation',
        title: 'Interactive Pendulum',
        props: { simType: 'pendulum' }
      },
      {
        id: 'widget_chart',
        type: 'chart',
        title: 'Real-Time Physics Graph',
        props: { stateKey: 'dataLog' }
      }
    ]
  },
  {
    id: 'circuit_preset',
    title: '⚡ Ohm\'s Law Circuit',
    description: 'Battery-powered circuit with light bulb switch and resistor controls.',
    layout: [
      {
        id: 'widget_instr',
        type: 'instruction',
        title: 'Circuit Instructions',
        props: { content: 'Step 1: Click the switch at the bottom of the circuit to close it.\nStep 2: Adjust battery voltage and resistance using the sliders.\nStep 3: Observe how current changes according to Ohm\'s Law (I = V/R) and notice the bulb\'s brightness.' }
      },
      {
        id: 'widget_volt_slider',
        type: 'slider',
        title: 'Battery Voltage',
        props: { stateKey: 'circuitVoltage', min: 1, max: 12, step: 0.5, defaultValue: 6, unit: 'V' }
      },
      {
        id: 'widget_res_slider',
        type: 'slider',
        title: 'Bulb Resistance',
        props: { stateKey: 'circuitResistance', min: 5, max: 50, step: 1, defaultValue: 10, unit: 'Ω' }
      },
      {
        id: 'widget_switch',
        type: 'toggle',
        title: 'Circuit Switch',
        props: { stateKey: 'circuitSwitch', defaultValue: false }
      },
      {
        id: 'widget_sim',
        type: 'simulation',
        title: 'Ohm\'s Circuit',
        props: { simType: 'circuit' }
      },
      {
        id: 'widget_chart',
        type: 'chart',
        title: 'Ohm\'s Current Plot',
        props: { stateKey: 'dataLog' }
      }
    ]
  },
  {
    id: 'titration_preset',
    title: '🧪 Acid-Base Titration',
    description: 'Acid-base neutralization beaker mixer with indicator pH level change.',
    layout: [
      {
        id: 'widget_instr',
        type: 'instruction',
        title: 'Titration Guide',
        props: { content: 'Step 1: Set the concentrations of the acid and base reactant.\nStep 2: Click the "Add Drop" button to slowly add acid into the base beaker.\nStep 3: Watch the color turn from pink to clear as neutralization occurs and the pH level drops.' }
      },
      {
        id: 'widget_acid_slider',
        type: 'slider',
        title: 'Acid Concentration',
        props: { stateKey: 'acidConcentration', min: 0.05, max: 0.5, step: 0.01, defaultValue: 0.1, unit: 'M' }
      },
      {
        id: 'widget_base_slider',
        type: 'slider',
        title: 'Base Concentration',
        props: { stateKey: 'baseConcentration', min: 0.05, max: 0.5, step: 0.01, defaultValue: 0.1, unit: 'M' }
      },
      {
        id: 'widget_sim',
        type: 'simulation',
        title: 'Titration Beaker',
        props: { simType: 'titration' }
      }
    ]
  }
];

export default function LabBuilder() {
  const { t } = useTranslate();
  const { labId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lab configuration state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('physics');
  const [classLevel, setClassLevel] = useState('9');
  const [creatorName, setCreatorName] = useState(user?.name || '');
  const [isPrivate, setIsPrivate] = useState(true);
  const [layout, setLayout] = useState<any[]>([]);

  // Editor states
  const [previewMode, setPreviewMode] = useState(false);
  const [activeConfigIndex, setActiveConfigIndex] = useState<number | null>(null);

  // Load existing lab if editing
  useEffect(() => {
    if (labId) {
      customLabService.getLab(labId).then((existingLab) => {
        if (existingLab) {
          setTitle(existingLab.title);
          setDesc(existingLab.desc);
          setSubject(existingLab.subject);
          setClassLevel(existingLab.classLevel);
          setCreatorName(existingLab.creatorName);
          setIsPrivate(existingLab.isPrivate);
          setLayout(existingLab.layout);
        }
      });
    }
  }, [labId]);

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleAddElement = (item: any) => {
    const newWidget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: item.type,
      title: item.title,
      props: { ...item.defaultProps }
    };
    setLayout(prev => [...prev, newWidget]);
    setActiveConfigIndex(layout.length); // auto-open config panel for new item
  };

  const handleApplyTemplate = (preset: typeof TEMPLATE_PRESETS[number]) => {
    if (layout.length > 0 && !window.confirm('Applying this template will overwrite your current workspace layout. Do you want to continue?')) {
      return;
    }
    setLayout(preset.layout);
    setTitle(preset.title.replace(/^[^\s]+\s+/, ''));
    setDesc(preset.description);
    
    if (preset.id === 'pendulum_preset') {
      setSubject('physics');
      setClassLevel('9');
    } else if (preset.id === 'circuit_preset') {
      setSubject('physics');
      setClassLevel('10');
    } else if (preset.id === 'titration_preset') {
      setSubject('chemistry');
      setClassLevel('11');
    }
    setActiveConfigIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      const item = JSON.parse(dataStr);
      if (item && item.type) {
        const newWidget = {
          id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: item.type,
          title: item.title,
          props: { ...item.defaultProps }
        };
        setLayout(prev => [...prev, newWidget]);
        setActiveConfigIndex(layout.length); // auto-open config panel for new item
      }
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const handleSave = async (submitForApproval = false) => {
    if (!title) {
      alert('Please provide a title for your custom lab.');
      return;
    }

    const id = labId || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLab: CustomLab = {
      id,
      userId: user?.id || 'anonymous',
      title,
      desc,
      subject,
      classLevel,
      creatorName: creatorName || 'Anonymous',
      isPrivate: submitForApproval ? false : isPrivate,
      status: submitForApproval ? 'pending' : (labId ? 'draft' : 'draft'),
      createdAt: Date.now(),
      layout
    };

    await customLabService.saveLab(newLab);
    alert(submitForApproval ? 'Lab submitted successfully for admin review!' : 'Lab saved successfully as a private draft!');
    navigate(`/class/${classLevel}/${subject}`);
  };

  const deleteWidget = (index: number) => {
    setLayout(prev => prev.filter((_, i) => i !== index));
    if (activeConfigIndex === index) {
      setActiveConfigIndex(null);
    } else if (activeConfigIndex !== null && activeConfigIndex > index) {
      setActiveConfigIndex(activeConfigIndex - 1);
    }
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layout.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    setLayout(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });

    if (activeConfigIndex === index) {
      setActiveConfigIndex(targetIdx);
    } else if (activeConfigIndex === targetIdx) {
      setActiveConfigIndex(index);
    }
  };

  const updateWidgetProp = (index: number, key: string, val: any) => {
    setLayout(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        props: {
          ...updated[index].props,
          [key]: val
        }
      };
      return updated;
    });
  };

  if (previewMode) {
    const mockId = `temp_preview_${Date.now()}`;
    // Save to temporary preview local slot and render runner
    const runPreview = () => {
      const previewLab: CustomLab = {
        id: mockId,
        userId: user?.id || 'anonymous',
        title: title || 'Lab Preview',
        desc,
        subject,
        classLevel,
        creatorName,
        isPrivate: true,
        status: 'draft',
        createdAt: Date.now(),
        layout
      };
      customLabService.saveLab(previewLab);
    };

    runPreview();

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center z-50">
          <span className="font-bold flex items-center gap-2">
            <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Live Preview Mode
          </span>
          <button
            onClick={() => {
              setPreviewMode(false);
              customLabService.deleteLab(mockId);
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Edit3 size={16} /> Back to Editor
          </button>
        </div>
        <div className="flex-1">
          <CustomLabRunner moduleId={mockId} onExit={() => {
            setPreviewMode(false);
            customLabService.deleteLab(mockId);
          }} />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-120px)]">
        <Breadcrumbs />

        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text.primary}`}>{labId ? 'Edit Custom Lab' : 'Create Custom Lab'}</h2>
            <p className={`${theme.text.muted} text-sm`}>Drag and drop widgets to build your interactive science or programming simulation.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setPreviewMode(true)}
              className="flex-1 md:flex-none px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-transparent dark:border-slate-700"
            >
              <Eye size={18} /> Preview
            </button>
            <button
              onClick={() => handleSave(false)}
              className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-500/20"
            >
              <Save size={18} /> Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
            >
              Submit for Admin Approval
            </button>
          </div>
        </div>

        {/* Templates Banner */}
        <div className={`mb-6 p-5 ${theme.card.bg} border ${theme.card.border} rounded-2xl shadow-sm`}>
          <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500 animate-pulse" />
            Quick-Start Preset Templates
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Select a template to instantly build a complete virtual lab layout. You can customize it afterwards!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyTemplate(preset)}
                className="p-4 bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-950 rounded-xl text-left transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mb-3">
                    {preset.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md self-start border border-indigo-100 dark:border-indigo-900/30">
                  Apply Preset
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Draggable Widgets Sidebar */}
          <div className={`lg:col-span-1 p-5 ${theme.card.bg} border ${theme.card.border} rounded-2xl`}>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b pb-2">
              <Layers size={18} className="text-indigo-500" /> Elements Pool
            </h3>
            <p className="text-xs text-slate-500 mb-4">Drag elements and drop them in the builder workspace in the center.</p>
            <div className="space-y-3">
              {DRAGGABLE_ELEMENTS.map((el) => (
                <div
                  key={el.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, el)}
                  onClick={() => handleAddElement(el)}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm select-none group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{el.icon}</span>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{el.title}</h4>
                  </div>
                  <button
                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-slate-400 group-hover:text-indigo-600 transition-colors"
                    title={`Click to add ${el.title}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Builder Dropzone Workspace */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Onboarding Assistant Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-orange-200/50 dark:border-orange-950/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
                <HelpCircle size={120} className="text-orange-500" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 font-bold text-lg">
                💡
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1 font-outfit">Interactive Creation Assistant</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  Building a lab is simple! Follow these three steps:
                </p>
                <ol className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 list-decimal pl-4">
                  <li><strong>Add elements:</strong> Click or drag elements from the <strong>Elements Pool</strong> on the left.</li>
                  <li><strong>Open Settings:</strong> Click on any element card in the dropzone to configure its settings on the right.</li>
                  <li><strong>Link Parameters:</strong> Connect your control sliders or switches to the simulation using the <strong>Link Parameter</strong> dropdown on the right panel.</li>
                </ol>
              </div>
            </div>

            {/* Meta Configuration block */}
            <div className={`p-5 ${theme.card.bg} border ${theme.card.border} rounded-2xl space-y-4`}>
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Settings size={18} className="text-indigo-500" /> Lab Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Lab Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Gravity & Air Resistance Lab"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Creator Credit Name</label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="e.g. Professor Ali"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  >
                    {SUBJECT_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Class Level</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                  >
                    {CLASS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>Class {opt}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800/40 rounded-xl border dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Keep Private Draft</span>
                    <button
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                        isPrivate ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        isPrivate ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Objective / Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Enter objective details of this experiment..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Dropzone Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl min-h-[350px] p-6 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/10"
            >
              {layout.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <Plus className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
                  <p className="font-semibold text-slate-600 dark:text-slate-400">Workspace Dropzone</p>
                  <p className="text-xs text-slate-400 mt-1">Drag and drop elements here to arrange your lab layout</p>
                </div>
              ) : (
                layout.map((widget, index) => {
                  const isActive = activeConfigIndex === index;
                  return (
                    <div
                      key={widget.id}
                      onClick={() => setActiveConfigIndex(index)}
                      className={`p-4 bg-white dark:bg-[#121212] border rounded-2xl shadow-sm flex items-center justify-between cursor-pointer group transition-all ${
                        isActive 
                          ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-950/40' 
                          : 'border-slate-200 dark:border-[#1c1b1b] hover:border-slate-300 dark:hover:border-[#2a2a2a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {DRAGGABLE_ELEMENTS.find(e => e.type === widget.type)?.icon || '🔧'}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {widget.title || widget.type}
                          </h4>
                          <p className="text-[10px] font-mono text-slate-400 uppercase">
                            {widget.type} {widget.props.stateKey ? `(${widget.props.stateKey})` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Widget Actions */}
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveWidget(index, 'up'); }}
                          disabled={index === 0}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-500"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveWidget(index, 'down'); }}
                          disabled={index === layout.length - 1}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-500"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteWidget(index); }}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Properties Configuration Panel */}
          <div className="lg:col-span-1">
            {activeConfigIndex !== null && layout[activeConfigIndex] ? (
              <div className={`p-5 ${theme.card.bg} border ${theme.card.border} rounded-2xl space-y-4 animate-fade-in`}>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2 border-b pb-2">
                  <Edit3 size={18} className="text-indigo-500" /> Properties Panel
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Display Title</label>
                  <input
                    type="text"
                    value={layout[activeConfigIndex].title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLayout(prev => {
                        const updated = [...prev];
                        updated[activeConfigIndex] = { ...updated[activeConfigIndex], title: val };
                        return updated;
                      });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                  />
                </div>

                {/* Conditional property fields */}
                {layout[activeConfigIndex].type === 'instruction' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Instruction Text</label>
                    <textarea
                      value={layout[activeConfigIndex].props.content || ''}
                      onChange={(e) => updateWidgetProp(activeConfigIndex, 'content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                    />
                  </div>
                )}

                {['slider', 'toggle', 'select', 'button'].includes(layout[activeConfigIndex].type) && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Link to Simulation Parameter</label>
                    <select
                      value={layout[activeConfigIndex].props.stateKey || ''}
                      onChange={(e) => updateWidgetProp(activeConfigIndex, 'stateKey', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                    >
                      <option value="">-- No Link (Custom Parameter) --</option>
                      <option value="pendulumLength">🎛️ Pendulum: Length (pendulumLength)</option>
                      <option value="pendulumGravity">🌍 Pendulum: Gravity Strength (pendulumGravity)</option>
                      <option value="circuitVoltage">⚡ Circuit: Battery Voltage (circuitVoltage)</option>
                      <option value="circuitResistance">💡 Circuit: Bulb Resistance (circuitResistance)</option>
                      <option value="circuitSwitch">🔌 Circuit: Switch Closed State (circuitSwitch)</option>
                      <option value="acidConcentration">🧪 Titration: Acid Concentration (acidConcentration)</option>
                      <option value="baseConcentration">🧪 Titration: Base Concentration (baseConcentration)</option>
                      <option value="titrationDrops">💧 Titration: Liquid Drops Added (titrationDrops)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">This links the control directly to physical simulation dynamics.</p>
                  </div>
                )}

                {layout[activeConfigIndex].type === 'slider' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Min Value</label>
                        <input
                          type="number"
                          value={layout[activeConfigIndex].props.min ?? 0}
                          onChange={(e) => updateWidgetProp(activeConfigIndex, 'min', Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Max Value</label>
                        <input
                          type="number"
                          value={layout[activeConfigIndex].props.max ?? 100}
                          onChange={(e) => updateWidgetProp(activeConfigIndex, 'max', Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Step</label>
                        <input
                          type="number"
                          value={layout[activeConfigIndex].props.step ?? 1}
                          onChange={(e) => updateWidgetProp(activeConfigIndex, 'step', Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Default Value</label>
                        <input
                          type="number"
                          value={layout[activeConfigIndex].props.defaultValue ?? 0}
                          onChange={(e) => updateWidgetProp(activeConfigIndex, 'defaultValue', Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Unit Label</label>
                      <input
                        type="text"
                        value={layout[activeConfigIndex].props.unit || ''}
                        onChange={(e) => updateWidgetProp(activeConfigIndex, 'unit', e.target.value)}
                        placeholder="e.g. m, V, kg"
                        className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {layout[activeConfigIndex].type === 'select' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Options List (comma-separated)</label>
                    <input
                      type="text"
                      value={layout[activeConfigIndex].props.options || ''}
                      onChange={(e) => updateWidgetProp(activeConfigIndex, 'options', e.target.value)}
                      placeholder="Iron, Wood, Water, Gold"
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                    />
                  </div>
                )}

                {layout[activeConfigIndex].type === 'button' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Action Type</label>
                    <select
                      value={layout[activeConfigIndex].props.actionType || 'verify'}
                      onChange={(e) => updateWidgetProp(activeConfigIndex, 'actionType', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                    >
                      <option value="verify">Verify/Check Simulation State</option>
                      <option value="reset">Reset Parameters to Default</option>
                    </select>
                  </div>
                )}

                {layout[activeConfigIndex].type === 'simulation' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Simulation Widget Type</label>
                      <select
                        value={layout[activeConfigIndex].props.simType || 'pendulum'}
                        onChange={(e) => updateWidgetProp(activeConfigIndex, 'simType', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                      >
                        <option value="pendulum">🎛️ Real-time Swinging Pendulum</option>
                        <option value="circuit">⚡ Interactive Light Bulb Circuit</option>
                        <option value="titration">🧪 Acid-Base Titration Beaker</option>
                        <option value="dna">🧬 DNA Helix Base Pairing</option>
                        <option value="fraction">📐 Fraction circle Visualizer</option>
                        <option value="binary">💻 Binary-to-Decimal Converter</option>
                        <option value="custom">🎨 Custom Physics Sandbox</option>
                      </select>
                    </div>

                    {layout[activeConfigIndex].props.simType === 'custom' && (
                      <div className="space-y-4 border-t pt-4 mt-2">
                        {/* Saved Simulations Dropdown */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Import Saved Simulation (Optional)
                          </label>
                          <select
                            value={layout[activeConfigIndex].props.savedSimId || ''}
                            onChange={(e) => {
                              const simId = e.target.value;
                              if (!simId) {
                                updateWidgetProp(activeConfigIndex, 'savedSimId', '');
                                updateWidgetProp(activeConfigIndex, 'shapes', []);
                                updateWidgetProp(activeConfigIndex, 'equations', []);
                                updateWidgetProp(activeConfigIndex, 'variables', []);
                                updateWidgetProp(activeConfigIndex, 'simName', '');
                                return;
                              }
                              const savedSims = customSimService.getSimulations();
                              const selectedSim = savedSims.find(s => s.id === simId);
                              if (selectedSim) {
                                updateWidgetProp(activeConfigIndex, 'savedSimId', selectedSim.id);
                                updateWidgetProp(activeConfigIndex, 'shapes', selectedSim.shapes);
                                updateWidgetProp(activeConfigIndex, 'equations', selectedSim.equations);
                                updateWidgetProp(activeConfigIndex, 'variables', selectedSim.variables);
                                updateWidgetProp(activeConfigIndex, 'simName', selectedSim.name);
                              }
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none text-sm text-slate-800 dark:text-white"
                          >
                            <option value="">-- Choose a Saved Simulation --</option>
                            {customSimService.getSimulations().map((sim) => (
                              <option key={sim.id} value={sim.id}>
                                🎨 {sim.name} ({sim.category})
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            This imports variables, formulas, and shapes from your Simulation Studio.
                          </p>
                        </div>

                        {layout[activeConfigIndex].props.simName && (
                          <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
                            🔗 Linked to Simulation: <span className="underline">{layout[activeConfigIndex].props.simName}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Canvas Shapes List</h4>
                          <button
                            onClick={() => {
                              const currentShapes = layout[activeConfigIndex].props.shapes || [];
                              const newShape = {
                                id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                                type: 'circle',
                                color: '#4f46e5',
                                xExpr: '200',
                                yExpr: '130',
                                wExpr: '30',
                                hExpr: '30',
                                angleExpr: '0'
                              };
                              updateWidgetProp(activeConfigIndex, 'shapes', [...currentShapes, newShape]);
                            }}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 dark:text-indigo-400 rounded-lg text-xs font-bold transition-all border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Shape
                          </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {((layout[activeConfigIndex].props.shapes || []) as any[]).map((shape, sIdx) => (
                            <div key={shape.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border dark:border-slate-800 space-y-2 relative">
                              <button
                                onClick={() => {
                                  const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                  currentShapes.splice(sIdx, 1);
                                  updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                }}
                                className="absolute top-2 right-2 p-1 text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 rounded transition-colors hover:bg-slate-200 dark:hover:bg-slate-900"
                                title="Delete Shape"
                              >
                                <Trash2 size={13} />
                              </button>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Type</label>
                                  <select
                                    value={shape.type}
                                    onChange={(e) => {
                                      const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                      currentShapes[sIdx] = { ...currentShapes[sIdx], type: e.target.value };
                                      updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white"
                                  >
                                    <option value="circle">Circle</option>
                                    <option value="rect">Rectangle</option>
                                    <option value="line">Line</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Color</label>
                                  <select
                                    value={shape.color}
                                    onChange={(e) => {
                                      const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                      currentShapes[sIdx] = { ...currentShapes[sIdx], color: e.target.value };
                                      updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white"
                                  >
                                    <option value="#4f46e5">Indigo</option>
                                    <option value="#10b981">Emerald</option>
                                    <option value="#ef4444">Rose</option>
                                    <option value="#f59e0b">Amber</option>
                                    <option value="#6366f1">Violet</option>
                                    <option value="#6b7280">Slate</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">X Formula (xExpr)</label>
                                  <input
                                    type="text"
                                    value={shape.xExpr}
                                    onChange={(e) => {
                                      const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                      currentShapes[sIdx] = { ...currentShapes[sIdx], xExpr: e.target.value };
                                      updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Y Formula (yExpr)</label>
                                  <input
                                    type="text"
                                    value={shape.yExpr}
                                    onChange={(e) => {
                                      const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                      currentShapes[sIdx] = { ...currentShapes[sIdx], yExpr: e.target.value };
                                      updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">
                                    {shape.type === 'circle' ? 'Radius' : shape.type === 'line' ? 'X2 End' : 'Width'}
                                  </label>
                                  <input
                                    type="text"
                                    value={shape.wExpr}
                                    onChange={(e) => {
                                      const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                      currentShapes[sIdx] = { ...currentShapes[sIdx], wExpr: e.target.value };
                                      updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">
                                    {shape.type === 'circle' ? 'Unused' : shape.type === 'line' ? 'Y2 End' : 'Height'}
                                  </label>
                                  <input
                                    type="text"
                                    value={shape.hExpr}
                                    disabled={shape.type === 'circle'}
                                    onChange={(e) => {
                                      const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                      currentShapes[sIdx] = { ...currentShapes[sIdx], hExpr: e.target.value };
                                      updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                    }}
                                    className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white font-mono disabled:opacity-50"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Rotation Angle Formula (angleExpr)</label>
                                <input
                                  type="text"
                                  value={shape.angleExpr}
                                  onChange={(e) => {
                                    const currentShapes = [...(layout[activeConfigIndex].props.shapes || [])];
                                    currentShapes[sIdx] = { ...currentShapes[sIdx], angleExpr: e.target.value };
                                    updateWidgetProp(activeConfigIndex, 'shapes', currentShapes);
                                  }}
                                  className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-white font-mono"
                                  placeholder="e.g. 0 or t * 45"
                                />
                              </div>
                            </div>
                          ))}
                          {(layout[activeConfigIndex].props.shapes || []).length === 0 && (
                            <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl">
                              No shapes added yet. Click "Add Shape" to start building your custom canvas simulation!
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/20 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                          <p className="font-bold text-indigo-600 dark:text-indigo-400">💡 Physics Sandbox Tips:</p>
                          <ul className="list-disc pl-3.5 space-y-0.5">
                            <li>Use `t` for running time (in seconds).</li>
                            <li>Reference slider keys (e.g. `L` for rod length).</li>
                            <li>Supports `sin`, `cos`, `tan`, `sqrt`, and `pi` constants.</li>
                            <li>Example Circle Pendulum Bob: `x = 200 + L * 60 * sin(t)`, `y = 50 + L * 60 * cos(t)`.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 bg-slate-100/50 dark:bg-slate-900/30 border border-dashed rounded-2xl text-center py-12">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Click any element in your workspace to configure its properties here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
