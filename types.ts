
export enum View {
  DASHBOARD = 'DASHBOARD',
  SISWA = 'SISWA',
  KELAS = 'KELAS',
  SHIFT = 'SHIFT',
  SCANNER = 'SCANNER',
  REKAP = 'REKAP',
  SETTINGS = 'SETTINGS'
}

export interface Student {
  id: string;
  name: string;
  className: string;
  nfcId?: string;
  qrCode: string;
  photo?: string;
}

export interface Class {
  id: string;
  name: string;
  totalStudents: number;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  timestamp: string;
  type: 'IN' | 'OUT';
  method: 'QR' | 'NFC';
}

export interface DashboardStats {
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
}
