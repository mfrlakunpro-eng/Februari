
import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fixed ErrorBoundary class component properties by ensuring explicit React.Component inheritance 
// which provides correctly typed this.props and this.state
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    // Accessing state after ensuring component is correctly typed
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
          <div className="max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-rose-100">
            <h1 className="text-2xl font-bold text-rose-600 mb-4">Aplikasi Gagal Dimuat</h1>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              Terjadi kesalahan saat menginisialisasi komponen React. Ini biasanya berkaitan dengan masalah koneksi library atau versi.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg mb-6 overflow-auto max-h-32">
              <code className="text-[10px] text-rose-500">{this.state.error?.toString()}</code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              Coba Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    // Accessing props after ensuring component is correctly typed
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  console.error("Fatal error during React mount:", e);
}
