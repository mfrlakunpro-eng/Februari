
import React, { ReactNode, Component, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary to catch top-level initialization and runtime errors.
 * Explicitly typed inheritance from Component fixes property access errors.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix for lines 18, 30, 42: Declare state property to ensure compiler visibility
  public state: ErrorBoundaryState = { 
    hasError: false, 
    error: null 
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Using class property initialization instead of direct assignment in constructor
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Fix: Explicitly use ErrorInfo type from react
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical Runtime Error:", error, errorInfo);
  }

  render() {
    // Fix for line 30: Property access through properly inherited state
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-10 text-center">
          <div className="max-w-md space-y-4">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Inisialisasi Gagal</h1>
            <p className="text-slate-500 text-sm">Aplikasi mengalami kendala saat memuat library. Pastikan koneksi internet stabil dan coba muat ulang.</p>
            <div className="p-3 bg-slate-50 rounded-lg text-[10px] font-mono text-rose-500 overflow-auto text-left border border-slate-200">
              {/* Fix for line 42: Property access through properly inherited state */}
              {this.state.error?.message}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
            >
              Muat Ulang Sekarang
            </button>
          </div>
        </div>
      );
    }
    // Fix for line 54: Property access through properly inherited props
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to create React root:", err);
  }
}
