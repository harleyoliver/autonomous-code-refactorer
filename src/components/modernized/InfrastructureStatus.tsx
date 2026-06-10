import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function InfrastructureStatus() {
  const [activeZone, setActiveZone] = useState('ZONE-B');

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <main className="max-w-7xl mx-auto p-6 bg-white shadow-md my-6 rounded-lg border border-slate-300">
        <h1 className="text-2xl font-bold text-[#002855] border-b-2 border-[#002855] pb-2 mb-4 flex items-center gap-2">
          <Activity className="text-[#FF8200]" /> Infrastructure SCADA Status
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="text-sm font-semibold">Active Zone: {activeZone}</p>
            <p className="text-xs text-slate-500">Prisma ORM connected.</p>
          </div>
        </div>
      </main>
    </div>
  );
}