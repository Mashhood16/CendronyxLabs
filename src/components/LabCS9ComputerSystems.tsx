import { useState, useEffect, useRef } from 'react';
import { Server, Box, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";
import { useLab } from '../store';

interface ComponentItem { id: string; type: string; name: string; }
interface SlotItem { id: string; name: string; expected: string; filledBy: ComponentItem | null; }
interface RoleItem { id: string; desc: string; layer: number; }
interface LayerItem { num: number; name: string; expectedLayer: number; filledBy: RoleItem | null; }

export default function LabCS9ComputerSystems({ onExit }: { onExit?: () => void }) {
 const { t } = useTranslate();
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');
 const [activeTab] = useState<'hardware' | 'osi'>('hardware');

 const [hwSlots, setHwSlots] = useState<SlotItem[]>([
 { id: 'cpu', name: 'CPU Socket', expected: 'CPU', filledBy: null },
 { id: 'ram', name: 'RAM Slots', expected: 'RAM', filledBy: null },
 { id: 'gpu', name: 'PCIe Slot', expected: 'GPU', filledBy: null },
 { id: 'ssd', name: 'M.2 Slot', expected: 'SSD', filledBy: null },
 { id: 'psu', name: 'Power Connector', expected: 'PSU', filledBy: null },
 ]);

 const [availableHw, setAvailableHw] = useState<ComponentItem[]>([
 { id: 'c1', type: 'RAM', name: '16GB DDR4 RAM' },
 { id: 'c2', type: 'CPU', name: 'Multi-core Processor' },
 { id: 'c3', type: 'GPU', name: 'Graphics Card' },
 { id: 'c4', type: 'PSU', name: '650W Power Supply' },
 { id: 'c5', type: 'SSD', name: '1TB NVMe SSD' },
 ]);

 const [selectedHw, setSelectedHw] = useState<ComponentItem | null>(null);

 const [osiLayers, setOsiLayers] = useState<LayerItem[]>([
 { num: 7, name: 'Application', expectedLayer: 7, filledBy: null },
 { num: 6, name: 'Presentation', expectedLayer: 6, filledBy: null },
 { num: 5, name: 'Session', expectedLayer: 5, filledBy: null },
 { num: 4, name: 'Transport', expectedLayer: 4, filledBy: null },
 { num: 3, name: 'Network', expectedLayer: 3, filledBy: null },
 { num: 2, name: 'Data Link', expectedLayer: 2, filledBy: null },
 { num: 1, name: 'Physical', expectedLayer: 1, filledBy: null },
 ]);

 const [availableRoles, setAvailableRoles] = useState<RoleItem[]>([
 { id: 'r1', layer: 7, desc: 'Network applications (HTTP, FTP)' },
 { id: 'r2', layer: 6, desc: 'Data formatting, encryption' },
 { id: 'r3', layer: 5, desc: 'Establishes & manages connections' },
 { id: 'r4', layer: 4, desc: 'End-to-end reliability (TCP/UDP)' },
 { id: 'r5', layer: 3, desc: 'Routing and logical addressing (IP)' },
 { id: 'r6', layer: 2, desc: 'MAC addressing, switches' },
 { id: 'r7', layer: 1, desc: 'Cables, bits, hubs' },
 ].sort(() => Math.random() - 0.5));

 const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

 const [logs, setLogs] = useState<string[]>([]);
 const logsEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [logs]);

 const logAction = (msg: string) => {
 setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
 };

 const handleHwSlotClick = (slotId: string) => {
 if (selectedHw) {
 setHwSlots(prev => prev.map(s => {
 if (s.id === slotId) {
 if (s.filledBy) setAvailableHw(a => [...a, s.filledBy!]);
 return { ...s, filledBy: selectedHw };
 }
 return s;
 }));
 setAvailableHw(prev => prev.filter(c => c.id !== selectedHw.id));
 setSelectedHw(null);
 logAction(`Placed ${selectedHw.name} into Motherboard Slot`);
 } else {
 const slot = hwSlots.find(s => s.id === slotId);
 if (slot?.filledBy) {
 setAvailableHw(prev => [...prev, slot.filledBy!]);
 setHwSlots(prev => prev.map(s => s.id === slotId ? { ...s, filledBy: null } : s));
 logAction(`Removed ${slot.filledBy.name}`);
 }
 }
 };

 const handleOsiSlotClick = (layerNum: number) => {
 if (selectedRole) {
 setOsiLayers(prev => prev.map(l => {
 if (l.num === layerNum) {
 if (l.filledBy) setAvailableRoles(a => [...a, l.filledBy!]);
 return { ...l, filledBy: selectedRole };
 }
 return l;
 }));
 setAvailableRoles(prev => prev.filter(r => r.id !== selectedRole.id));
 setSelectedRole(null);
 logAction(`Assigned role to Layer ${layerNum}`);
 } else {
 const layer = osiLayers.find(l => l.num === layerNum);
 if (layer?.filledBy) {
 setAvailableRoles(prev => [...prev, layer.filledBy!]);
 setOsiLayers(prev => prev.map(l => l.num === layerNum ? { ...l, filledBy: null } : l));
 logAction(`Removed role from Layer ${layerNum}`);
 }
 }
 };

 const checkHw = () => {
 let score = 0;
 hwSlots.forEach(s => { if (s.filledBy?.type === s.expected) score++; });
 logAction(`Checked Hardware: ${score}/${hwSlots.length} correct`);
 };

 const checkOsi = () => {
 let score = 0;
 osiLayers.forEach(l => { if (l.filledBy?.layer === l.expectedLayer) score++; });
 logAction(`Checked OSI Model: ${score}/${osiLayers.length} correct`);
 };

 return (
 <div className="flex flex-col bg-slate-50 dark:!bg-[#000000] font-sans select-none min-h-screen lg:h-screen overflow-x-hidden w-full">
 <LabHeader onExit={onExit} title={t('lab.cs9computersystems_computer_systems_lab')} />

 
 {/* Mobile Tab Navigation */}
 <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative mb-4">
 <button 
 onClick={() => setActiveMobileTab('theory')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >
 
 {t('lab.cs9computersystems_theory')}
 </button>
 <button 
 onClick={() => setActiveMobileTab('lab')}
 className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
 >{t('lab.cs9computersystems_lab')}</button>
 </div>
 <div className="lg:flex-1 p-4 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 lg:min-h-0 lg:overflow-hidden">
 
 <div className={`w-full bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] lg:overflow-y-auto flex-col gap-4 ${activeMobileTab === 'theory' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2">{t('lab.cs9computersystems_theory_context')}</h2>
 {activeTab === 'hardware' ? (
 <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4 text-sm leading-relaxed">
 <p><strong>{t('lab.cs9computersystems_cpu_central_processing_unit')}</strong> {t('lab.cs9computersystems_the_brain_of_the_computer_hand')}</p>
 <p><strong>{t('lab.cs9computersystems_ram_random_access_memory')}</strong> {t('lab.cs9computersystems_short_term_volatile_memory_use')}</p>
 <p><strong>{t('lab.cs9computersystems_gpu_graphics_processing_unit')}</strong> {t('lab.cs9computersystems_specialized_processor_for_rend')}</p>
 <p><strong>{t('lab.cs9computersystems_ssd_solid_state_drive')}</strong> {t('lab.cs9computersystems_long_term_non_volatile_storage')}</p>
 <p><strong>{t('lab.cs9computersystems_psu_power_supply_unit')}</strong> {t('lab.cs9computersystems_converts_electrical_power_from')}</p>
 <div className={`w-full bg-blue-50 p-3 rounded-md border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col 'flex' : 'hidden'} lg:flex order-first lg:order-none rounded-b-none lg:rounded-b-xl border-b-0 lg:border-b`}>
 <strong className="text-blue-800 dark:text-[#ffffff]">{t('lab.cs9computersystems_task')}</strong> {t('lab.cs9computersystems_select_a_component_from_the_li')}
 </div>
 </div>
 ) : (
 <div className="text-slate-600 dark:text-[#a1a1aa] space-y-4 text-sm leading-relaxed">
 <p>{t('lab.cs9computersystems_the')} <strong>{t('lab.cs9computersystems_osi_model')}</strong> {t('lab.cs9computersystems_open_systems_interconnection_c')}</p>
 <ul className="list-disc pl-5 space-y-1">
 <li><strong>{t('lab.cs9computersystems_7_application')}</strong> {t('lab.cs9computersystems_end_user_apps')}</li>
 <li><strong>{t('lab.cs9computersystems_6_presentation')}</strong> {t('lab.cs9computersystems_data_format_encryption')}</li>
 <li><strong>{t('lab.cs9computersystems_5_session')}</strong> {t('lab.cs9computersystems_connection_management')}</li>
 <li><strong>{t('lab.cs9computersystems_4_transport')}</strong> {t('lab.cs9computersystems_reliability_tcp_udp')}</li>
 <li><strong>{t('lab.cs9computersystems_3_network')}</strong> {t('lab.cs9computersystems_routing_ip_addresses')}</li>
 <li><strong>{t('lab.cs9computersystems_2_data_link')}</strong> {t('lab.cs9computersystems_mac_addresses_switches')}</li>
 <li><strong>{t('lab.cs9computersystems_1_physical')}</strong> {t('lab.cs9computersystems_raw_bits_over_cables_radio')}</li>
 </ul>
 <div className={`w-full bg-blue-50 p-3 rounded-md border border-blue-100 dark:bg-teal-950/20 dark:border-teal-900 flex-col 'flex' : 'hidden'} lg:flex rounded-t-none lg:rounded-t-xl border-t-0 lg:border-t`}>
 <strong className="text-blue-800 dark:text-[#ffffff]">{t('lab.cs9computersystems_task')}</strong> {t('lab.cs9computersystems_assign_the_correct_functional_')}
 </div>
 </div>
 )}
 </div>

 <div className={`bg-slate-100 dark:bg-[#121212] p-4 rounded-xl shadow-inner border border-slate-300 dark:border-[#1c1b1b] lg:overflow-y-auto flex flex-col items-center `}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] mb-4 w-full text-center">{t('lab.cs9computersystems_interactive_workspace')}</h2>
 
 {activeTab === 'hardware' && (
 <div className="w-full flex flex-col gap-6">
 <div className="flex flex-wrap gap-2 justify-center">
 {availableHw.map(c => (
 <button 
 key={c.id} 
 onClick={() => setSelectedHw(c)}
 className={`p-2 rounded-md border-2 text-sm flex items-center gap-2 transition-transform hover:scale-105 ${selectedHw?.id === c.id ? 'border-indigo-500 bg-indigo-100 font-bold' : 'border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212]'} `}
 >
 <Server className="w-4 h-4" /> {c.name}
 </button>
 ))}
 {availableHw.length === 0 && <span className="text-sm text-slate-400 italic">{t('lab.cs9computersystems_all_components_placed')}</span>}
 </div>

 <div className={`bg-green-800 rounded-xl p-6 relative w-full max-w-md mx-auto aspect-[3/4] border-4 border-green-900 shadow-2xl flex flex-col gap-4 `}>
 <div className="absolute top-2 left-2 text-green-400 opacity-50 font-mono text-xs">{t('lab.cs9computersystems_motherboard_v1')}</div>
 {hwSlots.map(s => (
 <button
 key={s.id}
 onClick={() => handleHwSlotClick(s.id)}
 className={`flex-1 border-2 border-dashed rounded-lg flex items-center justify-center p-2 transition-colors ${selectedHw ? 'hover:bg-green-700 border-yellow-400 cursor-pointer' : ''} ${s.filledBy ? 'bg-[#121212] dark:bg-[#121212] border-slate-600 dark:border-slate-500 text-white' : 'border-green-600 text-green-300'}`}
 >
 {s.filledBy ? (
 <div className="flex flex-col items-center">
 <Box className="w-6 h-6 mb-1 text-indigo-300" />
 <span className="text-xs font-bold">{s.filledBy.name}</span>
 </div>
 ) : (
 <span className="text-sm">{s.name}</span>
 )}
 </button>
 ))}
 </div>
 </div>
 )}

 {activeTab === 'osi' && (
 <div className="w-full flex flex-col lg:flex-row gap-6 h-full">
 <div className={`flex-1 flex flex-col gap-2 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <h3 className="font-bold text-sm text-slate-500 dark:text-[#71717a] text-center uppercase tracking-wider">{t('lab.cs9computersystems_roles')}</h3>
 {availableRoles.map(r => (
 <button
 key={r.id}
 onClick={() => setSelectedRole(r)}
 className={`p-3 rounded-lg border-2 text-sm text-left transition-all hover:translate-x-1 ${selectedRole?.id === r.id ? 'border-indigo-500 bg-indigo-50 font-bold shadow-md' : 'border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] shadow-sm'}`}
 >
 {r.desc}
 </button>
 ))}
 {availableRoles.length === 0 && <div className="text-center text-sm text-slate-400 italic p-4">{t('lab.cs9computersystems_all_roles_assigned')}</div>}
 </div>
 
 <div className={`flex-1 flex flex-col gap-1 ${activeMobileTab === 'lab' ? 'block' : 'hidden'} lg:block`}>
 <h3 className="font-bold text-sm text-slate-500 dark:text-[#71717a] text-center uppercase tracking-wider">{t('lab.cs9computersystems_osi_layers')}</h3>
 {osiLayers.map(l => (
 <div key={l.num} className="flex gap-2 items-stretch h-14">
 <div className="w-12 bg-[#121212] dark:!bg-[#121212] text-white font-bold flex items-center justify-center rounded-l-lg shrink-0 shadow-sm border border-[#1c1b1b] dark:border-[#1c1b1b]">
 L{l.num}
 </div>
 <button
 onClick={() => handleOsiSlotClick(l.num)}
 className={`flex-1 border-2 border-dashed rounded-r-lg flex items-center p-2 text-sm text-left transition-colors ${selectedRole ? 'hover:bg-indigo-50 border-indigo-400 cursor-pointer' : ''} ${l.filledBy ? 'bg-indigo-600 border-indigo-700 text-white shadow-inner font-medium' : 'border-slate-300 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] text-slate-400'}`}
 >
 {l.filledBy ? l.filledBy.desc : <span className="opacity-50">{l.name} {t('lab.cs9computersystems_select_a_role')}</span>}
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 </div>

 <div className={`bg-slate-50 dark:!bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex-col ${activeMobileTab === 'lab' ? 'flex' : 'hidden'} lg:flex`}>
 <h2 className="text-lg font-bold text-slate-800 dark:text-[#ffffff] border-b pb-2 mb-4">{t('lab.cs9computersystems_assessment_logs')}</h2>
 
 <div className="mb-6 flex flex-col gap-2">
 <button 
 onClick={activeTab === 'hardware' ? checkHw : checkOsi}
 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 dark:text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-blue-500/40"
 >
 <CheckCircle className="w-5 h-5" />
 
 {t('lab.cs9computersystems_check')} {activeTab === 'hardware' ? 'Hardware' : 'OSI Layers'}
 </button>
 <div className="text-xs text-slate-500 dark:text-[#71717a] text-center mt-1">
 
 {t('lab.cs9computersystems_assemble_all_parts_before_chec')}
 </div>
 </div>

 <div className="flex-1 bg-[#000000] dark:bg-[#121212] text-green-400 font-mono text-xs p-3 rounded-lg lg:overflow-y-auto shadow-inner border border-[#1c1b1b] dark:border-[#1c1b1b]">
 <div className="opacity-50 mb-2">{t('lab.cs9computersystems_system_logs')}</div>
 {logs.length === 0 ? (
 <div className="opacity-50 italic">{t('lab.cs9computersystems_waiting_for_activity')}</div>
 ) : (
 logs.map((log, i) => <div key={i} className="mb-1 leading-tight">{log}</div>)
 )}
 <div ref={logsEndRef} />
 </div>
 </div>

 </div>
 </div>
 );
}
