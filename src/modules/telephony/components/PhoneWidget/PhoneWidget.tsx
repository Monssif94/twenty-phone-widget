import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTwilioPhone } from '../../hooks/useTwilioPhone';

// Styled Components
const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const FloatingButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: 24px;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &.pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
    }
  }
`;

const CallInterface = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 20px;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StatusBadge = styled.div<{ status: 'connected' | 'disconnected' | 'calling' }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 15px;
  
  ${({ status }) => {
    switch (status) {
      case 'connected':
        return `
          background: #e6fffa;
          color: #047857;
        `;
      case 'calling':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'disconnected':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
    }
  }}
`;

const ContactInfo = styled.div`
  margin: 20px 0;
  text-align: center;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 5px 0;
  }
  
  p {
    color: #6b7280;
    margin: 0;
    font-size: 14px;
  }
`;

const CallTimer = styled.div`
  font-size: 32px;
  font-weight: 300;
  text-align: center;
  margin: 20px 0;
  font-variant-numeric: tabular-nums;
  color: #1f2937;
`;

const CallControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const ControlButton = styled.button<{ variant?: 'danger' | 'muted' | 'primary' }>`
  padding: 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 20px;
  
  ${({ variant }) => {
    if (variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover {
          background: #dc2626;
        }
      `;
    } else if (variant === 'muted') {
      return `
        background: #9ca3af;
        color: white;
        &:hover {
          background: #6b7280;
        }
      `;
    } else if (variant === 'primary') {
      return `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        &:hover {
          transform: scale(1.05);
        }
      `;
    } else {
      return `
        background: #f3f4f6;
        color: #1f2937;
        &:hover {
          background: #e5e7eb;
        }
      `;
    }
  }}
`;

const PhoneInput = styled.input`
  width: 100%;
  padding: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 15px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CallButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DialPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const DialButton = styled.button`
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #667eea;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const IncomingCallModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  padding: 30px;
  z-index: 2000;
  text-align: center;
  min-width: 300px;
  animation: bounce 0.5s ease;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translate(-50%, -50%);
    }
    40% {
      transform: translate(-50%, -55%);
    }
    60% {
      transform: translate(-50%, -52%);
    }
  }
`;

// Component
export const PhoneWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [showDialpad, setShowDialpad] = useState(false);
  
  const {
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
    sendDTMF
  } = useTwilioPhone();

  // Update call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentCall && currentCall.status === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentCall]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMakeCall = async () => {
    if (phoneNumber && phoneNumber.length >= 10) {
      try {
        await makeCall(phoneNumber);
      } catch (error) {
        console.error('Failed to make call:', error);
        alert('Échec de l\'appel. Vérifiez le numéro et réessayez.');
      }
    }
  };

  const handleDialpadClick = (digit: string) => {
    if (currentCall) {
      sendDTMF(digit);
    } else {
      setPhoneNumber(prev => prev + digit);
    }
  };

  const formatPhoneDisplay = (number: string) => {
    // Format French phone numbers for display
    if (number.startsWith('+33')) {
      const cleaned = number.substring(3);
      return `+33 ${cleaned.match(/.{1,2}/g)?.join(' ') || cleaned}`;
    }
    return number;
  };

  // Render incoming call modal
  if (incomingCall && !currentCall) {
    return (
      <IncomingCallModal>
        <h2 style={{ margin: '0 0 10px 0' }}>📲 Appel entrant</h2>
        <p style={{ fontSize: '20px', margin: '20px 0', fontWeight: 'bold' }}>
          {formatPhoneDisplay(incomingCall.fromNumber)}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <ControlButton
            onClick={answerCall}
            variant="primary"
            style={{ padding: '15px 30px' }}
          >
            ✅ Répondre
          </ControlButton>
          <ControlButton
            onClick={rejectCall}
            variant="danger"
            style={{ padding: '15px 30px' }}
          >
            ❌ Rejeter
          </ControlButton>
        </div>
      </IncomingCallModal>
    );
  }

  return (
    <>
      <WidgetContainer>
        {/* Floating button */}
        {!isOpen && (
          <FloatingButton 
            onClick={() => setIsOpen(true)}
            className={currentCall ? 'pulse' : ''}
          >
            {currentCall ? '📞' : '☎️'}
          </FloatingButton>
        )}

        {/* Call interface */}
        {isOpen && (
          <CallInterface>
            {/* Status indicator */}
            <StatusBadge 
              status={currentCall ? 'calling' : (isConnected ? 'connected' : 'disconnected')}
            >
              {currentCall ? '📞 En appel' : (isConnected ? '✅ Connecté' : '❌ Déconnecté')}
            </StatusBadge>

            {/* Current call interface */}
            {currentCall ? (
              <>
                <ContactInfo>
                  <h3>Appel en cours</h3>
                  <p>{formatPhoneDisplay(currentCall.remoteNumber)}</p>
                </ContactInfo>

                <CallTimer>{formatDuration(callDuration)}</CallTimer>

                <CallControls>
                  <ControlButton
                    onClick={toggleMute}
                    variant={isMuted ? 'muted' : undefined}
                    title={isMuted ? 'Réactiver micro' : 'Couper micro'}
                  >
                    {isMuted ? '🔇' : '🎤'}
                  </ControlButton>
                  
                  <ControlButton 
                    onClick={() => setShowDialpad(!showDialpad)}
                    title="Clavier"
                  >
                    #️⃣
                  </ControlButton>
                  
                  <ControlButton 
                    onClick={toggleHold}
                    title={isOnHold ? 'Reprendre' : 'Mettre en attente'}
                  >
                    {isOnHold ? '▶️' : '⏸️'}
                  </ControlButton>
                  
                  <ControlButton 
                    onClick={hangup}
                    variant="danger"
                    style={{ gridColumn: 'span 3' }}
                  >
                    📵 Raccrocher
                  </ControlButton>
                </CallControls>

                {/* Dialpad for DTMF */}
                {showDialpad && (
                  <DialPad>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
                      <DialButton
                        key={digit}
                        onClick={() => handleDialpadClick(digit)}
                      >
                        {digit}
                      </DialButton>
                    ))}
                  </DialPad>
                )}
              </>
            ) : (
              <>
                {/* Dial interface */}
                <PhoneInput
                  type="tel"
                  placeholder="Ex: 0612345678 ou +33612345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && phoneNumber.length >= 10) {
                      handleMakeCall();
                    }
                  }}
                />
                
                <CallButton
                  onClick={handleMakeCall}
                  disabled={!phoneNumber || phoneNumber.length < 10 || !isRegistered}
                >
                  {!isRegistered ? '⏳ Connexion...' : '📞 Appeler'}
                </CallButton>

                {/* Dialpad for number entry */}
                <DialPad style={{ marginTop: '20px' }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
                    <DialButton
                      key={digit}
                      onClick={() => handleDialpadClick(digit)}
                    >
                      {digit}
                    </DialButton>
                  ))}
                </DialPad>

                {/* Clear and close buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setPhoneNumber('')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Effacer
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#f3f4f6',
                      cursor: 'pointer'
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </CallInterface>
        )}
      </WidgetContainer>

      {/* Hidden audio element for remote stream */}
      <audio id="remote-audio" autoPlay />
    </>
  );
};

export default PhoneWidget;