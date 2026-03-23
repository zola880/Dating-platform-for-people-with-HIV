// Landing.js
import React, { useEffect, useRef, useState } from 'react';
import './Landing.css';

const Landing = () => {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const [feedPosts] = useState([
    { id: 1, user: 'luna_echo', content: 'just found my soul tribe here 🌙', likes: 234, avatar: '🌙' },
    { id: 2, user: 'noir_vibe', content: 'finally a space that feels like home', likes: 892, avatar: '🖤' },
    { id: 3, user: 'stellar_drift', content: 'the audio rituals are next level', likes: 457, avatar: '✨' },
    { id: 4, user: 'cipher_heart', content: 'vulnerability is strength here', likes: 612, avatar: '💜' },
    { id: 5, user: 'echo_void', content: 'no algorithms, just real connection', likes: 1.2, avatar: '🌀' },
  ]);
  const [scrollY, setScrollY] = useState(0);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll feed effect
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;
    let scrollAmount = 0;
    const scrollStep = () => {
      if (!container) return;
      scrollAmount += 0.8;
      if (scrollAmount >= container.scrollHeight - container.clientHeight) {
        scrollAmount = 0;
      }
      container.scrollTop = scrollAmount;
      requestAnimationFrame(scrollStep);
    };
    const frame = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(frame);
  }, []);

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

  return (
    <div className="landing">
      {/* Background animated gradient orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Hero Section – Immersive with Live Feed */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="glitch-text" data-text="EMBRACE">EMBRACE</h1>
            <p className="tagline">the anti‑social network</p>
            <div className="hero-cta">
              <button className="cta-button pulse">join the underground →</button>
              <div className="hero-stats">
                <span>⚡ 12.4k live now</span>
                <span>🎧 341 audio rituals</span>
              </div>
            </div>
          </div>
          <div className="live-feed" ref={feedContainerRef}>
            {feedPosts.map((post) => (
              <div key={post.id} className="feed-card">
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
      </section>

      {/* Floating Draggable Card – like a social media widget */}
      <div
        ref={dragRef}
        className="draggable-card"
        style={{ transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)` }}
        onMouseDown={handleDragStart}
      >
        <div className="drag-handle">⋮⋮</div>
        <div className="card-inner">
          <div className="card-icon">🎭</div>
          <h3>your vibe, your rules</h3>
          <p>drag me anywhere — just like your identity here.</p>
          <div className="card-badge">anonymous circles</div>
        </div>
      </div>

      {/* Scroll-triggered reveal section – immersive storytelling */}
      <section className="story-section">
        <div className="story-grid">
          <div className="story-card reveal">
            <div className="story-number">01</div>
            <div className="story-title">no followers, only frequencies</div>
            <p>we killed the vanity metrics. your presence is measured in connection, not count.</p>
          </div>
          <div className="story-card reveal delay-1">
            <div className="story-number">02</div>
            <div className="story-title">audio-first rituals</div>
            <p>live conversations, co-listening, and vulnerable moments — without the pressure.</p>
          </div>
          <div className="story-card reveal delay-2">
            <div className="story-number">03</div>
            <div className="story-title">ephemeral by design</div>
            <p>messages that dissolve, moments that matter. no digital baggage.</p>
          </div>
        </div>
      </section>

      {/* Neon Grid – fake feed wall that feels alive */}
      <div className="neon-wall">
        <div className="wall-header">
          <span className="wall-pulse">● LIVE WALL</span>
          <span>what's happening now</span>
        </div>
        <div className="wall-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="wall-tile" style={{ '--delay': `${i * 0.1}s` }}>
              <div className="tile-glow"></div>
              <span>✨</span>
              <span className="tile-text">raw pulse {i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer – minimal but with attitude */}
      <footer className="footer">
        <div className="footer-links">
          <span>no tracking</span>
          <span>encrypted souls</span>
          <span>community-owned</span>
        </div>
        <div className="footer-copy">© 2025 EMBRACE — the algorithm stops here.</div>
      </footer>
    </div>
  );
};

export default Landing;