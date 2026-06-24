import { useNavigate, useParams } from 'react-router-dom';
import { Microscope, Atom, Calculator, Laptop, Activity, BookOpen, Dna } from 'lucide-react';
import { formatSubject } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

const getSubjectsForClass = (classLevel: string) => {
  const num = parseInt(classLevel);
  if (num >= 6 && num <= 8) {
    return ['science', 'computer'];
  } else {
    return ['physics', 'chemistry', 'biology', 'math', 'computer'];
  }
};

const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'physics': return <Atom className="w-7 h-7" />;
    case 'chemistry': return <Microscope className="w-7 h-7" />;
    case 'biology': return <Dna className="w-7 h-7" />;
    case 'mathematics': case 'math': return <Calculator className="w-7 h-7" />;
    case 'computer': return <Laptop className="w-7 h-7" />;
    case 'science': return <Activity className="w-7 h-7" />;
    default: return <BookOpen className="w-7 h-7" />;
  }
};

export default function SubjectSelection() {
  const { classId } = useParams();
  const navigate = useNavigate();
  if (!classId) return null;
  const subjects = getSubjectsForClass(classId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Select Subject</h2>
          <p className="text-slate-500 mt-1 mb-6">Class {classId} Curriculum</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => navigate(`/class/${classId}/${subject}`)}
                className="glass p-6 rounded-2xl hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex items-center gap-4 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
                  {getSubjectIcon(subject)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors font-outfit">{formatSubject(subject)}</h3>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">Explore Interactive Modules</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
