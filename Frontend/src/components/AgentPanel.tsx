import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface AgentPanelProps {
  agentId: string;
  onAgentIdChange: (value: string) => void;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  agentId,
  onAgentIdChange
}) => {
  const [open, setOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('openAgentPanel', handleOpen);
    return () => window.removeEventListener('openAgentPanel', handleOpen);
  }, []);

  // Load from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem('xpots-agent-id');
    if (stored) {
      onAgentIdChange(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleChange = (value: string) => {
    onAgentIdChange(value);
    localStorage.setItem('xpots-agent-id', value);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;

    // swipe from left edge to right opens
    if (touchStartX < 40 && deltaX > 60) {
      setOpen(true);
    }
    setTouchStartX(null);
  };

  return (
    <>
      {/* Invisible swipe area on the left edge */}
      <div
        className="fixed inset-y-0 left-0 w-4 z-20 md:hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      {/* Small tab for desktop */}
      <button
        onClick={() => setOpen(!open)}
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-0 z-30 bg-xpots-orange text-white text-xs px-2 py-1 rounded-r-md shadow-soft"
      >
        Agent
      </button>

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-20 w-72 bg-xpots-grey text-xpots-antraciet shadow-strong transform transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-xpots-softgreen/40">
          <div className="text-xs font-semibold tracking-wide text-xpots-antraciet">
            XPOTS • VOICE SETTINGS
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-xpots-darkgreen"
          >
            Sluit
          </button>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium mb-1">
              Retell Agent ID
            </label>
            <input
              value={agentId}
              onChange={e => handleChange(e.target.value)}
              className="w-full rounded-md border border-xpots-darkgreen bg-white/80 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-xpots-orange"
              placeholder="bv. agnt_12345..."
            />
          </div>
          <p className="text-xs text-xpots-darkgreen leading-snug">
            Deze agent ID wordt meegestuurd naar jouw backend endpoint
            <span className="block text-[10px] mt-2 opacity-70">
              API key blijft veilig in de server (.env).
            </span>
          </p>
        </div>
      </div>
    </>
  );
};