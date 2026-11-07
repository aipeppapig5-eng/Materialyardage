import React from 'react';

export const CalculatorSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs animate-pulse space-y-8">
      {/* Header bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="h-6 w-48 sm:w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-3.5 w-72 sm:w-96 bg-slate-100 rounded-md"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
          <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      {/* Main 2-Column Split: Inputs (Left) and Results/Visualizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Parameter Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
              <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
              <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
              <div className="h-12 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="h-4 w-40 bg-slate-200 rounded-md"></div>
            <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <div className="h-11 w-40 bg-emerald-200/70 rounded-xl"></div>
            <div className="h-11 w-28 bg-slate-100 rounded-xl"></div>
          </div>
        </div>

        {/* Right Column: Visualizer & Output Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Visual Canvas Card */}
          <div className="h-56 w-full bg-slate-100 border border-slate-200/70 rounded-2xl flex items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-slate-200/60"></div>
          </div>

          {/* Metric Summary Card */}
          <div className="bg-slate-900/90 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-700 rounded-md"></div>
              <div className="h-6 w-24 bg-emerald-400/40 rounded-md"></div>
            </div>
            <div className="h-3 w-44 bg-slate-800 rounded-md"></div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <div className="h-4 w-20 bg-slate-700 rounded-md"></div>
              <div className="h-5 w-24 bg-slate-600 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
