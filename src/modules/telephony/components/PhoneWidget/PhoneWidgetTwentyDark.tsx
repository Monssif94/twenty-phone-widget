import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTwilioVoice } from '../../hooks/useTwilioVoice';
import { twentyDarkTheme as theme, rgba } from '../../theme/twentyDarkTheme';

// ========== Container Components ==========

const WidgetContainer = styled.div`
  position: fixed;
  bottom: ${theme.spacing.xl};
  right: ${theme.spacing.xl};
  z-index: ${theme.zIndex.popover};
  font-family: ${theme.typography.fontFamily};
`;

const FloatingButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.rounded};
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.border.light};
  color: ${theme.colors.background.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadows.primaryButton};
  transition: all ${theme.animation.duration.fast} ${theme.animation.easing.default};
  font-size: ${theme.typography.fontSize.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${rgba(theme.colors.primary, 0.4)};
    background: ${theme.colors.hover.primary};
  }

  &:active {
    transform: translateY(0);
  }

  &.pulse {
    animation: darkPulse 2s infinite;
  }

  @keyframes darkPulse {
    0% {
      box-shadow: 0 0 0 0 ${rgba(theme.colors.primary, 0.6)};
    }
    70% {
      box-shadow: 0 0 0 16px ${rgba(theme.colors.primary, 0)};
    }
    100% {
      box-shadow: 0 0 0 0 ${rgba(theme.colors.primary, 0)};
    }
  }
`;

const CallInterface = styled.div`
  position: absolute;
  bottom: calc(56px + ${theme.spacing.md});
  right: 0;
  width: 360px;
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.dropdown};
  padding: ${theme.spacing.xl};
  animation: slideUp ${theme.animation.duration.normal} ${theme.animation.easing.easeOut};

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(${theme.spacing.md});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ========== Status Components ==========

const StatusBadge = styled.div<{ status: 'connected' | 'disconnected' | 'calling' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.lg};
  
  ${({ status }) => {
    switch (status) {
      case 'connected':
        return `
          background: ${rgba(theme.colors.success, 0.15)};
          color: ${theme.colors.success};
          border: 1px solid ${rgba(theme.colors.success, 0.3)};
        `;
      case 'calling':
        return `
          background: ${rgba(theme.colors.warning, 0.15)};
          color: ${theme.colors.warning};
          border: 1px solid ${rgba(theme.colors.warning, 0.3)};
        `;
      case 'disconnected':
        return `
          background: ${rgba(theme.colors.error, 0.15)};
          color: ${theme.colors.error};
          border: 1px solid ${rgba(theme.colors.error, 0.3)};
        `;
    }
  }}
`;

// ========== Call Interface Components ==========

const ContactInfo = styled.div`
  margin: ${theme.spacing.xl} 0;
  text-align: center;
  
  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semiBold};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing.xs} 0;
  }
  
  p {
    color: ${theme.colors.text.secondary};
    margin: 0;
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const CallTimer = styled.div`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.regular};
  text-align: center;
  margin: ${theme.spacing.xl} 0;
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.text.primary};
  font-family: 'Inter', monospace;
`;

const CallControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
`;

const ControlButton = styled.button<{ variant?: 'danger' | 'muted' | 'primary' }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.animation.duration.fast} ${theme.animation.easing.default};
  font-size: ${theme.typography.fontSize.lg};
  background: ${theme.colors.background.secondary};
  
  ${({ variant }) => {
    if (variant === 'danger') {
      return `
        background: ${rgba(theme.colors.error, 0.9)};
        color: ${theme.colors.text.primary};
        border-color: transparent;
        
        &:hover {
          background: ${theme.colors.error};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.dangerButton};
        }
      `;
    } else if (variant === 'muted') {
      return `
        background: ${theme.colors.background.quaternary};
        color: ${theme.colors.text.tertiary};
        border-color: ${theme.colors.border.medium};
        opacity: 0.8;
        
        &:hover {
          opacity: 1;
          background: ${theme.colors.background.tertiary};
        }
      `;
    } else if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.background.primary};
        border-color: transparent;
        
        &:hover {
          background: ${theme.colors.hover.primary};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.primaryButton};
        }
      `;
    } else {
      return `
        background: ${theme.colors.background.tertiary};
        color: ${theme.colors.text.secondary};
        
        &:hover {
          background: ${theme.colors.background.quaternary};
          border-color: ${theme.colors.border.medium};
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
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.md};
  font-family: ${theme.typography.fontFamily};
  margin-bottom: ${theme.spacing.lg};
  transition: all ${theme.animation.duration.fast} ${theme.animation.easing.default};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.primary};
  
  &::placeholder {
    color: ${theme.colors.text.extraLight};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${rgba(theme.colors.primary, 0.2)};
    background: ${theme.colors.background.tertiary};
  }
  
  &:hover {
    border-color: ${theme.colors.border.strong};
    background: ${theme.colors.background.tertiary};
  }
`;

const CallButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.sm};
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.background.primary};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${theme.animation.duration.fast} ${theme.animation.easing.default};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover:not(:disabled) {
    background: ${theme.colors.hover.primary};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.primaryButton};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${theme.colors.background.quaternary};
    color: ${theme.colors.text.extraLight};
  }
`;

// ========== Dialpad Components ==========

const DialPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
`;

const DialButton = styled.button`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background.tertiary};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${theme.animation.duration.instant} ${theme.animation.easing.default};
  
  &:hover {
    background: ${theme.colors.background.quaternary};
    border-color: ${theme.colors.border.medium};
    color: ${theme.colors.primary};
  }
  
  &:active {
    background: ${theme.colors.background.transparentStrong};
    transform: scale(0.98);
  }
`;

// ========== Modal Components ==========

const IncomingCallModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.modal};
  padding: ${theme.spacing.xxl};
  z-index: ${theme.zIndex.modal};
  text-align: center;
  min-width: 360px;
  animation: darkModalBounce ${theme.animation.duration.normal} ${theme.animation.easing.default};

  @keyframes darkModalBounce {
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
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.semiBold};
    margin: 0 0 ${theme.spacing.md} 0;
  }
  
  p {
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.medium};
    margin: ${theme.spacing.xl} 0;
  }
`;

// ========== Additional UI Components ==========

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const CloseButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background.secondary};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  transition: all ${theme.animation.duration.fast} ${theme.animation.easing.default};
  
  &:hover {
    background: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border.strong};
    color: ${theme.colors.text.primary};
  }
`;

// ========== Main Component ==========

export const PhoneWidgetTwentyDark: React.FC = () => {
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
  } = useTwilioVoice();

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

  // Icons in dark mode with better contrast
  const PhoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>
  );

  const MicIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
    </svg>
  );

  const MicOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
    </svg>
  );

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
            <PhoneIcon />
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
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                  </ControlButton>
                  
                  <ControlButton 
                    onClick={() => setShowDialpad(!showDialpad)}
                    title="Clavier"
                  >
                    #
                  </ControlButton>
                  
                  <ControlButton 
                    onClick={toggleHold}
                    title={isOnHold ? 'Reprendre' : 'Mettre en attente'}
                  >
                    {isOnHold ? '▶' : '❚❚'}
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

export default PhoneWidgetTwentyDark;