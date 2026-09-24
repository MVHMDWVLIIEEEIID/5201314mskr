// components/ModernVerticalSlider.jsx
export default function ModernVerticalSlider({ progress }) {
  return (
    <div className="pointer-events-none fixed right-8 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-4">
      <div className="relative h-64 w-2 rounded-full bg-white/10">
        {/* Filled Track (المسار الممتلئ) */}
        <div 
          className="absolute left-0 top-0 w-full rounded-full bg-white/80"
          style={{ height: `${progress * 100}%` }}
        />
        
      </div>
      
      <span className="text-xs font-mono text-white/50 tracking-widest">
        {Math.round((progress || 0) * 100)}%
      </span>
    </div>
  );
}