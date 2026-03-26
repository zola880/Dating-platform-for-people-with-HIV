import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Spinner from '../components/Spinner';
import CallModal from '../components/CallModal';
import { requestNotificationPermission, showNotification } from '../utils/notifications';
import io from 'socket.io-client';
import './Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const incomingOffer = location.state?.incomingOffer;

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Call state
  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callType, setCallType] = useState('video');
  const isEndingCall = useRef(false); // prevent multiple calls to endCall

  const activeChatUserId = userId;

  // Request notification permission
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Cleanup function for call resources
  const cleanupCall = () => {
    console.log('Cleaning up call resources');
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setLocalStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      console.log('Closed peer connection');
    }
    setRemoteStream(null);
    setCallActive(false);
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    isEndingCall.current = false;
  };

  // End call – emit to other party and clean up local
  const endCall = () => {
    if (isEndingCall.current) return;
    isEndingCall.current = true;
    console.log('Ending call...');
    // Emit end-call to the other user if a call is active or ringing
    if (callActive || incomingCall) {
      const target = incomingCall ? incomingCall.from : userId;
      socketRef.current.emit('end-call', {
        to: target,
        from: user._id,
      });
      console.log('Emitted end-call to:', target);
    }
    // Clean up local resources
    cleanupCall();
  };

  // Socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5001');
    if (user?._id) {
      socketRef.current.emit('join', user._id);
    }

    // Incoming call
    socketRef.current.on('incoming-call', ({ offer, from }) => {
      setIncomingCall({ from, offer });
      showNotification(
        `Incoming call from ${otherUser?.name || 'someone'}`,
        'Tap to answer',
        '/logo192.png',
        `/chat/${from}`
      );
    });

    // Call accepted
    socketRef.current.on('call-accepted', async ({ answer, from }) => {
      if (peerConnection && !callActive && from === userId) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        setCallActive(true);
      }
    });

    // Call rejected
    socketRef.current.on('call-rejected', ({ from }) => {
      if (from === userId) {
        alert(`${otherUser?.name} declined the call.`);
        cleanupCall();
      }
    });

    // Call ended (by other party)
    socketRef.current.on('call-ended', ({ from }) => {
      if (from === userId) {
        console.log('Received call-ended from other party');
        alert(`${otherUser?.name} ended the call.`);
        cleanupCall(); // Clean up local resources
      }
    });

    // ICE candidate
    socketRef.current.on('ice-candidate', async ({ candidate, from }) => {
      if (from === userId && peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // New messages
    socketRef.current.on('new message', (newMsg) => {
      if (
        (newMsg.sender._id === userId && newMsg.receiver._id === user._id) ||
        (newMsg.sender._id === user._id && newMsg.receiver._id === userId)
      ) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === newMsg._id);
          if (exists) return prev;
          return [...prev, newMsg];
        });
      }

      if (activeChatUserId !== newMsg.sender._id && newMsg.sender._id !== user._id) {
        showNotification(
          `New message from ${newMsg.sender.name}`,
          newMsg.content || 'Sent a media file',
          '/logo192.png',
          `/chat/${newMsg.sender._id}`
        );
      }
    });

    socketRef.current.on('message sent', (confirmedMsg) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === confirmedMsg._id);
        if (exists) return prev;
        return [...prev, confirmedMsg];
      });
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Connection error. Please refresh.');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      cleanupCall();
    };
  }, [user?._id, userId, otherUser?.name]);

  // Load messages and user info
  useEffect(() => {
    fetchOtherUser();
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchOtherUser = async () => {
    try {
      const response = await API.get(`/users/${userId}`);
      setOtherUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('User not found');
      setTimeout(() => navigate('/messages'), 2000);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await API.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 5) {
      setError('You can only attach up to 5 files per message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const previews = files.map((file) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setAttachments((prev) => [...prev, ...files]);
    setAttachmentPreviews((prev) => [...prev, ...previews]);
  };

  const removeAttachment = (index) => {
    if (attachmentPreviews[index]) {
      URL.revokeObjectURL(attachmentPreviews[index]);
    }
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0)) return;

    setSending(true);
    if (attachments.length > 0) {
      const formData = new FormData();
      formData.append('receiverId', userId);
      formData.append('content', newMessage);
      attachments.forEach((file) => formData.append('attachments', file));
      try {
        const response = await API.post('/messages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessages((prev) => [...prev, response.data]);
        setNewMessage('');
        attachments.forEach((_, idx) => {
          if (attachmentPreviews[idx]) URL.revokeObjectURL(attachmentPreviews[idx]);
        });
        setAttachments([]);
        setAttachmentPreviews([]);
        scrollToBottom();
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message. Please try again.');
        setTimeout(() => setError(''), 3000);
      } finally {
        setSending(false);
      }
    } else {
      const messageData = {
        senderId: user._id,
        receiverId: userId,
        content: newMessage,
        attachments: [],
      };
      socketRef.current.emit('private message', messageData);
      setNewMessage('');
      setSending(false);
    }
  };

  // --- WebRTC Call Logic ---
  const getMedia = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video',
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Could not access camera/microphone. Please check permissions.');
      return null;
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          to: userId,
          from: user._id,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  };

  const initiateCall = async (type) => {
    setCallType(type);
    const stream = await getMedia(type);
    if (!stream) return;

    const pc = createPeerConnection();
    setPeerConnection(pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit('call-user', {
      offer: pc.localDescription,
      to: userId,
      from: user._id,
      type,
    });

    setCallActive(true);
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    const { offer, from } = incomingCall;

    const stream = await getMedia('video');
    if (!stream) return;

    const pc = createPeerConnection();
    setPeerConnection(pc);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit('accept-call', {
      answer: pc.localDescription,
      to: from,
      from: user._id,
    });

    setCallActive(true);
    setIncomingCall(null);
  };

  const acceptCallFromOffer = async (offer) => {
    const stream = await getMedia('video');
    if (!stream) return;

    const pc = createPeerConnection();
    setPeerConnection(pc);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit('accept-call', {
      answer: pc.localDescription,
      to: userId,
      from: user._id,
    });

    setCallActive(true);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (incomingCall) {
      socketRef.current.emit('reject-call', {
        to: incomingCall.from,
        from: user._id,
      });
      setIncomingCall(null);
    }
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

  // Auto‑accept from global overlay
  useEffect(() => {
    if (incomingOffer && !callActive && !incomingCall) {
      acceptCallFromOffer(incomingOffer);
      window.history.replaceState({}, document.title);
    }
  }, [incomingOffer, callActive, incomingCall]);

  // --- Render ---
  const getProfilePictureUrl = (profilePicture) => {
    if (profilePicture && profilePicture !== 'default-avatar.png') {
      return `http://localhost:5001/uploads/${profilePicture}`;
    }
    return '/default-avatar.png';
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderAttachment = (attachment) => {
    const url = `http://localhost:5001/uploads/${attachment.filename}`;
    if (attachment.fileType === 'image') {
      return (
        <div className="message-attachment">
          <img
            src={url}
            alt="attachment"
            onClick={() => setSelectedImage(url)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      );
    }
    if (attachment.fileType === 'video') {
      return (
        <div className="message-attachment">
          <video controls src={url} style={{ maxWidth: '100%', maxHeight: '240px' }} />
        </div>
      );
    }
    return (
      <div className="message-attachment-file">
        <span>📎</span>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {attachment.filename}
        </a>
      </div>
    );
  };

  if (loading) return <Spinner />;
  if (!otherUser)
    return (
      <div className="chat-error">
        <p>User not found. Redirecting...</p>
      </div>
    );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate('/messages')} className="back-btn">
          ← Back
        </button>
        <img
          src={getProfilePictureUrl(otherUser.profilePicture)}
          alt={otherUser.name}
          className="chat-avatar"
        />
        <div className="chat-user-info">
          <h2>{otherUser.name}</h2>
          <p className="chat-user-details">
            {otherUser.age} years • {otherUser.gender}
          </p>
        </div>
        <div className="call-buttons">
          <button onClick={() => initiateCall('audio')} className="call-btn audio-call">
            📞 Audio
          </button>
          <button onClick={() => initiateCall('video')} className="call-btn video-call">
            🎥 Video
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, idx) => {
            const isOwnMessage = message.sender?._id === user._id;
            return (
              <div
                key={message._id || idx}
                className={`message ${isOwnMessage ? 'message-own' : 'message-other'}`}
              >
                {!isOwnMessage && message.sender?.profilePicture && (
                  <img
                    src={getProfilePictureUrl(message.sender.profilePicture)}
                    alt={message.sender.name}
                    className="message-avatar"
                  />
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.content && <p>{message.content}</p>}
                    {message.attachments &&
                      message.attachments.map((att, i) => (
                        <div key={i}>{renderAttachment(att)}</div>
                      ))}
                  </div>
                  <span className="message-time">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="error-message">{error}</div>}

      {attachmentPreviews.length > 0 && (
        <div className="attachment-previews">
          {attachmentPreviews.map((preview, idx) => (
            <div key={idx} className="attachment-preview">
              {preview ? (
                <img src={preview} alt={`preview ${idx}`} />
              ) : (
                <span>{attachments[idx]?.name}</span>
              )}
              <button onClick={() => removeAttachment(idx)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="attachment-btn"
          disabled={sending}
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept="image/*,video/*,application/pdf,.txt"
          onChange={handleFileSelect}
          disabled={sending}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={sending || (!newMessage.trim() && attachments.length === 0)}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>

      {/* Call Modal */}
      <CallModal
        isOpen={callActive || incomingCall}
        onClose={() => {
          if (callActive || incomingCall) {
            endCall();
          }
        }}
        onAccept={acceptCall}
        onReject={rejectCall}
        callerName={otherUser?.name}
        isIncoming={!!incomingCall}
        localStream={localStream}
        remoteStream={remoteStream}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onEndCall={endCall}
      />

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={() => setSelectedImage(null)}>&times;</button>
            <img src={selectedImage} alt="Full size" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;