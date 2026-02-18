
import React, { useState, useEffect } from 'react';
import { Link2, Save, ExternalLink, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { getSheetUrl, saveSheetUrl } from '../services/spreadsheetService';

const Settings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUrl(getSheetUrl());
  }, []);

  const handleSave = () => {
    saveSheetUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const gasCode = `
function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getStudents') {
    var sheet = ss.getSheetByName('Siswa');
    var data = sheet.getDataRange().getValues();
    var headers = data.shift();
    var students = data.map(function(row) {
      return {
        id: row[0].toString(),
        name: row[1],
        className: row[2],
        qrCode: row[3],
        nfcId: row[4],
        photo: row[5] || 'https://picsum.photos/seed/' + row[0] + '/100'
      };
    });
    return ContentService.createTextOutput(JSON.stringify(students))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var postData = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (postData.action === 'addAttendance') {
    var sheet = ss.getSheetByName('Absensi');
    var record = postData.data;
    sheet.appendRow([
      new Date(), 
      record.studentId, 
      record.studentName, 
      record.className, 
      record.method, 
      record.type
    ]);
    return ContentService.createTextOutput("Success");
  }
}
  `.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Link2 className="text-indigo-600" />
          Integrasi Google Sheets
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
              URL Google Apps Script (Web App)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button 
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex gap-3 text-amber-700 dark:text-amber-400">
            <Info className="w-6 h-6 shrink-0" />
            <div className="text-sm">
              <p className="font-bold mb-1">Cara Menghubungkan:</p>
              <ol className="list-decimal ml-4 space-y-1 opacity-90">
                <li>Buka Spreadsheet Anda, buat sheet bernama <b>'Siswa'</b> dan <b>'Absensi'</b>.</li>
                <li>Klik <i>Extensions > Apps Script</i>.</li>
                <li>Hapus kode bawaan dan tempel kode di bawah ini.</li>
                <li>Klik <i>Deploy > New Deployment > Web App</i>.</li>
                <li>Set <i>"Who has access"</i> ke <b>"Anyone"</b>.</li>
                <li>Salin URL Web App yang dihasilkan ke kotak di atas.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Script Google Apps (Copy & Paste)</h3>
          <button 
            onClick={() => { navigator.clipboard.writeText(gasCode); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Salin Kode
          </button>
        </div>
        <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-xs overflow-x-auto border border-slate-800 leading-relaxed">
          {gasCode}
        </pre>
      </div>
    </div>
  );
};

export default Settings;
