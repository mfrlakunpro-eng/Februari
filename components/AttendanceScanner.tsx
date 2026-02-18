
import React, { useState, useEffect, useRef } from 'react';
import { ScanQrCode, Radio, AlertCircle, CheckCircle2, Loader2, Camera } from 'lucide-react';
import { Student } from '../types';

interface Props {
  students: Student[];
  onScanSuccess: (student: Student, method: 'QR' | 'NFC') => void;
}

const AttendanceScanner: React.FC<Props> = ({ students, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState<'QR' | 'NFC'>('QR');
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const [scanning, setScanning] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // QR Implementation refs
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Check Web NFC support
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  const handleNfcScan = async () => {
    if (!nfcSupported) return;
    
    setScanning(true);
    try {
      // @ts-ignore
      const reader = new NDEFReader();
      await reader.scan();
      
      reader.onreading = (event: any) => {
        const serialNumber = event.serialNumber;
        const student = students.find(s => s.nfcId === serialNumber || s.qrCode === serialNumber); // fallback
        
        if (student) {
          onScanSuccess(student, 'NFC');
          showFeedback('success', `Berhasil! Absen ${student.name} tercatat.`);
        } else {
          showFeedback('error', 'Tag NFC tidak terdaftar dalam database.');
        }
      };

      reader.onreadingerror = () => {
        showFeedback('error', 'Gagal membaca tag NFC. Coba lagi.');
      };

    } catch (error) {
      console.error(error);
      showFeedback('error', 'Izin NFC ditolak atau fitur tidak tersedia.');
      setScanning(false);
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const startQrScanner = async () => {
    setScanning(true);
    // In a production app, we would use a library like html5-qrcode.
    // Here we simulate the camera activation.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      showFeedback('error', 'Gagal mengakses kamera.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setScanning(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="glass p-2 rounded-2xl flex gap-1 shadow-sm">
        <button 
          onClick={() => { setActiveTab('QR'); stopScanner(); }}
          className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'QR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <ScanQrCode className="w-5 h-5" />
          QR Code
        </button>
        <button 
          onClick={() => { setActiveTab('NFC'); stopScanner(); }}
          className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'NFC' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Radio className="w-5 h-5" />
          NFC Tag
        </button>
      </div>

      <div className="glass p-8 rounded-3xl shadow-xl flex flex-col items-center text-center">
        {activeTab === 'QR' ? (
          <>
            <div className="w-64 h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8 flex items-center justify-center border-4 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden relative">
              {scanning ? (
                 <video ref={videoRef} className="w-full h-full object-cover" />
              ) : (
                <ScanQrCode className="w-16 h-16 text-slate-300" />
              )}
              {scanning && (
                <div className="absolute inset-0 border-2 border-indigo-500 animate-pulse pointer-events-none"></div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">Scan QR Code Siswa</h3>
            <p className="text-slate-500 text-sm mb-8 px-4">Arahkan kamera ke QR Code yang ada di kartu pelajar siswa untuk melakukan absensi otomatis.</p>
            
            {!scanning ? (
              <button 
                onClick={startQrScanner}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-indigo-950/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
                Mulai Kamera
              </button>
            ) : (
              <button 
                onClick={stopScanner}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-rose-200 dark:shadow-rose-950/20 transition-transform active:scale-95"
              >
                Hentikan Scanner
              </button>
            )}
          </>
        ) : (
          <>
            <div className={`w-48 h-48 rounded-full mb-8 flex items-center justify-center transition-all duration-500 ${scanning ? 'bg-indigo-100 dark:bg-indigo-900/30 animate-pulse scale-110' : 'bg-slate-100 dark:bg-slate-900'}`}>
              <Radio className={`w-20 h-20 ${scanning ? 'text-indigo-600' : 'text-slate-300'}`} />
            </div>
            <h3 className="text-xl font-bold mb-2">Tempelkan Kartu NFC</h3>
            <p className="text-slate-500 text-sm mb-8 px-4">Gunakan teknologi NFC pada ponsel untuk membaca data dari kartu pelajar atau gantungan kunci siswa.</p>
            
            {nfcSupported ? (
               <button 
                disabled={scanning}
                onClick={handleNfcScan}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${scanning ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-950/20 active:scale-95'}`}
              >
                {scanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Radio className="w-5 h-5" />}
                {scanning ? 'Mencari Sinyal...' : 'Aktifkan NFC Reader'}
              </button>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium border border-rose-100 dark:border-rose-900/30">
                <AlertCircle className="w-5 h-5" />
                NFC Tidak Didukung di Perangkat Ini
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-bounce ${feedback.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-rose-500/90 text-white border-rose-400'}`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <span className="font-bold">{feedback.message}</span>
        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;
