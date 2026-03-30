import { X } from 'lucide-react';

export default function UIOverlay({ activeNode, onClose }: { activeNode: any, onClose: () => void }) {
  if (!activeNode) return null;

  const Icon = activeNode.icon;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div 
        className="absolute bottom-0 left-0 w-full h-[45vh] bg-black/50 backdrop-blur-2xl border-t border-white/10 flex flex-col items-center justify-center p-8 z-50"
        style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <X size={24} className="text-white/70" />
        </button>
        
        <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8">
          <div 
            className="p-5 rounded-full bg-white/5 border border-white/10 relative"
          >
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-50"
              style={{ backgroundColor: activeNode.color }}
            />
            <Icon size={48} color={activeNode.color} className="relative z-10" />
          </div>
          
          <h2 
            className="text-3xl md:text-5xl font-bold tracking-widest"
            style={{ color: activeNode.color, textShadow: `0 0 30px ${activeNode.color}80` }}
          >
            {activeNode.title}
          </h2>
          
          <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light max-w-2xl tracking-wide">
            {activeNode.content}
          </p>
        </div>
      </div>
    </>
  );
}
