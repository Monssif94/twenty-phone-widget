import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTwilioPhone } from '../../hooks/useTwilioPhone';
import { twentyTheme, rgba } from '../../theme/twentyTheme';

// ========== Container Components ==========

const WidgetContainer = styled.div`
  position: fixed;
  bottom: ${twentyTheme.spacing.xl};
  right: ${twentyTheme.spacing.xl};
  z-index: ${twentyTheme.zIndex.popover};
  font-family: ${twentyTheme.typography.fontFamily};
`;

const FloatingButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: ${twentyTheme.borderRadius.rounded};
  background: ${twentyTheme.colors.primary};
  border: 1px solid ${twentyTheme.colors.border.light};
  color: ${twentyTheme.colors.text.inverted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${twentyTheme.shadows.medium};
  transition: all ${twentyTheme.animation.duration.fast} ${twentyTheme.animation.easing.default};
  font-size: ${twentyTheme.typography.fontSize.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${twentyTheme.shadows.strong};
    background: ${twentyTheme.colors.hover.primary};
  }

  &:active {
    transform: translateY(0);
  }

  &.pulse {
    animation: twentyPulse 2s infinite;
  }

  @keyframes twentyPulse {
    0% {
      box-shadow: 0 0 0 0 ${rgba(twentyTheme.colors.primary, 0.4)};
    }
    70% {
      box-shadow: 0 0 0 16px ${rgba(twentyTheme.colors.primary, 0)};
    }
    100% {
      box-shadow: 0 0 0 0 ${rgba(twentyTheme.colors.primary, 0)};
    }
  }
`;

const CallInterface = styled.div`
  position: absolute;
  bottom: calc(56px + ${twentyTheme.spacing.md});
  right: 0;
  width: 360px;
  background: ${twentyTheme.colors.background.primary};
  border: 1px solid ${twentyTheme.colors.border.light};
  border-radius: ${twentyTheme.borderRadius.md};
  box-shadow: ${twentyTheme.shadows.dropdown};
  padding: ${twentyTheme.spacing.xl};
  animation: slideUp ${twentyTheme.animation.duration.normal} ${twentyTheme.animation.easing.easeOut};

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(${twentyTheme.spacing.md});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ========== Status Components ==========

const StatusBadge = styled.div<{ status: 'connected' | 'disconnected' | 'calling' }>`
  padding: ${twentyTheme.spacing.xs} ${twentyTheme.spacing.md};
  border-radius: ${twentyTheme.borderRadius.sm};
  font-size: ${twentyTheme.typography.fontSize.xs};
  font-weight: ${twentyTheme.typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: ${twentyTheme.spacing.xs};
  margin-bottom: ${twentyTheme.spacing.lg};
  
  ${({ status }) => {
    switch (status) {
      case 'connected':
        return `
          background: ${rgba(twentyTheme.colors.success, 0.1)};
          color: ${twentyTheme.colors.success};
          border: 1px solid ${rgba(twentyTheme.colors.success, 0.2)};
        `;
      case 'calling':
        return `
          background: ${rgba(twentyTheme.colors.warning, 0.1)};
          color: ${twentyTheme.colors.warning};
          border: 1px solid ${rgba(twentyTheme.colors.warning, 0.2)};
        `;
      case 'disconnected':
        return `
          background: ${rgba(twentyTheme.colors.error, 0.1)};
          color: ${twentyTheme.colors.error};
          border: 1px solid ${rgba(twentyTheme.colors.error, 0.2)};
        `;
    }
  }}
`;

// ========== Call Interface Components ==========

const ContactInfo = styled.div`
  margin: ${twentyTheme.spacing.xl} 0;
  text-align: center;
  
  h3 {
    font-size: ${twentyTheme.typography.fontSize.lg};
    font-weight: ${twentyTheme.typography.fontWeight.semiBold};
    color: ${twentyTheme.colors.text.primary};
    margin: 0 0 ${twentyTheme.spacing.xs} 0;
  }
  
  p {
    color: ${twentyTheme.colors.text.secondary};
    margin: 0;
    font-size: ${twentyTheme.typography.fontSize.sm};
  }
`;

const CallTimer = styled.div`
  font-size: ${twentyTheme.typography.fontSize.xxl};
  font-weight: ${twentyTheme.typography.fontWeight.regular};
  text-align: center;
  margin: ${twentyTheme.spacing.xl} 0;
  font-variant-numeric: tabular-nums;
  color: ${twentyTheme.colors.text.primary};
  font-family: 'Inter', monospace;
`;

const CallControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${twentyTheme.spacing.sm};
  margin-top: ${twentyTheme.spacing.xl};
`;

const ControlButton = styled.button<{ variant?: 'danger' | 'muted' | 'primary' }>`
  padding: ${twentyTheme.spacing.md};
  border-radius: ${twentyTheme.borderRadius.md};
  border: 1px solid ${twentyTheme.colors.border.light};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${twentyTheme.animation.duration.fast} ${twentyTheme.animation.easing.default};
  font-size: ${twentyTheme.typography.fontSize.lg};
  background: ${twentyTheme.colors.background.primary};
  
  ${({ variant }) => {
    if (variant === 'danger') {
      return `
        background: ${twentyTheme.colors.error};
        color: ${twentyTheme.colors.text.inverted};
        border-color: ${twentyTheme.colors.error};
        
        &:hover {
          background: ${rgba(twentyTheme.colors.error, 0.9)};
          transform: translateY(-1px);
        }
      `;
    } else if (variant === 'muted') {
      return `
        background: ${twentyTheme.colors.text.secondary};
        color: ${twentyTheme.colors.text.inverted};
        border-color: ${twentyTheme.colors.text.secondary};
        
        &:hover {
          background: ${twentyTheme.colors.hover.secondary};
        }
      `;
    } else if (variant === 'primary') {
      return `
        background: ${twentyTheme.colors.primary};
        color: ${twentyTheme.colors.text.inverted};
        border-color: ${twentyTheme.colors.primary};
        
        &:hover {
          background: ${twentyTheme.colors.hover.primary};
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: ${twentyTheme.colors.background.secondary};
        color: ${twentyTheme.colors.text.primary};
        
        &:hover {
          background: ${twentyTheme.colors.background.tertiary};
        }
      `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

// ========== Input Components ==========

const PhoneInput = styled.input`
  width: 100%;
  padding: ${twentyTheme.spacing.md} ${twentyTheme.spacing.lg};
  border: 1px solid ${twentyTheme.colors.border.medium};
  border-radius: ${twentyTheme.borderRadius.sm};
  font-size: ${twentyTheme.typography.fontSize.md};
  font-family: ${twentyTheme.typography.fontFamily};
  margin-bottom: ${twentyTheme.spacing.lg};
  transition: all ${twentyTheme.animation.duration.fast} ${twentyTheme.animation.easing.default};
  background: ${twentyTheme.colors.background.primary};
  color: ${twentyTheme.colors.text.primary};
  
  &::placeholder {
    color: ${twentyTheme.colors.text.light};
  }
  
  &:focus {
    outline: none;
    border-color: ${twentyTheme.colors.primary};
    box-shadow: 0 0 0 3px ${rgba(twentyTheme.colors.primary, 0.1)};
  }
  
  &:hover {
    border-color: ${twentyTheme.colors.text.tertiary};
  }
`;

const CallButton = styled.button`
  width: 100%;
  padding: ${twentyTheme.spacing.md} ${twentyTheme.spacing.lg};
  border-radius: ${twentyTheme.borderRadius.sm};
  border: none;
  background: ${twentyTheme.colors.primary};
  color: ${twentyTheme.colors.text.inverted};
  font-size: ${twentyTheme.typography.fontSize.md};
  font-weight: ${twentyTheme.typography.fontWeight.medium};
  font-family: ${twentyTheme.typography.fontFamily};
  cursor: pointer;
  transition: all ${twentyTheme.animation.duration.fast} ${twentyTheme.animation.easing.default};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${twentyTheme.spacing.sm};

  &:hover:not(:disabled) {
    background: ${twentyTheme.colors.hover.primary};
    transform: translateY(-1px);
    box-shadow: ${twentyTheme.shadows.primaryButton};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${twentyTheme.colors.text.light};
  }
`;

// ========== Dialpad Components ==========

const DialPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${twentyTheme.spacing.sm};
  margin-top: ${twentyTheme.spacing.xl};
  padding: ${twentyTheme.spacing.lg};
  background: ${twentyTheme.colors.background.secondary};
  border-radius: ${twentyTheme.borderRadius.md};
`;

const DialButton = styled.button`
  padding: ${twentyTheme.spacing.md};
  border: 1px solid ${twentyTheme.colors.border.light};
  border-radius: ${twentyTheme.borderRadius.sm};
  background: ${twentyTheme.colors.background.primary};
  color: ${twentyTheme.colors.text.primary};
  font-size: ${twentyTheme.typography.fontSize.lg};
  font-weight: ${twentyTheme.typography.fontWeight.medium};
  font-family: ${twentyTheme.typography.fontFamily};
  cursor: pointer;
  transition: all ${twentyTheme.animation.duration.instant} ${twentyTheme.animation.easing.default};
  
  &:hover {
    background: ${twentyTheme.colors.background.tertiary};
    border-color: ${twentyTheme.colors.border.medium};
  }
  
  &:active {
    background: ${twentyTheme.colors.background.quaternary};
    transform: scale(0.98);
  }
`;

// ========== Modal Components ==========

const IncomingCallModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${twentyTheme.colors.background.primary};
  border: 1px solid ${twentyTheme.colors.border.light};
  border-radius: ${twentyTheme.borderRadius.xl};
  box-shadow: ${twentyTheme.shadows.modal};
  padding: ${twentyTheme.spacing.xxl};
  z-index: ${twentyTheme.zIndex.modal};
  text-align: center;
  min-width: 360px;
  animation: twentyModalBounce ${twentyTheme.animation.duration.normal} ${twentyTheme.animation.easing.default};

  @keyframes twentyModalBounce {
    0% {
      opacity: 0;
      transform: translate(-50%, -45%) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  h2 {
    color: ${twentyTheme.colors.text.primary};
    font-size: ${twentyTheme.typography.fontSize.xl};
    font-weight: ${twentyTheme.typography.fontWeight.semiBold};
    margin: 0 0 ${twentyTheme.spacing.md} 0;
  }
  
  p {
    color: ${twentyTheme.colors.text.primary};
    font-size: ${twentyTheme.typography.fontSize.lg};
    font-weight: ${twentyTheme.typography.fontWeight.medium};
    margin: ${twentyTheme.spacing.xl} 0;
  }
`;

// ========== Additional UI Components ==========

const ButtonGroup = styled.div`
  display: flex;
  gap: ${twentyTheme.spacing.md};
  margin-top: ${twentyTheme.spacing.lg};
`;

const CloseButton = styled.button`
  flex: 1;
  padding: ${twentyTheme.spacing.sm} ${twentyTheme.spacing.md};
  border: 1px solid ${twentyTheme.colors.border.medium};
  border-radius: ${twentyTheme.borderRadius.sm};
  background: ${twentyTheme.colors.background.primary};
  color: ${twentyTheme.colors.text.secondary};
  font-size: ${twentyTheme.typography.fontSize.sm};
  font-weight: ${twentyTheme.typography.fontWeight.medium};
  font-family: ${twentyTheme.typography.fontFamily};
  cursor: pointer;
  transition: all ${twentyTheme.animation.duration.fast} ${twentyTheme.animation.easing.default};
  
  &:hover {
    background: ${twentyTheme.colors.background.secondary};
    border-color: ${twentyTheme.colors.text.tertiary};
  }
`;

// ========== Main Component ==========

export const PhoneWidgetTwenty: React.FC = () => {
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
        <h2>Appel entrant</h2>
        <p>{formatPhoneDisplay(incomingCall.fromNumber)}</p>
        <ButtonGroup>
          <ControlButton
            onClick={answerCall}
            variant="primary"
            style={{ flex: 1 }}
          >
            Répondre
          </ControlButton>
          <ControlButton
            onClick={rejectCall}
            variant="danger"
            style={{ flex: 1 }}
          >
            Rejeter
          </ControlButton>
        </ButtonGroup>
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
            {currentCall ? '📞' : '📱'}
          </FloatingButton>
        )}

        {/* Call interface */}
        {isOpen && (
          <CallInterface>
            {/* Status indicator */}
            <StatusBadge 
              status={currentCall ? 'calling' : (isConnected ? 'connected' : 'disconnected')}
            >
              {currentCall ? 'En appel' : (isConnected ? 'Connecté' : 'Déconnecté')}
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
                    Raccrocher
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
                  placeholder="Numéro de téléphone"
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
                  {!isRegistered ? 'Connexion...' : 'Appeler'}
                </CallButton>

                {/* Dialpad for number entry */}
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

                {/* Clear and close buttons */}
                <ButtonGroup>
                  <CloseButton onClick={() => setPhoneNumber('')}>
                    Effacer
                  </CloseButton>
                  <CloseButton onClick={() => setIsOpen(false)}>
                    Fermer
                  </CloseButton>
                </ButtonGroup>
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

export default PhoneWidgetTwenty;