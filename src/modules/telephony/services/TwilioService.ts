import JsSIP from 'jssip';
import { PhoneConfig, CallSession } from '../types/telephony.types';

export class TwilioService {
  private ua: JsSIP.UA | null = null;
  private currentSession: JsSIP.RTCSession | null = null;
  private config: PhoneConfig;
  private isConnected: boolean = false;
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(config: PhoneConfig) {
    this.config = config;
    this.initializeUA();
  }

  private initializeUA() {
    // Always enable debug logs for now to diagnose issues
    JsSIP.debug.enable('JsSIP:*');
    
    console.log('🔧 Initializing Twilio with config:', {
      domain: this.config.sipDomain,
      username: this.config.username,
      displayName: this.config.displayName
    });

    // WebSocket connection to Twilio
    const wsUrl = `wss://${this.config.sipDomain}:443`;
    console.log('🌐 Connecting to WebSocket:', wsUrl);
    const socket = new JsSIP.WebSocketInterface(wsUrl);

    // UA Configuration
    const configuration = {
      sockets: [socket],
      uri: `sip:${this.config.username}@${this.config.sipDomain}`,
      password: this.config.password,
      display_name: this.config.displayName,
      register: this.config.autoRegister ?? true,
      register_expires: 600,
      session_timers: false,
      user_agent: 'Twenty CRM Phone Widget v1.0'
    };

    this.ua = new JsSIP.UA(configuration);
    this.setupUAEventHandlers();
  }

  private setupUAEventHandlers() {
    if (!this.ua) return;

    // Connection events
    this.ua.on('connected', () => {
      console.log('✅ Connected to Twilio SIP');
      this.isConnected = true;
      this.emit('connected');
    });

    this.ua.on('disconnected', () => {
      console.log('❌ Disconnected from Twilio SIP');
      this.isConnected = false;
      this.emit('disconnected');
    });

    // Registration events
    this.ua.on('registered', () => {
      console.log('📞 Registered with SIP server');
      this.emit('registered');
    });

    this.ua.on('unregistered', () => {
      console.log('📵 Unregistered from SIP server');
      this.emit('unregistered');
    });

    this.ua.on('registrationFailed', (e: any) => {
      console.error('❌ Registration failed:', e);
      console.error('Error details:', {
        cause: e.cause,
        response: e.response,
        message: e.message
      });
      this.emit('registrationFailed', e);
    });

    // New call session
    this.ua.on('newRTCSession', (e: any) => {
      const session = e.session;
      const isIncoming = e.originator === 'remote';
      
      console.log(isIncoming ? '📲 Incoming call' : '📤 Outgoing call');
      
      this.currentSession = session;
      this.setupSessionEventHandlers(session, isIncoming);
      
      if (isIncoming) {
        this.handleIncomingCall(session, e.request);
      }
    });
  }

  private setupSessionEventHandlers(session: JsSIP.RTCSession, isIncoming: boolean) {
    const callSession: CallSession = {
      id: session.id || Date.now().toString(),
      direction: isIncoming ? 'inbound' : 'outbound',
      remoteNumber: this.extractPhoneNumber(session),
      startTime: new Date(),
      status: 'ringing'
    };

    session.on('progress', () => {
      console.log('Call in progress...');
      callSession.status = 'ringing';
      this.emit('callProgress', callSession);
    });

    session.on('accepted', () => {
      console.log('Call accepted');
      callSession.status = 'connected';
      callSession.startTime = new Date();
      this.emit('callAccepted', callSession);
    });

    session.on('confirmed', () => {
      console.log('Call confirmed');
      callSession.status = 'connected';
      this.emit('callConfirmed', callSession);
    });

    session.on('ended', () => {
      console.log('Call ended');
      callSession.status = 'ended';
      callSession.endTime = new Date();
      callSession.duration = Math.round(
        (callSession.endTime.getTime() - callSession.startTime.getTime()) / 1000
      );
      this.currentSession = null;
      this.emit('callEnded', callSession);
    });

    session.on('failed', (e: any) => {
      console.error('Call failed:', e);
      callSession.status = 'failed';
      this.currentSession = null;
      this.emit('callFailed', { ...callSession, error: e });
    });

    // Media events
    session.on('peerconnection', (e: any) => {
      console.log('Peer connection established');
      this.setupMediaStreams(e.peerconnection);
    });
  }

