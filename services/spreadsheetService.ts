
import { Student, AttendanceRecord } from '../types';

export const saveSheetUrl = (url: string) => {
  localStorage.setItem('gsheet_app_url', url);
};

export const getSheetUrl = () => {
  return localStorage.getItem('gsheet_app_url') || '';
};

export const fetchStudentsFromSheet = async (): Promise<Student[]> => {
  const url = getSheetUrl();
  if (!url) return [];

  try {
    const response = await fetch(`${url}?action=getStudents`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data as Student[];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const saveAttendanceToSheet = async (record: AttendanceRecord): Promise<boolean> => {
  const url = getSheetUrl();
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors for simple POSTs
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addAttendance',
        data: record
      }),
    });
    return true; // With no-cors we assume success if no crash
  } catch (error) {
    console.error('Error saving attendance:', error);
    return false;
  }
};
