
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, UserCheck, UserMinus, Clock, Sparkles } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import { getAttendanceInsights } from '../services/geminiService';

interface Props {
  students: Student[];
  attendance: AttendanceRecord[];
}

const Dashboard: React.FC<Props> = ({ students, attendance }) => {
  const [aiInsight, setAiInsight] = useState<string>("Sedang menganalisis...");

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getAttendanceInsights(attendance);
      setAiInsight(insight || "Belum ada data cukup untuk dianalisis.");
    };
    fetchInsight();
  }, [attendance]);

  const stats = [
    { label: 'Total Siswa', value: students.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Hadir Hari Ini', value: new Set(attendance.map(a => a.studentId)).size, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Terlambat', value: 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Tidak Hadir', value: students.length - new Set(attendance.map(a => a.studentId)).size, icon: UserMinus, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  // Dummy Chart Data
  const chartData = [
    { name: '07:00', total: 12 },
    { name: '08:00', total: 45 },
    { name: '09:00', total: 32 },
    { name: '10:00', total: 8 },
    { name: '11:00', total: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Tren Kehadiran</h3>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12% dari kemarin</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="glass p-6 rounded-2xl shadow-sm bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg">AI Smart Insight</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-sm md:text-base">
            "{aiInsight}"
          </p>
          <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-sm">
            <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Saran AI:</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pertimbangkan untuk memperketat toleransi keterlambatan pada hari Senin pagi berdasarkan pola 4 minggu terakhir.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-lg mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {attendance.slice(0, 5).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                  {record.studentName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{record.studentName}</p>
                  <p className="text-xs text-slate-500">{record.className} • {record.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{record.timestamp}</p>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase tracking-tighter">HADIR</span>
              </div>
            </div>
          ))}
          {attendance.length === 0 && (
            <p className="text-center text-slate-400 py-10 italic">Belum ada absensi hari ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Users = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default Dashboard;
