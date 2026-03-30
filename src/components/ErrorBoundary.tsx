import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-900/20 text-red-400 h-screen w-full overflow-auto font-mono z-50 relative">
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <pre className="whitespace-pre-wrap text-sm bg-black/50 p-4 rounded">{this.state.error?.toString()}</pre>
          <pre className="whitespace-pre-wrap text-xs mt-4 text-red-400/70">{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
