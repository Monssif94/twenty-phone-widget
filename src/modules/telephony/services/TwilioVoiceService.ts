import { Device, Call } from '@twilio/voice-sdk';
import { CallSession } from '../types/telephony.types';

export class TwilioVoiceService {
  private device: Device | null = null;
  private currentCall: Call | null = null;
  private isConnected: boolean = false;
  private eventHandlers: Map<string, Function[]> = new Map();
  private accessToken: string = '';

  constructor() {
    console.log('🎯 TwilioVoiceService initialized - Using official Twilio Voice SDK');
  }

  // Initialize with access token (needs to be generated server-side)
  public async initialize(token: string) {
    console.log('🔧 Initializing Twilio Voice Device with token');
    this.accessToken = token;
    
    try {
      // Create a new Device instance with the access token
      this.device = new Device(token, {
        logLevel: 'debug',
        edge: 'dublin', // Use Dublin edge for better European connectivity
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true
      });

      this.setupDeviceEventHandlers();
      
      // Register the device
      await this.device.register();
      console.log('✅ Device registered successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Twilio Device:', error);
      throw error;
    }
  }

  private setupDeviceEventHandlers() {
    if (!this.device) return;

    // Device ready
    this.device.on('registered', () => {
      console.log('📞 Device registered and ready');
      this.isConnected = true;
      this.emit('registered');
      this.emit('connected');
    });

    this.device.on('unregistered', () => {
      console.log('📵 Device unregistered');
      this.isConnected = false;
      this.emit('unregistered');
      this.emit('disconnected');
    });

    this.device.on('error', (error) => {
      console.error('❌ Device error:', error);
      this.emit('error', error);
    });

    this.device.on('tokenWillExpire', () => {
      console.warn('⚠️ Token will expire soon');
      this.emit('tokenWillExpire');
    });

    // Incoming call
    this.device.on('incoming', (call: Call) => {
      console.log('📲 Incoming call from:', call.parameters.From);
      this.currentCall = call;
      this.setupCallEventHandlers(call, true);
      
      this.emit('incomingCall', {
        session: call,
        fromNumber: call.parameters.From || 'Unknown',
        answer: () => this.answerCall(call),
        reject: () => this.rejectCall(call)
      });
    });
  }

  private setupCallEventHandlers(call: Call, isIncoming: boolean) {
    const callSession: CallSession = {
      id: call.parameters.CallSid || Date.now().toString(),
      direction: isIncoming ? 'inbound' : 'outbound',
      remoteNumber: call.parameters.From || call.parameters.To || 'Unknown',
      startTime: new Date(),
      status: 'ringing'
    };

    call.on('accept', () => {
      console.log('✅ Call accepted');
      callSession.status = 'connected';
      callSession.startTime = new Date();
      this.emit('callAccepted', callSession);
    });

    call.on('disconnect', () => {
      console.log('📵 Call disconnected');
      callSession.status = 'ended';
      callSession.endTime = new Date();
      callSession.duration = Math.round(
        (callSession.endTime.getTime() - callSession.startTime.getTime()) / 1000
      );
      this.currentCall = null;
      this.emit('callEnded', callSession);
    });

    call.on('cancel', () => {
      console.log('❌ Call cancelled');
      callSession.status = 'failed';
      this.currentCall = null;
      this.emit('callFailed', callSession);
    });

    call.on('reject', () => {
      console.log('❌ Call rejected');
      callSession.status = 'failed';
      this.currentCall = null;
      this.emit('callFailed', callSession);
    });

    call.on('mute', (isMuted: boolean) => {
      console.log(isMuted ? '🔇 Muted' : '🔊 Unmuted');
      this.emit('muteChanged', isMuted);
    });
  }

  // Make an outbound call
  public async makeCall(phoneNumber: string): Promise<CallSession> {
    if (!this.device) {
      throw new Error('Device not initialized');
    }

    console.log('📤 Making call to:', phoneNumber);
    
    // Format phone number
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    
    try {
      // Connect call with parameters
      const call = await this.device.connect({
        params: {
          To: formattedNumber
        }
      });

      this.currentCall = call;
      this.setupCallEventHandlers(call, false);

      return {
        id: call.parameters.CallSid || Date.now().toString(),
        direction: 'outbound',
        remoteNumber: formattedNumber,
        startTime: new Date(),
        status: 'ringing'
      };
    } catch (error) {
      console.error('❌ Failed to make call:', error);
      throw error;
    }
  }

  public answerCall(call?: Call) {
    const targetCall = call || this.currentCall;
    if (targetCall) {
      targetCall.accept();
    }
  }

  public rejectCall(call?: Call) {
    const targetCall = call || this.currentCall;
    if (targetCall) {
      targetCall.reject();
    }
  }

  public hangup() {
    if (this.currentCall) {
      this.currentCall.disconnect();
    }
  }

  public mute() {
    if (this.currentCall) {
      this.currentCall.mute(true);
    }
  }

  public unmute() {
    if (this.currentCall) {
      this.currentCall.mute(false);
    }
  }

  public sendDTMF(digit: string) {
    if (this.currentCall) {
      this.currentCall.sendDigits(digit);
    }
  }

  // Update token when it's about to expire
  public updateToken(newToken: string) {
    if (this.device) {
      this.device.updateToken(newToken);
      console.log('🔄 Token updated');
    }
  }

  // Destroy device and cleanup
  public destroy() {
    if (this.currentCall) {
      this.currentCall.disconnect();
    }
    if (this.device) {
      this.device.destroy();
      this.device = null;
    }
    this.isConnected = false;
    this.eventHandlers.clear();
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
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.startsWith('0')) {
      cleaned = '33' + cleaned.substring(1); // France
    }
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getCurrentCall(): CallSession | null {
    if (!this.currentCall) return null;
    
    return {
      id: this.currentCall.parameters.CallSid || Date.now().toString(),
      direction: this.currentCall.isMuted() ? 'inbound' : 'outbound',
      remoteNumber: this.currentCall.parameters.From || this.currentCall.parameters.To || 'Unknown',
      startTime: new Date(),
      status: 'connected'
    };
  }
}