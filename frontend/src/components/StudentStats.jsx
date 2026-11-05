import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, UserCheck, UserX, Award, TrendingUp, BookOpen } from 'lucide-react';

const StudentStats = ({ stats }) => {
  const { t } = useLanguage();

  if (!stats) return null;

  return (
    <div className="space-y-4">
      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('totalStudents')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.total || 0}
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('activeStudents')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {stats.active || 0}
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('inactiveStudents')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {stats.inactive || 0}
            </div>
          </div>
        </div>

        {/* Graduated */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('graduatedStudents')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {stats.graduated || 0}
            </div>
          </div>
        </div>

        {/* Average Grade */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('avgGrade')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {stats.avgGrade || 0}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
          </div>
        </div>

      </div>

      {/* Course Breakdown Badges */}
      {stats.courseStats && stats.courseStats.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center flex-wrap gap-2 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mr-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            {t('courseDistribution')}:
          </span>
          {stats.courseStats.map((item) => (
            <span
              key={item._id}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <span>{item._id}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-bold text-[10px]">
                {item.count}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentStats;

