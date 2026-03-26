// frontend/src/context/CallContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import API from '../utils/api';
import { showNotification } from '../utils/notifications';

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const socket = useSocket(); // use global socket
  const navigate = useNavigate();

  const [incomingCall, setIncomingCall] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  const ringtoneRef = useRef(null);
  const timeoutRef = useRef(null);

  // Play ringtone
  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(e => console.log('Ringtone play failed:', e));
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const clearCall = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopRingtone();
    setIncomingCall(null);
    setCallerInfo(null);
    setCallModalOpen(false);
  };

  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (incomingCall) {
        rejectCall();
      }
    }, 30000);
  };

  const rejectCall = () => {
    if (incomingCall && socket) {
      socket.emit('reject-call', {
        to: incomingCall.from,
        from: user._id,
      });
      clearCall();
      showNotification('Call declined', 'You declined the call.', '/logo192.png');
    }
  };

  const acceptCall = () => {
    if (incomingCall) {
      // Clear the call state, navigate to chat with offer
      const offer = incomingCall.offer;
      const from = incomingCall.from;
      clearCall(); // stops ringtone and clears local incoming call
      navigate(`/chat/${from}`, { state: { incomingOffer: offer } });
    }
  };

  // Reset call (end call)
  const endCall = () => {
    if (callActive || incomingCall) {
      const target = callActive ? (incomingCall?.from) : incomingCall?.from;
      if (target && socket) {
        socket.emit('end-call', { to: target, from: user._id });
      }
    }
    resetCall();
  };

  const resetCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setRemoteStream(null);
    setCallActive(false);
    setIncomingCall(null);
    setCallModalOpen(false);
    clearCall();
  };

  // Media and peer connection functions (optional, but may be used if we want to show local preview)
  const getMedia = async (withVideo = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media:', err);
      alert('Could not access camera/microphone.');
      return null;
    }
  };

  const createPeerConnection = (stream, targetId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: targetId,
          from: user._id,
        });
      }
    };
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    return pc;
  };

  // Listen for incoming calls via socket
  useEffect(() => {
    if (!socket || !user) return;

    const handleIncomingCall = async ({ offer, from }) => {
      // Fetch caller details
      let caller = { name: 'Someone', profilePicture: null };
      try {
        const res = await API.get(`/users/${from}`);
        caller = res.data;
      } catch (err) {
        console.error('Failed to fetch caller:', err);
      }
      setCallerInfo(caller);
      setIncomingCall({ from, offer });
      setCallModalOpen(true);
      playRingtone();
      startTimeout();

      // Also show browser notification
      showNotification(
        'Incoming call',
        `${caller.name} is calling you`,
        caller.profilePicture ? `http://localhost:5001/uploads/${caller.profilePicture}` : '/logo192.png',
        `/chat/${from}`
      );
    };

    const handleCallAccepted = async ({ answer, from }) => {
      if (peerConnection && !callActive) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        setCallActive(true);
      }
    };

    const handleCallRejected = ({ from }) => {
      if (incomingCall?.from === from) {
        alert('Call rejected');
        resetCall();
      }
    };

    const handleCallEnded = ({ from }) => {
      if (incomingCall?.from === from) {
        alert('Call ended');
        resetCall();
      }
    };

    const handleIceCandidate = async ({ candidate, from }) => {
      if (peerConnection && (incomingCall?.from === from || callActive)) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      }
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-rejected', handleCallRejected);
    socket.on('call-ended', handleCallEnded);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-rejected', handleCallRejected);
      socket.off('call-ended', handleCallEnded);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket, user, incomingCall, peerConnection, callActive]);

  // Ringtone audio element
  useEffect(() => {
    ringtoneRef.current = new Audio('/ringtone.mp3');
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current = null;
      }
    };
  }, []);

  // Functions to expose
  const startCall = async (toUserId, withVideo = true) => {
    const stream = await getMedia(withVideo);
    if (!stream) return;

    const pc = createPeerConnection(stream, toUserId);
    setPeerConnection(pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('call-user', {
      offer: pc.localDescription,
      to: toUserId,
      from: user._id,
    });

    setCallActive(true);
    setCallModalOpen(true);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <CallContext.Provider value={{
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleVideo,
      callActive,
      incomingCall,
      callModalOpen,
      localStream,
      remoteStream,
      isMuted,
      isVideoOff,
      callerInfo,
    }}>
      {children}
    </CallContext.Provider>
  );
};