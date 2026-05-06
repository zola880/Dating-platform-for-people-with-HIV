// Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <div className="hero-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
      </div>
      
      <div className="hero-content">
        <div className="content-wrapper">
          <div className="badge">✨ Welcome to Hivmedia</div>
          <h1 className="title">Connect, Share & Thrive</h1>
          <p className="description">
            Your all-in-one community platform for dating, events, health tracking, and meaningful connections. 
            Join thousands of users building relationships and improving their lives together.
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">❤️</div>
              <div className="feature-text">Dating</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎉</div>
              <div className="feature-text">Events</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <div className="feature-text">Messages</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏥</div>
              <div className="feature-text">Health</div>
            </div>
          </div>
          <div className="button-group">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-side">
        <div className="card-showcase">
          <div className="showcase-card card-1">
            <div className="card-header">Dating</div>
            <p>Find your perfect match</p>
          </div>
          <div className="showcase-card card-2">
            <div className="card-header">Events</div>
            <p>Explore local activities</p>
          </div>
          <div className="showcase-card card-3">
            <div className="card-header">Health</div>
            <p>Track your wellness</p>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <span></span>
      </div>
    </div>
  );
};

export default Landing;