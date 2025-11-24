import React, { useState } from 'react';
import { CircularWaveform } from './components/CircularWaveform';
import { AgentPanel } from './components/AgentPanel';
import { Button } from './components/ui/button';
import { useRetellCall } from './hooks/useRetellCall';

export const App: React.FC = () => {
  const [agentId, setAgentId] = useState('');
  const { isCalling, isThinking, error, audioTrack, startCall, stopCall } =
    useRetellCall();

  const handleStart = () => {
    if (!isCalling) {
      void startCall({ agentId });
    }
  };

  const handleStop = () => {
    if (isCalling) {
      void stopCall();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-xpark-antraciet to-black overflow-hidden">
      {/* Hidden / slide panel */}
      <AgentPanel agentId={agentId} onAgentIdChange={setAgentId} />

      {/* Subtle background accents */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-xpark-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] bottom-[-5rem] h-72 w-72 rounded-full bg-xpark-softgreen/10 blur-3xl" />

      <main className="relative z-10 w-full max-w-xl px-4">
        {/* Header / logo line */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-xpark-softgreen border border-white/10">
            <span className="font-semibold">XPARK</span>
            <span className="w-1 h-1 rounded-full bg-xpark-orange" />
            <span className="dot-separator">
              <span>Parkeren</span>
              <span>Opgelost</span>
            </span>
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight">
            Voice Assistant
          </h1>
          <p className="mt-2 text-xs md:text-sm text-white/60">
            Eén single point of access. Start het gesprek en laat XPARK de rest
            doen.
          </p>
        </header>

        {/* Waveform + buttons */}
        <section className="flex flex-col items-center gap-6">
          <div className="w-72 h-72 sm:w-80 sm:h-80 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center shadow-strong">
            <CircularWaveform
              audioTrack={audioTrack}
              isThinking={isThinking || (!audioTrack && isCalling)}
              color1="#ff6441"    // XPARK oranje
              color2="#9eae8a"    // XPARK groen
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              disabled={!agentId || isCalling}
              type="button"
            >
              {isCalling ? 'Bezig…' : 'Start gesprek'}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleStop}
              disabled={!isCalling}
              type="button"
            >
              Stop
            </Button>
          </div>
          
          {/* Debug info - tijdelijk */}
          {import.meta.env.DEV && (
            <div className="mt-4 text-xs text-white/30 text-center">
              Debug: agentId={agentId || '(leeg)'}, isCalling={isCalling ? 'true' : 'false'}
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs text-red-400 max-w-sm text-center">
              {error}
            </p>
          )}

          {!agentId && (
            <div className="mt-2 space-y-2">
              <p className="text-[11px] text-white/50 text-center max-w-xs">
                Tip: swipe vanaf de linker schermrand of klik op het{' '}
                <span className="font-semibold">Agent</span>-tabje om de Retell
                agent ID in te stellen.
              </p>
              <button
                onClick={() => {
                  // Trigger AgentPanel open via event
                  const event = new CustomEvent('openAgentPanel');
                  window.dispatchEvent(event);
                }}
                className="text-xs text-xpark-orange underline mx-auto block"
              >
                Open Agent Panel →
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};