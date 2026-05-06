import React from 'react';
import { useCall } from '../context/CallContext';
import config from '../utils/config';
import './GlobalCallOverlay.css';

const GlobalCallOverlay = () => {
  const { incomingCall, callerInfo, acceptCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  return (
    <div className="global-call-overlay">
      <div className="call-card">
        <div className="caller-avatar">
          {callerInfo?.profilePicture ? (
            <img src={config.getUploadUrl(callerInfo.profilePicture)} alt={callerInfo.name} />
          ) : (
            <div className="default-avatar">📞</div>
          )}
        </div>
        <h3>{callerInfo?.name || 'Someone'}</h3>
        <p>is calling...</p>
        <div className="call-actions">
          <button className="accept-btn" onClick={acceptCall}>Accept</button>
          <button className="reject-btn" onClick={rejectCall}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default GlobalCallOverlay;