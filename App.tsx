
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  Clock, 
  ScanQrCode, 
  FileText, 
  Sun, 
  Moon,
  Menu,
  X,
  Bell,
  Settings as SettingsIcon,
  RefreshCw
} from 'lucide-react';
import { View, Student, AttendanceRecord } from './types';
import Dashboard from './components/Dashboard';
import SiswaManager from './components/SiswaManager';
import AttendanceScanner from './components/AttendanceScanner';
import RekapAbsen from './components/RekapAbsen';
import Settings from './components/Settings';
import { fetchStudentsFromSheet, saveAttendanceToSheet, getSheetUrl } from './services/spreadsheetService';

// Mock Initial Data (Fallback)
const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Ahmad Fauzi', className: 'XII-IPA-1', qrCode: 'STD001', photo: 'https://picsum.photos/seed/ahmad/100' },
  { id: '2', name: 'Siti Aminah', className: 'XII-IPA-1', qrCode: 'STD002', photo: 'https://picsum.photos/seed/siti/100' },
  { id: '3', name: 'Budi Santoso', className: 'XII-IPS-2', qrCode: 'STD003', photo: 'https://picsum.photos/seed/budi/100' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    const url = getSheetUrl();
    if (!url) return;
    
    setIsLoading(true);
    try {
      const sheetStudents = await fetchStudentsFromSheet();
      if (sheetStudents.length > 0) {
        setStudents(sheetStudents);
      }
    } catch (err) {
      console.error("Failed to load students from sheet", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addAttendanceRecord = useCallback(async (student: Student, method: 'QR' | 'NFC') => {
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      timestamp: new Date().toLocaleTimeString(),
      type: 'IN',
      method
    };
    
    setAttendance(prev => [newRecord, ...prev]);
    
    // Sync to Google Sheets
    await saveAttendanceToSheet(newRecord);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: View.DASHBOARD },
    { icon: Users, label: 'Siswa', view: View.SISWA },
    { icon: School, label: 'Kelas', view: View.KELAS },
    { icon: Clock, label: 'Shift', view: View.SHIFT },
    { icon: ScanQrCode, label: 'Scan Absen', view: View.SCANNER },
    { icon: FileText, label: 'Rekap Absen', view: View.REKAP },
    { icon: SettingsIcon, label: 'Konfigurasi', view: View.SETTINGS },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              AS
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">AbsenSiswa</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${getSheetUrl() ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`}></div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                  {getSheetUrl() ? 'Cloud Sync On' : 'Local Mode'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.view 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-white' : 'group-hover:text-indigo-600'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1">
             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              <span className="font-medium">{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-xl tracking-tight capitalize">
              {currentView.toLowerCase().replace('_', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={loadData}
              disabled={isLoading}
              className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isLoading ? 'animate-spin' : ''}`}
              title="Sinkronisasi Data"
            >
              <RefreshCw className={`w-5 h-5 text-slate-500 ${isLoading ? 'text-indigo-600' : ''}`} />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
              <img src="https://picsum.photos/seed/admin/40" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50 dark:bg-slate-950">
          {currentView === View.DASHBOARD && (
            <Dashboard students={students} attendance={attendance} />
          )}
          {currentView === View.SISWA && (
            <SiswaManager students={students} setStudents={setStudents} />
          )}
          {currentView === View.SCANNER && (
            <AttendanceScanner 
              students={students} 
              onScanSuccess={addAttendanceRecord} 
            />
          )}
          {currentView === View.REKAP && (
            <RekapAbsen attendance={attendance} />
          )}
          {currentView === View.SETTINGS && (
            <Settings />
          )}
          
          {/* Placeholder for other views */}
          {(currentView === View.KELAS || currentView === View.SHIFT) && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <School className="w-20 h-20 mb-4 opacity-20" />
               <p className="text-xl font-semibold">Fitur Sedang Dalam Pengembangan</p>
               <p>Halaman {currentView} akan segera hadir.</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
