import React, { useState, useRef, useEffect } from 'react';
import './CallModal.css';

const CallModal = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  onReject, 
  callerName, 
  isIncoming,
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        {isIncoming ? (
          // Incoming call UI
          <div className="incoming-call">
            <div className="caller-info">
              <div className="caller-avatar">📞</div>
              <h3>{callerName} is calling...</h3>
            </div>
            <div className="call-actions">
              <button className="accept-btn" onClick={onAccept}>Accept</button>
              <button className="reject-btn" onClick={onReject}>Reject</button>
            </div>
          </div>
        ) : (
          // Active call UI
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
              <button onClick={onToggleMute} className={isMuted ? 'active' : ''}>
                {isMuted ? '🔇' : '🎤'} Mute
              </button>
              <button onClick={onToggleVideo} className={isVideoOff ? 'active' : ''}>
                {isVideoOff ? '📹' : '🎥'} Video
              </button>
              <button onClick={onEndCall} className="end-call-btn">
                🔴 End Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;