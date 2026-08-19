import React from "react";

export default class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen grid place-items-center bg-slate-50 px-6 text-center">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-display text-2xl font-extrabold text-ink">Something went wrong</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              MedFlow could not display this page. Reload the application to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Reload application
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
