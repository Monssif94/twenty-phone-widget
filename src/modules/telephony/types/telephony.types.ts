export interface PhoneConfig {
  sipDomain: string;
  username: string;
  password: string;
  displayName: string;
  autoRegister?: boolean;
}

export interface CallSession {
  id: string;
  direction: 'inbound' | 'outbound';
  remoteNumber: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'ringing' | 'connected' | 'ended' | 'failed';
  recordingUrl?: string;
}

export interface PhoneWidgetProps {
  contactId?: string;
  contactPhone?: string;
  onCallStart?: (session: CallSession) => void;
  onCallEnd?: (session: CallSession) => void;
}

export interface IncomingCallData {
  session: any;
  fromNumber: string;
  answer: () => void;
  reject: () => void;
}