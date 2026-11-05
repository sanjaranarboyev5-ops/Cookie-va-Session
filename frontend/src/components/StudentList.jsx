import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Plus, Edit2, Trash2, Mail, Phone, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

const COURSES = [
  'Fullstack JavaScript',
  'Frontend React',
  'Backend Node.js',
  'Mobile Flutter',
  'Python & AI',
  'UI/UX Dizayn',
];

const StudentList = ({
  students,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  courseFilter,
  setCourseFilter,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            {t('statusActive')}
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            {t('statusInactive')}
          </span>
        );
      case 'graduated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
            {t('statusGraduated')}
          </span>
        );
      default:
        return null;
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (grade >= 70) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Top Header & Search Controls */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              {t('studentsTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('studentsSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              title="Yangilash"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
            </button>

            <button
              onClick={onAddStudent}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addStudent')}</span>
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="active">{t('statusActive')}</option>
            <option value="inactive">{t('statusInactive')}</option>
            <option value="graduated">{t('statusGraduated')}</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <option value="all">{t('allCourses')}</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table or Cards */}
      <div className="overflow-x-auto">
        {loading && students.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
            <p className="text-sm font-medium">O'quvchilar yuklanmoqda...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {t('noStudentsFound')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {t('addNewStudentPrompt')}
            </p>
            <button
              onClick={onAddStudent}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addStudent')}</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">{t('studentName')}</th>
                <th className="py-3 px-6">{t('course')}</th>
                <th className="py-3 px-6">{t('status')}</th>
                <th className="py-3 px-6">{t('grade')}</th>
                <th className="py-3 px-6 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Name, Email, Phone */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {student.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {student.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {student.email}
                        </span>
                      )}
                      {student.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {student.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {student.course}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {getStatusBadge(student.status)}
                  </td>

                  {/* Grade */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getGradeColor(student.grade)}`}>
                      {student.grade}%
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditStudent(student)}
                        title={t('edit')}
                        aria-label={t('edit')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {deleteConfirmId === student._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onDeleteStudent(student._id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold shadow-sm hover:bg-rose-700 transition-colors"
                          >
                            Ha, o'chirish
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold"
                          >
                            Yo'q
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(student._id)}
                          title={t('delete')}
                          aria-label={t('delete')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default StudentList;

