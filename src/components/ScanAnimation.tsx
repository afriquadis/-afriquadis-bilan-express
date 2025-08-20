"use client";
const ScanAnimation = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-24 h-40 relative overflow-hidden rounded-full border-4 border-green-300">
      <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 animate-scan"></div>
      <div className="absolute top-1/4 left-1/2 w-8 h-8 -ml-4 bg-green-200 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 mt-[-2rem] bg-green-200 rounded-lg"></div>
    </div>
    <p className="text-green-700 text-lg font-semibold animate-pulse">Analyse en cours...</p>
    <style jsx>{`
      @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(10rem); } }
      .animate-scan { animation: scan 2.5s linear infinite; }
    `}</style>
  </div>
);
export default ScanAnimation;
