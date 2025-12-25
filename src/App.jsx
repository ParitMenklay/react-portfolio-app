import React from 'react';

// คอมโพเนนต์ย่อยสำหรับแสดงตัวอย่างสี
const ColorChip = ({ colorClass, name, hex }) => (
  <div className="flex flex-col gap-3">
    <div className={`w-24 h-24 rounded-lg border border-gray-100 ${colorClass}`}></div>
    <div className="flex flex-col text-[12px] leading-tight">
      <span className="font-semibold text-brown-500">{name}</span>
      <span className="text-gray-400 uppercase">{hex}</span>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-white p-16 flex flex-col md:flex-row gap-20">
      
      {/* ส่วนซ้าย: Colors */}
      <div className="flex-1 flex flex-col gap-12">
        <h1 className="text-4xl font-semibold text-slate-300">Colors</h1>

        {/* Base Section */}
        <section>
          <h2 className="text-xl font-medium text-slate-400 mb-6">Base</h2>
          <div className="flex flex-wrap gap-4">
            <ColorChip colorClass="bg-brown-600" name="Brown 600" hex="#26231E" />
            <ColorChip colorClass="bg-brown-500" name="Brown 500" hex="#43403B" />
            <ColorChip colorClass="bg-brown-400" name="Brown 400" hex="#75716B" />
            <ColorChip colorClass="bg-brown-300" name="Brown 300" hex="#DAD6D1" />
            <ColorChip colorClass="bg-brown-200" name="bg-brown-200" hex="#EFEEEB" />
            <ColorChip colorClass="bg-brown-100" name="Brown 100" hex="#F9F8F6" />
            <ColorChip colorClass="bg-white" name="White" hex="#FFFFFF" />
          </div>
        </section>

        {/* Brand Section */}
        <section>
          <h2 className="text-xl font-medium text-slate-400 mb-6">Brand</h2>
          <div className="flex flex-wrap gap-4">
            <ColorChip colorClass="bg-brand-orange" name="Orange" hex="#F2B68C" />
            <ColorChip colorClass="bg-brand-green" name="Green" hex="#12B279" />
            <ColorChip colorClass="bg-brand-green-light" name="Green" hex="#D7F2E9" />
            <ColorChip colorClass="bg-brand-red" name="Red" hex="#EB5164" />
          </div>
        </section>
      </div>

      {/* ส่วนขวา: Fonts */}
      <div className="flex flex-col gap-8 min-w-[320px]">
        <h1 className="text-4xl font-semibold text-slate-300">Fonts</h1>
        
        <div className="flex flex-col gap-6">
          <h1 className="text-6xl font-bold text-brown-600 tracking-tight">Headline 1</h1>
          <h2 className="text-5xl font-bold text-brown-600 tracking-tight">Headline 2</h2>
          <h3 className="text-2xl font-bold text-brown-600">Headline 3</h3>
          <h4 className="text-xl font-bold text-brown-600">Headline 4</h4>
          
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-lg text-brown-600">Body 1</p>
            <p className="text-base text-brown-600">Body 2</p>
            <p className="text-sm text-brown-600 font-light">Body 2</p>
          </div>
        </div>
      </div>

    </div>
  );
}