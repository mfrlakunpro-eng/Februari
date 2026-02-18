
import React from 'react';
import { Download, Filter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface Props {
  attendance: AttendanceRecord[];
}

const RekapAbsen: React.FC<Props> = ({ attendance }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 glass p-1 rounded-xl shadow-sm">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ChevronLeft className="w-5 h-5"/></button>
          <div className="flex items-center gap-2 px-4 font-bold text-sm">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>Oktober 2023</span>
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ChevronRight className="w-5 h-5"/></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-100 dark:shadow-none">
            <Download className="w-4 h-4" />
            Ekspor Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rata-rata Kehadiran</p>
          <p className="text-3xl font-black text-emerald-600">94.2%</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">+2.1% dari bulan lalu</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-amber-500">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tingkat Keterlambatan</p>
          <p className="text-3xl font-black text-amber-600">5.8%</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">-1.4% dari bulan lalu</p>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-rose-500">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Izin / Sakit</p>
          <p className="text-3xl font-black text-rose-600">12 Siswa</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Data akumulasi bulan ini</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold">Log Absensi Harian</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full uppercase">Update: Realtime</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Siswa</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{record.timestamp}</td>
                  <td className="px-6 py-4 font-bold text-sm">{record.studentName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.className}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 capitalize">
                      {record.method === 'QR' ? '📷 QR Code' : '📡 NFC Tag'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase">Tepat Waktu</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendance.length === 0 && (
             <div className="py-20 text-center text-slate-400 italic">
               Belum ada data absensi untuk ditampilkan.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RekapAbsen;
