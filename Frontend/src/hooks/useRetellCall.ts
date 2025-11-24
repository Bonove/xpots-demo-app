import { useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { RetellWebClient } from 'retell-client-js-sdk';

interface UseRetellCallOptions {
  backendUrl?: string;
}

interface StartCallOptions {
  agentId: string;
}

export function useRetellCall(options?: UseRetellCallOptions) {
  const [isCalling, setIsCalling] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const clientRef = useRef<RetellWebClient | null>(null);

  const backendUrl =
    options?.backendUrl ?? import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080';

  const startCall = useCallback(
    async ({ agentId }: StartCallOptions) => {
      setError(null);

      if (!agentId) {
        setError('Geen agent ID ingesteld');
        return;
      }

      try {
        setIsCalling(true);
        setIsThinking(true);

        // Maak web call aan via backend
        const res = await axios.post(`${backendUrl}/create-web-call`, {
          agent_id: agentId
        });

        const { call_id, access_token } = res.data;

        if (!call_id || !access_token) {
          throw new Error('Geen call_id of access_token ontvangen van backend');
        }

        // Initialiseer Retell Web Client
        const client = new RetellWebClient();
        clientRef.current = client;

        // Setup event handlers
        client.on('conversation-started', () => {
          console.log('Conversation started');
          setIsThinking(false);
        });

        client.on('conversation-ended', () => {
          console.log('Conversation ended');
          setIsCalling(false);
          setIsThinking(false);
          setAudioTrack(null);
          setAnalyserNode(null);
          clientRef.current = null;
        });

        client.on('error', (error: Error) => {
          console.error('Retell client error:', error);
          setError(error.message || 'Fout tijdens gesprek');
          setIsCalling(false);
          setIsThinking(false);
        });

        // Start de call (callId zit in de accessToken JWT)
        await client.startCall({
          accessToken: access_token,
        });

        // Start audio playback
        await client.startAudioPlayback();

        // Gebruik de analyzerComponent voor audio visualisatie
        if (client.analyzerComponent?.analyser) {
          setAnalyserNode(client.analyzerComponent.analyser);
          // Maak een MediaStreamTrack voor compatibiliteit met CircularWaveform
          // We gebruiken de analyser voor visualisatie, maar hebben een track nodig voor de component
          const audioContext = client.analyzerComponent.analyser.context as AudioContext;
          const destination = audioContext.createMediaStreamDestination();
          const tracks = destination.stream.getAudioTracks();
          if (tracks.length > 0) {
            setAudioTrack(tracks[0]);
          }
        }

        setIsThinking(false);
      } catch (e: unknown) {
        console.error('Error starting call:', e);
        let errorMessage = 'Onbekende fout bij het starten van het gesprek';
        if (axios.isAxiosError(e)) {
          errorMessage = 
            (e.response?.data && typeof e.response.data === 'object' && 'error' in e.response.data && typeof e.response.data.error === 'string')
              ? e.response.data.error
              : e.message || errorMessage;
        } else if (e instanceof Error) {
          errorMessage = e.message;
        }
        setError(errorMessage);
        setIsCalling(false);
        setIsThinking(false);
        clientRef.current = null;
      }
    },
    [backendUrl]
  );

  const stopCall = useCallback(async () => {
    try {
      if (clientRef.current) {
        clientRef.current.stopCall();
        clientRef.current = null;
      }
      if (audioTrack) {
        audioTrack.stop();
        setAudioTrack(null);
      }
      setAnalyserNode(null);
      setIsCalling(false);
      setIsThinking(false);
    } catch (e) {
      console.error('Error stopping call:', e);
      // Force cleanup even if stopCall fails
      if (audioTrack) {
        audioTrack.stop();
        setAudioTrack(null);
      }
      setAnalyserNode(null);
      setIsCalling(false);
      setIsThinking(false);
      clientRef.current = null;
    }
  }, [audioTrack]);

  return {
    isCalling,
    isThinking,
    error,
    audioTrack,
    analyserNode,
    startCall,
    stopCall
  };
}