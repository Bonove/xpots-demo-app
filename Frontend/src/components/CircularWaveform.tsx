import React, { useEffect, useRef } from 'react';
import type { CircularWaveformProps } from '@pipecat-ai/voice-ui-kit';

export const CircularWaveform: React.FC<CircularWaveformProps> = ({
  size = 200,
  isThinking = false,
  audioTrack = null,
  className = '',
  color1 = '#ff6441',
  color2 = '#9eae8a',
  backgroundColor = 'transparent',
  sensitivity = 0.5,
  rotationEnabled = true,
  numBars = 32,
  barWidth = 4,
  debug = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Audio setup
    if (audioTrack && !audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) throw new Error('AudioContext not supported');
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
        source.connect(analyser);

        analyserRef.current = analyser;
        audioContextRef.current = audioContext;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      } catch (error) {
        if (debug) console.error('Error setting up audio:', error);
      }
    }

    const draw = () => {
      if (!ctx || !canvasRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.7;
      const barLength = radius * 0.3;

      // Get audio data
      let audioData: Uint8Array | null = null;
      if (audioTrack && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        audioData = dataArrayRef.current;
      }

      // Rotate if enabled
      if (rotationEnabled && (isThinking || audioTrack)) {
        rotationRef.current += 0.5;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotationRef.current * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
      }

      // Draw bars
      const angleStep = (2 * Math.PI) / numBars;
      for (let i = 0; i < numBars; i++) {
        const angle = i * angleStep;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);

        // Calculate bar height based on audio or thinking state
        let barHeight = 0;
        if (isThinking) {
          barHeight = barLength * (0.3 + Math.sin(Date.now() / 200 + i * 0.5) * 0.7);
        } else if (audioData) {
          const dataIndex = Math.floor((i / numBars) * audioData.length);
          const normalizedValue = audioData[dataIndex] / 255;
          barHeight = barLength * normalizedValue * sensitivity;
        }

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = barWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(
          centerX + Math.cos(angle) * (radius + barHeight),
          centerY + Math.sin(angle) * (radius + barHeight)
        );
        ctx.stroke();
      }

      if (rotationEnabled && (isThinking || audioTrack)) {
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      dataArrayRef.current = null;
    };
  }, [size, isThinking, audioTrack, color1, color2, backgroundColor, sensitivity, rotationEnabled, numBars, barWidth, debug]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ backgroundColor }}
    />
  );
};

