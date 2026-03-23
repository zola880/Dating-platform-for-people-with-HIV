// Landing.js
import React, { useEffect, useRef, useState } from 'react';
import './Landing.css';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [feedPosts] = useState([
    { id: 1, user: 'luna_echo', content: 'just found my soul tribe here 🌙', likes: 234, avatar: '🌙' },
    { id: 2, user: 'noir_vibe', content: 'finally a space that feels like home', likes: 892, avatar: '🖤' },
    { id: 3, user: 'stellar_drift', content: 'the audio rituals are next level', likes: 457, avatar: '✨' },
    { id: 4, user: 'cipher_heart', content: 'vulnerability is strength here', likes: 612, avatar: '💜' },
    { id: 5, user: 'echo_void', content: 'no algorithms, just real connection', likes: 1200, avatar: '🌀' },
  ]);

  const feedRef = useRef(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Auto-scroll feed
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    let scrollAmount = 0;
    const step = () => {
      if (!feed) return;
      scrollAmount += 0.8;
      if (scrollAmount >= feed.scrollHeight - feed.clientHeight) {
        scrollAmount = 0;
      }
      feed.scrollTop = scrollAmount;
      requestAnimationFrame(step);
    };
    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Draggable card logic
  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y,
    };
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    setDragPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* Background elements */}
      <div className="bg-glow"></div>
      <div className="bg-gradient"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="title-word">EMBRACE</span>
              <span className="title-sub">the anti‑social network</span>
            </h1>
            <p className="hero-description">
              A space where you don't follow — you connect. No algorithms, no vanity metrics.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Join the movement →</button>
              <button className="btn-secondary">Explore rituals</button>
            </div>
            <div className="hero-stats">
              <span>⚡ 12.4k live now</span>
              <span>🎧 341 active circles</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="live-feed" ref={feedRef}>
              {feedPosts.map((post) => (
                <div key={post.id} className="feed-item">
                  <div className="feed-avatar">{post.avatar}</div>
                  <div className="feed-content">
                    <div className="feed-user">@{post.user}</div>
                    <div className="feed-text">{post.content}</div>
                    <div className="feed-meta">❤️ {post.likes}k</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating draggable card */}
      <div
        className="draggable-card"
        style={{ transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)` }}
        onMouseDown={handleDragStart}
      >
        <div className="drag-handle">⋮⋮</div>
        <div className="card-body">
          <div className="card-icon">🎭</div>
          <h3>your identity, your terms</h3>
          <p>drag me anywhere — just like your presence here.</p>
          <div className="card-badge">anonymous by default</div>
        </div>
      </div>

      {/* Storytelling section */}
      <section className="story">
        <div className="story-container">
          <div className="story-item reveal">
            <div className="story-number">01</div>
            <h3>no followers, only frequencies</h3>
            <p>We replaced metrics with meaning. Your influence is measured by authentic connection, not numbers.</p>
          </div>
          <div className="story-item reveal delay-1">
            <div className="story-number">02</div>
            <h3>audio-first rituals</h3>
            <p>Live conversations, co-listening, and honest moments — without the pressure of being seen.</p>
          </div>
          <div className="story-item reveal delay-2">
            <div className="story-number">03</div>
            <h3>ephemeral by design</h3>
            <p>Messages dissolve, moments matter. No digital baggage, just real presence.</p>
          </div>
        </div>
      </section>

      {/* Dynamic wall */}
      <div className="dynamic-wall">
        <div className="wall-header">
          <span className="live-badge">● LIVE WALL</span>
          <span>what's resonating now</span>
        </div>
        <div className="wall-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="wall-card">
              <div className="wall-icon">✨</div>
              <div className="wall-label">vibe {i+1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <span>no tracking</span>
          <span>encrypted by default</span>
          <span>community-owned</span>
        </div>
        <div className="footer-copy">© 2025 EMBRACE — the algorithm stops here.</div>
      </footer>
    </div>
  );
};

export default Landing;