  private setupMediaStreams(peerConnection: RTCPeerConnection) {
    peerConnection.addEventListener('track', (e) => {
      const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
      if (remoteAudio && e.streams[0]) {
        remoteAudio.srcObject = e.streams[0];
      }
    });

    // Monitor connection quality in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(async () => {
        const stats = await peerConnection.getStats();
        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.mediaType === 'audio') {
            console.log('Audio quality:', {
              packetsLost: report.packetsLost,
              jitter: report.jitter,
              packetsReceived: report.packetsReceived
            });
          }
        });
      }, 5000);
    }
  }

  private handleIncomingCall(session: JsSIP.RTCSession, request: any) {
    const fromNumber = this.extractPhoneNumberFromRequest(request);
    
    this.emit('incomingCall', {
      session,
      fromNumber,
      answer: () => this.answerCall(session),
      reject: () => this.rejectCall(session)
    });
  }

  // Public methods
  public start() {
    if (this.ua) {
      this.ua.start();
    }
  }

  public stop() {
    if (this.ua) {
      this.ua.stop();
    }
  }

  public makeCall(phoneNumber: string): Promise<CallSession> {
    return new Promise((resolve, reject) => {
      if (!this.ua || !this.isConnected) {
        reject(new Error('Phone not connected'));
        return;
      }

      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      const uri = `sip:${formattedNumber}@${this.config.sipDomain}`;

      const eventHandlers = {
        'progress': () => console.log('Call progress'),
        'confirmed': () => resolve({
          id: Date.now().toString(),
          direction: 'outbound',
          remoteNumber: phoneNumber,
          startTime: new Date(),
          status: 'connected'
        }),
        'failed': (e: any) => reject(e)
      };

      const options = {
        eventHandlers,
        mediaConstraints: { audio: true, video: false },
        pcConfig: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        }
      };

      const session = this.ua.call(uri, options);
      this.currentSession = session;
    });
  }

  public answerCall(session?: JsSIP.RTCSession) {
    const targetSession = session || this.currentSession;
    if (targetSession) {
      targetSession.answer({
        mediaConstraints: { audio: true, video: false }
      });
    }
  }

  public rejectCall(session?: JsSIP.RTCSession) {
    const targetSession = session || this.currentSession;
    if (targetSession) {
      targetSession.terminate();
    }
  }

  public hangup() {
    if (this.currentSession) {
      this.currentSession.terminate();
    }
  }

  public mute() {
    if (this.currentSession) {
      this.currentSession.mute({ audio: true });
    }
  }

  public unmute() {
    if (this.currentSession) {
      this.currentSession.unmute({ audio: true });
    }
  }

  public hold() {
    if (this.currentSession) {
      this.currentSession.hold();
    }
  }

  public unhold() {
    if (this.currentSession) {
      this.currentSession.unhold();
    }
  }

  public sendDTMF(tone: string) {
    if (this.currentSession) {
      this.currentSession.sendDTMF(tone);
    }
  }

  // Event emitter methods
  public on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: string, handler: Function) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  // Utility methods
  private extractPhoneNumber(session: JsSIP.RTCSession): string {
    const remoteIdentity = session.remote_identity;
    if (remoteIdentity && remoteIdentity.uri) {
      const user = remoteIdentity.uri.user;
      return user || 'Unknown';
    }
    return 'Unknown';
  }

  private extractPhoneNumberFromRequest(request: any): string {
    if (request.from && request.from.uri) {
      return request.from.uri.user || 'Unknown';
    }
    return 'Unknown';
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.startsWith('0')) {
      cleaned = '33' + cleaned.substring(1); // France
    }
    
    return '+' + cleaned;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getCurrentCall(): CallSession | null {
    if (!this.currentSession) return null;
    
    return {
      id: this.currentSession.id || Date.now().toString(),
      direction: this.currentSession.direction === 'incoming' ? 'inbound' : 'outbound',
      remoteNumber: this.extractPhoneNumber(this.currentSession),
      startTime: new Date(),
      status: 'connected'
    };
  }
}