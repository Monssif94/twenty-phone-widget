import { useEffect, useRef, useState } from 'react';
import { TwilioVoiceService } from '../services/TwilioVoiceService';

interface UseTwilioVoiceReturn {
  isConnected: boolean;
  isRegistered: boolean;
  currentCall: any | null;
  incomingCall: any | null;
  isMuted: boolean;
  isOnHold: boolean;
  makeCall: (phoneNumber: string) => Promise<void>;
  answerCall: () => void;
  rejectCall: () => void;
  hangup: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
  sendDTMF: (digit: string) => void;
}

export const useTwilioVoice = (): UseTwilioVoiceReturn => {
  const serviceRef = useRef<TwilioVoiceService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch access token from server
  const fetchAccessToken = async () => {
    const tokenServerUrl = import.meta.env.VITE_TOKEN_SERVER_URL || 'http://localhost:3001';
    const identity = `twenty-user-${Date.now()}`;
    
    try {
      const response = await fetch(`${tokenServerUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identity }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  };

  // Initialize service
  useEffect(() => {
    // Skip if already initialized or initializing
    if (isInitialized || serviceRef.current) return;
    
    const initService = async () => {
      try {
        console.log('🎯 Initializing Twilio Voice SDK...');
        
        // Get access token
        const token = await fetchAccessToken();
        
        // Create service instance
        const service = new TwilioVoiceService();
        serviceRef.current = service;
        
        // Setup event listeners
        service.on('connected', () => {
          console.log('✅ Connected to Twilio');
          setIsConnected(true);
        });
        
        service.on('registered', () => {
          console.log('📞 Device registered');
          setIsRegistered(true);
        });
        
        service.on('disconnected', () => {
          console.log('❌ Disconnected from Twilio');
          setIsConnected(false);
          setIsRegistered(false);
        });
        
        service.on('incomingCall', (data: any) => {
          console.log('📲 Incoming call:', data);
          setIncomingCall(data);
        });
        
        service.on('callAccepted', (session: any) => {
          console.log('📞 Call accepted:', session);
          setCurrentCall(session);
          setIncomingCall(null);
        });
        
        service.on('callEnded', (session: any) => {
          console.log('📵 Call ended:', session);
          setCurrentCall(null);
          setIncomingCall(null);
          setIsMuted(false);
          setIsOnHold(false);
        });
        
        service.on('callFailed', (session: any) => {
          console.log('❌ Call failed:', session);
          setCurrentCall(null);
          setIncomingCall(null);
        });
        
        service.on('muteChanged', (muted: boolean) => {
          setIsMuted(muted);
        });
        
        service.on('tokenWillExpire', async () => {
          console.log('🔄 Token expiring, fetching new token...');
          const newToken = await fetchAccessToken();
          service.updateToken(newToken);
        });
        
        // Initialize device with token
        await service.initialize(token);
        
        setIsInitialized(true);
        console.log('✅ Twilio Voice SDK initialized successfully');
        
      } catch (error) {
        console.error('❌ Failed to initialize Twilio Voice SDK:', error);
      }
    };
    
    initService();
    
    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy();
        serviceRef.current = null;
      }
    };
  }, [isInitialized]);

  // Make an outbound call
  const makeCall = async (phoneNumber: string) => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }
    
    try {
      const session = await serviceRef.current.makeCall(phoneNumber);
      setCurrentCall(session);
    } catch (error) {
      console.error('Failed to make call:', error);
      throw error;
    }
  };

  // Answer incoming call
  const answerCall = () => {
    if (!serviceRef.current || !incomingCall) return;
    
    incomingCall.answer();
    setCurrentCall({
      ...incomingCall,
      status: 'connected',
    });
    setIncomingCall(null);
  };

  // Reject incoming call
  const rejectCall = () => {
    if (!serviceRef.current || !incomingCall) return;
    
    incomingCall.reject();
    setIncomingCall(null);
  };

  // Hang up current call
  const hangup = () => {
    if (!serviceRef.current) return;
    
    serviceRef.current.hangup();
    setCurrentCall(null);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!serviceRef.current) return;
    
    if (isMuted) {
      serviceRef.current.unmute();
    } else {
      serviceRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  // Toggle hold (not directly supported by Twilio Voice SDK, simulate with mute)
  const toggleHold = () => {
    if (!serviceRef.current) return;
    
    // For hold, we'll mute the call and set a hold state
    if (isOnHold) {
      serviceRef.current.unmute();
      setIsOnHold(false);
    } else {
      serviceRef.current.mute();
      setIsOnHold(true);
    }
  };

  // Send DTMF tone
  const sendDTMF = (digit: string) => {
    if (!serviceRef.current) return;
    
    serviceRef.current.sendDTMF(digit);
  };

  return {
    isConnected,
    isRegistered,
    currentCall,
    incomingCall,
    isMuted,
    isOnHold,
    makeCall,
    answerCall,
    rejectCall,
    hangup,
    toggleMute,
    toggleHold,
    sendDTMF,
  };
};