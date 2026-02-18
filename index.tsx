
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

// Fixed property existence errors by using explicit interfaces for Props and State
// Error Boundary untuk mendeteksi penyebab layar blank
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fixed: Property 'state' now exists on 'ErrorBoundary' via generic typing
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    // Fixed: Property 'state' now exists on 'ErrorBoundary'
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
          <div className="max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-rose-100">
            <h1 className="text-2xl font-bold text-rose-600 mb-4">Terjadi Kesalahan</h1>
            <p className="text-slate-600 mb-6 italic text-sm">"{this.state.error?.message}"</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }
    // Fixed: Property 'props' now exists and 'children' is marked optional to prevent JSX missing prop error
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
