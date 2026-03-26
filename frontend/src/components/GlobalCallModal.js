import React, { useEffect, useRef } from 'react';
import { useCall } from '../context/CallContext';
import './CallModal.css';

const GlobalCallModal = () => {
  const {
    callModalOpen,
    incomingCall,
    callActive,
    localStream,
    remoteStream,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
  } = useCall();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  if (!callModalOpen) return null;

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        {incomingCall && !callActive ? (
          <div className="incoming-call">
            <div className="caller-info">
              <div className="caller-avatar">📞</div>
              <h3>Incoming call...</h3>
            </div>
            <div className="call-actions">
              <button className="accept-btn" onClick={acceptCall}>Accept</button>
              <button className="reject-btn" onClick={rejectCall}>Reject</button>
            </div>
          </div>
        ) : callActive ? (
          <div className="active-call">
            <div className="video-container">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
              />
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="local-video"
              />
            </div>
            <div className="call-controls">
              <button onClick={toggleMute} className={isMuted ? 'active' : ''}>
                {isMuted ? '🔇' : '🎤'} Mute
              </button>
              <button onClick={toggleVideo} className={isVideoOff ? 'active' : ''}>
                {isVideoOff ? '📹' : '🎥'} Video
              </button>
              <button onClick={endCall} className="end-call-btn">
                🔴 End Call
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GlobalCallModal;