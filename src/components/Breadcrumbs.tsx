import { useParams, Link } from 'react-router-dom';
import { formatSubject } from '../data/labModules';

export default function Breadcrumbs() {
  const { classId, subjectId } = useParams();

  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6 bg-slate-50 py-2 px-4 rounded-lg shadow-sm border border-slate-200">
      <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
      {classId && (
        <>
          <span className="text-slate-300">/</span>
          <Link to={`/class/${classId}`} className={`transition-colors font-medium ${!subjectId ? 'text-slate-800 cursor-default pointer-events-none' : 'hover:text-blue-600'}`}>Class {classId}</Link>
        </>
      )}
      {subjectId && (
        <>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium">{formatSubject(subjectId)}</span>
        </>
      )}
    </div>
  );
}
