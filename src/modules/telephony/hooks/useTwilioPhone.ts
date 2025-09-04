import { useState, useEffect, useCallback, useRef } from 'react';
import { TwilioService } from '../services/TwilioService';
import { CallSession, IncomingCallData } from '../types/telephony.types';

export const useTwilioPhone = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [callHistory, setCallHistory] = useState<CallSession[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  
  const twilioServiceRef = useRef<TwilioService | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Prevent double initialization
    if (twilioServiceRef.current) return;
    
    // Initialize with environment variables
    const config = {
      sipDomain: import.meta.env.VITE_TWILIO_SIP_DOMAIN || 'autoformai-widget.sip.twilio.com',
      username: import.meta.env.VITE_TWILIO_SIP_USERNAME || 'agent1',
      password: import.meta.env.VITE_TWILIO_SIP_PASSWORD || 'Widget2025Secure!',
      displayName: 'Twenty CRM User',
      autoRegister: true
    };

    const twilioService = new TwilioService(config);
    twilioServiceRef.current = twilioService;

    // Setup event handlers
    twilioService.on('connected', () => setIsConnected(true));
    twilioService.on('disconnected', () => setIsConnected(false));
    twilioService.on('registered', () => setIsRegistered(true));
    twilioService.on('unregistered', () => setIsRegistered(false));

    twilioService.on('incomingCall', (data: IncomingCallData) => {
      setIncomingCall(data);
      // Play ringtone
      if (!ringtoneRef.current) {
        ringtoneRef.current = new Audio('/sounds/ringtone.mp3');
        ringtoneRef.current.loop = true;
      }
      ringtoneRef.current.play().catch(console.error);
    });

    twilioService.on('callAccepted', (session: CallSession) => {
      setCurrentCall(session);
      setIncomingCall(null);
      stopRingtone();
    });

    twilioService.on('callEnded', (session: CallSession) => {
      setCurrentCall(null);
      setCallHistory(prev => [...prev, session]);
      stopRingtone();
      // Log call in CRM
      logCallInCRM(session);
    });

    twilioService.on('callFailed', () => {
      setCurrentCall(null);
      setIncomingCall(null);
      stopRingtone();
    });

    // Start the service
    twilioService.start();

    // Cleanup
    return () => {
      if (twilioServiceRef.current) {
        twilioServiceRef.current.stop();
        twilioServiceRef.current = null;
      }
      stopRingtone();
    };
  }, []);

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const makeCall = useCallback(async (phoneNumber: string) => {
    if (!twilioServiceRef.current) {
      throw new Error('Twilio service not initialized');
    }

    try {
      const session = await twilioServiceRef.current.makeCall(phoneNumber);
      setCurrentCall(session);
      return session;
    } catch (error) {
      console.error('Failed to make call:', error);
      throw error;
    }
  }, []);

  const answerCall = useCallback(() => {
    if (twilioServiceRef.current && incomingCall) {
      twilioServiceRef.current.answerCall(incomingCall.session);
      setIncomingCall(null);
      stopRingtone();
    }
  }, [incomingCall]);

  const rejectCall = useCallback(() => {
    if (twilioServiceRef.current && incomingCall) {
      twilioServiceRef.current.rejectCall(incomingCall.session);
      setIncomingCall(null);
      stopRingtone();
    }
  }, [incomingCall]);

  const hangup = useCallback(() => {
    if (twilioServiceRef.current) {
      twilioServiceRef.current.hangup();
      setCurrentCall(null);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (twilioServiceRef.current) {
      if (isMuted) {
        twilioServiceRef.current.unmute();
      } else {
        twilioServiceRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleHold = useCallback(() => {
    if (twilioServiceRef.current) {
      if (isOnHold) {
        twilioServiceRef.current.unhold();
      } else {
        twilioServiceRef.current.hold();
      }
      setIsOnHold(!isOnHold);
    }
  }, [isOnHold]);

  const sendDTMF = useCallback((tone: string) => {
    if (twilioServiceRef.current) {
      twilioServiceRef.current.sendDTMF(tone);
    }
  }, []);

  // Helper function to log calls in CRM
  const logCallInCRM = async (session: CallSession) => {
    try {
      const token = import.meta.env.VITE_TWENTY_API_TOKEN;
      
      await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation LogCall($input: CallActivityInput!) {
              createCallActivity(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              phoneNumber: session.remoteNumber,
              direction: session.direction,
              duration: session.duration,
              startTime: session.startTime,
              endTime: session.endTime,
              status: session.status
            }
          }
        })
      });
    } catch (error) {
      console.error('Failed to log call in CRM:', error);
    }
  };

  return {
    // State
    isConnected,
    isRegistered,
    currentCall,
    incomingCall,
    callHistory,
    isMuted,
    isOnHold,
    
    // Methods
    makeCall,
    answerCall,
    rejectCall,
    hangup,
    toggleMute,
    toggleHold,
    sendDTMF
  };
};