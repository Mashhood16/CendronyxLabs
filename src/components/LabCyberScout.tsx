import { useState } from 'react';
import LabHeader from './LabHeader';
import { useTranslate } from "../i18n";

interface LabProps {
 onExit: () => void;
}

export default function LabCyberScout({ onExit }: LabProps) {
    const { t } = useTranslate();
 const [form, setForm] = useState({
 name: '',
 email: '',
 dob: '',
 cnic: '',
 password: '',
 confirmPassword: ''
 });

 const [errors, setErrors] = useState<{ [key: string]: string }>({});
 const [submitted, setSubmitted] = useState(false);

 const validate = () => {
 const newErrors: { [key: string]: string } = {};
 if (!form.name.trim()) newErrors.name = 'Full name is required.';
 if (!form.email.includes('@') || !form.email.includes('.')) newErrors.email = 'Valid email is required.';
 if (!form.dob) newErrors.dob = 'Date of birth is required.';
 if (form.cnic.length !== 13) newErrors.cnic = 'CNIC must be 13 digits without dashes.';
 
 // Password strength logic
 if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
 else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Password must contain an uppercase letter.';
 else if (!/[0-9]/.test(form.password)) newErrors.password = 'Password must contain a number.';
 else if (!/[^A-Za-z0-9]/.test(form.password)) newErrors.password = 'Password must contain a special character.';

 if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (validate()) {
  setSubmitted(true);
 }
 };

 return (
 <div className="w-full min- lg: bg-slate-200 dark:!bg-[#000000] flex flex-col font-sans min-h-screen lg:h-screen overflow-x-hidden">
  <LabHeader onExit={onExit} title={t('lab.cyberscout_act_5_1_cyber_scout_registrati')} subtitle={t('lab.subtitle_practice_filling_secure')} variant="blue" />

  <div className="flex-1 flex lg:overflow-hidden p-8 justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]">
  
  {/* Browser Window Mockup */}
  <div className="w-[800px] max-h-full bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 dark:border-[#1c1b1b]">
   
   {/* Browser Tab/Address Bar */}
   <div className="bg-slate-200 dark:bg-[#121212] h-12 flex items-center px-4 gap-4 border-b border-slate-300 dark:border-[#1c1b1b]">
    <div className="flex gap-2">
     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
     <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
     <div className="w-3 h-3 bg-green-500 rounded-full dark:bg-[#121212] dark:border-[#1c1b1b]"></div>
    </div>
    <div className="flex-1 bg-slate-50 dark:bg-[#121212] h-8 rounded-full border border-slate-300 dark:border-[#1c1b1b] flex items-center px-4 text-sm font-mono text-slate-500 dark:text-[#71717a]">
     <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
     
                              {t('lab.cyberscout_https_www_nr3c_gov_pk_cyber_sc')}
                             </div>
   </div>

   {/* Web Page Content */}
   <div className="flex-1 p-8 lg:overflow-y-auto">
    
    <div className="flex items-center gap-4 mb-8 border-b-2 border-green-600 pb-4">
     <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">{t('lab.cyberscout_nr3c')}</div>
     <div>
     <h2 className="text-2xl font-bold text-slate-800 dark:text-[#ffffff] uppercase tracking-wider">{t('lab.cyberscout_cyber_scout_program')}</h2>
     <p className="text-slate-500 dark:text-[#71717a]">{t('lab.cyberscout_national_response_centre_for_c')}</p>
     </div>
    </div>

    {submitted ? (
     <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center animate-fade-in shadow-inner dark:bg-[#121212] dark:border-[#1c1b1b]">
     <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
     <h3 className="text-2xl font-bold text-green-800 mb-2 dark:text-[#ffffff]">{t('lab.cyberscout_registration_successful')}</h3>
     <p className="text-green-600 mb-6">{t('lab.cyberscout_welcome_to_the_cyber_scout_tea')} {form.name}{t('lab.cyberscout_you_are_now_part_of_the_initia')}</p>
     <button 
      onClick={() => {setSubmitted(false); setForm({name:'', email:'', dob:'', cnic:'', password:'', confirmPassword:''});}}
      className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-green-500/40"
     >
      
                                       {t('lab.cyberscout_register_another')}
                                      </button>
     </div>
    ) : (
     <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
     <div className="grid grid-cols-2 gap-6">
      <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.cyberscout_full_name')}</label>
       <input 
       type="text" 
       className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300 dark:border-[#1c1b1b]'}`}
       value={form.name} onChange={e => setForm({...form, name: e.target.value})}
       />
       {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.cyberscout_email_address')}</label>
       <input 
       type="email" 
       className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300 dark:border-[#1c1b1b]'}`}
       value={form.email} onChange={e => setForm({...form, email: e.target.value})}
       />
       {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
     </div>

     <div className="grid grid-cols-2 gap-6">
      <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.cyberscout_date_of_birth')}</label>
       <input 
       type="date" 
       className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500 ${errors.dob ? 'border-red-500 bg-red-50' : 'border-slate-300 dark:border-[#1c1b1b]'}`}
       value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
       />
       {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
      </div>
      <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.cyberscout_form_b_cnic_no')}</label>
       <input 
       type="text" 
       maxLength={13}
       placeholder={t('lab.cyberscout_13_digits')}
       className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500 ${errors.cnic ? 'border-red-500 bg-red-50' : 'border-slate-300 dark:border-[#1c1b1b]'}`}
       value={form.cnic} onChange={e => setForm({...form, cnic: e.target.value.replace(/\D/g, '')})}
       />
       {errors.cnic && <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>}
      </div>
     </div>

     <div className="bg-slate-50 dark:bg-[#121212] p-4 border border-slate-200 dark:border-[#1c1b1b] rounded-lg">
      <h4 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4 text-sm border-b pb-2">{t('lab.cyberscout_account_security')}</h4>
      <div className="space-y-4">
       <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.cyberscout_strong_password')}</label>
       <input 
        type="password" 
        className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500 ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300 dark:border-[#1c1b1b]'}`}
        value={form.password} onChange={e => setForm({...form, password: e.target.value})}
       />
       {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
       </div>
       <div>
       <label className="block text-sm font-bold text-slate-700 dark:text-[#ffffff] mb-1">{t('lab.cyberscout_confirm_password')}</label>
       <input 
        type="password" 
        className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-sky-500 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-300 dark:border-[#1c1b1b]'}`}
        value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
       />
       {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
       </div>
      </div>
      <ul className="text-xs text-slate-500 dark:text-[#71717a] mt-4 list-disc pl-4">
       <li className={form.password.length >= 8 ? 'text-green-600' : ''}>{t('lab.cyberscout_at_least_8_characters')}</li>
       <li className={/[A-Z]/.test(form.password) ? 'text-green-600' : ''}>{t('lab.cyberscout_one_uppercase_letter')}</li>
       <li className={/[0-9]/.test(form.password) ? 'text-green-600' : ''}>{t('lab.cyberscout_one_number')}</li>
       <li className={/[^A-Za-z0-9]/.test(form.password) ? 'text-green-600' : ''}>{t('lab.cyberscout_one_special_character')}</li>
      </ul>
     </div>

     <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors uppercase tracking-widest dark:text-white dark:text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-sky-500/40">
      
                                           {t('lab.cyberscout_submit_application')}
                                          </button>
     </form>
    )}

   </div>

  </div>

  </div>
 </div>
 );
}
