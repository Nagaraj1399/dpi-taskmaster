import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Root React Error Boundary catching unexpected rendering exceptions
 * and offering a safe recovery reset without crashing the entire UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  public override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Root ErrorBoundary caught exception:', error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900"
        >
          <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900">CivicPulse Interface Error</h1>
                <p className="text-xs text-slate-600">A component failed to render cleanly.</p>
              </div>
            </div>
            <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-3 font-mono">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
