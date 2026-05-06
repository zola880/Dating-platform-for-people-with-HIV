// Feed.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import { getPosts, createPost, deletePost } from '../utils/postApi';
import Spinner from '../components/Spinner';
import './Feed.css';

const Feed = () => {
  const { user } = useAuth();
  const canPost = Boolean(user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const feedContainerRef = useRef(null);
  const postRefs = useRef({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Fetch posts error:', error);
      setError('Failed to load posts. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer to detect active post
  useEffect(() => {
    if (!feedContainerRef.current || posts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });
        if (bestEntry && bestRatio > 0.5) {
          const postId = bestEntry.target.getAttribute('data-post-id');
          setActivePostId(postId);
        }
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: '0px' }
    );

    Object.values(postRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [posts]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('File size too large. Maximum 15MB allowed.');
        return;
      }
      const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' : null;
      if (!type) {
        setError('Only image and video files are allowed.');
        return;
      }
      setNewPostMedia(file);
      setMediaType(type);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostMedia) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (newPostMedia) formData.append('image', newPostMedia);

      const response = await createPost(formData);
      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setNewPostMedia(null);
      setPreview(null);
      setMediaType('');
      document.getElementById('create-post-modal').style.display = 'none';
    } catch (error) {
      console.error('Create post error:', error);
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) {
      console.error('Delete post error:', error);
      setError('Failed to delete post.');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <Spinner />
    </div>
  );

  return (
    <div className="tiktok-feed" ref={feedContainerRef}>
      {/* Public feed hero for unauthenticated visitors */}
      {!canPost && (
        <div className="feed-guest-banner">
          <div>
            <h2>Explore the community feed</h2>
            <p>Browse posts, videos and stories. Sign in to like, comment, or share your own content.</p>
          </div>
          <div className="feed-guest-actions">
            <Link to="/login" className="btn btn-outline">Sign In</Link>
            <Link to="/register" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
      )}

      {canPost && (
        <>
          {/* Floating Create Post Button */}
          <button 
            className="create-post-float" 
            onClick={() => document.getElementById('create-post-modal').style.display = 'flex'}
            aria-label="Create new post"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Modal for creating post */}
          <div id="create-post-modal" className="create-post-modal" style={{ display: 'none' }}>
        <div className="create-post-modal-backdrop" onClick={() => document.getElementById('create-post-modal').style.display = 'none'} />
        <div className="create-post-modal-content">
          <div className="modal-header">
            <h3>Create new post</h3>
            <button className="close-modal" onClick={() => document.getElementById('create-post-modal').style.display = 'none'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="4"
            className="post-textarea"
          />
          <div className="media-upload">
            <label className="upload-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4" strokeLinecap="round"/>
              </svg>
              Attach Media
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                style={{ display: 'none' }}
              />
            </label>
            {preview && (
              <div className="preview-container">
                {mediaType === 'image' ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <video src={preview} controls />
                )}
                <button
                  type="button"
                  className="remove-preview"
                  onClick={() => {
                    setNewPostMedia(null);
                    setPreview(null);
                    setMediaType('');
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button
              className="post-submit-btn"
              onClick={handleCreatePost}
              disabled={submitting || (!newPostContent.trim() && !newPostMedia)}
            >
              {submitting ? (
                <span className="btn-spinner"></span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {error && (
        <div className="error-message-tiktok">
          <span className="error-icon">⚠️</span>
          {error}
          <button className="error-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="no-posts-tiktok">
          <div className="empty-state-icon">✨</div>
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            ref={(el) => (postRefs.current[post._id] = el)}
            data-post-id={post._id}
            className={`tiktok-post-container ${activePostId === post._id ? 'active' : ''}`}
          >
            <Post
              post={post}
              onDelete={handleDeletePost}
              isActive={activePostId === post._id}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;