import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import SessionCard from '../components/SessionCard';
import SessionInspectorModal from '../components/SessionInspectorModal';
import StudentStats from '../components/StudentStats';
import StudentList from '../components/StudentList';
import StudentModal from '../components/StudentModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modals
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  // Fetch Students with search and filter parameters
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (courseFilter !== 'all') params.course = courseFilter;

      const res = await api.get('/students', { params });
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Students fetch xatosi:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, courseFilter]);

  // Fetch Statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/students/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Stats fetch xatosi:', err);
    }
  }, []);

  // Initial load and filter change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // O'quvchi qo'shish yoki tahrirlashni saqlash
  const handleSaveStudent = async (formData, studentId) => {
    if (studentId) {
      // Edit
      const res = await api.put(`/students/${studentId}`, formData);
      if (res.data.success) {
        fetchStudents();
        fetchStats();
      }
    } else {
      // Create
      const res = await api.post('/students', formData);
      if (res.data.success) {
        fetchStudents();
        fetchStats();
      }
    }
  };

  // O'quvchini o'chirish
  const handleDeleteStudent = async (studentId) => {
    try {
      const res = await api.delete(`/students/${studentId}`);
      if (res.data.success) {
        fetchStudents();
        fetchStats();
      }
    } catch (err) {
      console.error('Student o\'chirish xatosi:', err);
    }
  };

  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleRefreshAll = () => {
    fetchStudents();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Top Sticky Navbar */}
      <Navbar onOpenInspector={() => setIsInspectorOpen(true)} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Section 8: Dashboard & Cookie/Session Card */}
        <section>
          <SessionCard onOpenInspector={() => setIsInspectorOpen(true)} />
        </section>

        {/* Section 5: Student Statistics */}
        <section>
          <StudentStats stats={stats} />
        </section>

        {/* Section 5: Student List (CRUD + Search + Filter) */}
        <section>
          <StudentList
            students={students}
            loading={loading}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            courseFilter={courseFilter}
            setCourseFilter={setCourseFilter}
            onAddStudent={handleOpenAddModal}
            onEditStudent={handleOpenEditModal}
            onDeleteStudent={handleDeleteStudent}
            onRefresh={handleRefreshAll}
          />
        </section>

      </main>

      {/* Modals */}
      <SessionInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

    </div>
  );
};

export default Dashboard;

