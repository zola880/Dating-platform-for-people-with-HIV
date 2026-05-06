import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import { getPosts, createPost, deletePost } from '../utils/postApi';
import Spinner from '../components/Spinner';
import config from '../utils/config';
import './Feed.css';

const Feed = () => {
  const { user } = useAuth();
  const canPost = Boolean(user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create post states
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const getProfilePictureUrl = () => {
    if (user?.profilePicture && user.profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(user.profilePicture);
    }
    return '/default-avatar.png';
  };

  if (loading) return (
    <div className="ig-loading-container">
      <Spinner />
    </div>
  );

  return (
    <div className="ig-feed-page">
      <div className="ig-feed-content">
        
        {/* Stories Placeholder */}
        {canPost && (
          <div className="ig-stories-container">
            <div className="ig-story">
              <div className="ig-story-avatar-container create-story">
                <img src={getProfilePictureUrl()} alt="Your Story" />
                <div className="ig-story-add-icon">+</div>
              </div>
              <span className="ig-story-username">Your story</span>
            </div>
            {/* Mock stories for the Instagram feel */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div className="ig-story" key={i}>
                <div className="ig-story-avatar-container">
                  <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="User Story" />
                </div>
                <span className="ig-story-username">user_{i}</span>
              </div>
            ))}
          </div>
        )}

        {/* Public feed hero for unauthenticated visitors */}
        {!canPost && (
          <div className="ig-guest-banner">
            <h2>Explore the community</h2>
            <p>Sign in to like, comment, or share your own content.</p>
            <div className="ig-guest-actions">
              <Link to="/login" className="btn-primary">Log In</Link>
              <Link to="/register" className="btn-secondary">Sign Up</Link>
            </div>
          </div>
        )}

        {/* Feed Posts */}
        <div className="ig-posts-container">
          {posts.length === 0 ? (
            <div className="ig-no-posts">
              <div className="ig-empty-icon-container">
                <svg aria-label="Camera" color="#262626" fill="none" height="48" role="img" viewBox="0 0 24 24" width="48" stroke="currentColor" strokeWidth="1">
                  <rect height="18" rx="3" ry="3" width="18" x="3" y="3"></rect>
                  <circle cx="12" cy="13" r="5"></circle>
                  <line x1="8" x2="16" y1="6" y2="6"></line>
                </svg>
              </div>
              <h2>No Posts Yet</h2>
            </div>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
                isActive={true} /* Auto-play videos for now */
              />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar (Suggestions) */}
      {canPost && (
        <div className="ig-right-sidebar">
          <div className="ig-user-profile-mini">
            <img src={getProfilePictureUrl()} alt={user.name} className="ig-mini-avatar" />
            <div className="ig-mini-info">
              <span className="ig-mini-username">{user.name.split(' ').join('_').toLowerCase()}</span>
              <span className="ig-mini-fullname">{user.name}</span>
            </div>
            <button className="ig-switch-btn">Switch</button>
          </div>

          <div className="ig-suggestions-header">
            <span>Suggested for you</span>
            <button className="ig-see-all-btn">See All</button>
          </div>

          <div className="ig-suggestions-list">
            {[1, 2, 3, 4, 5].map((i) => (
              <div className="ig-suggestion-item" key={i}>
                <img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="Suggestion" className="ig-suggestion-avatar" />
                <div className="ig-suggestion-info">
                  <span className="ig-suggestion-username">suggested_user_{i}</span>
                  <span className="ig-suggestion-reason">Followed by someone</span>
                </div>
                <button className="ig-follow-btn">Follow</button>
              </div>
            ))}
          </div>
          
          <div className="ig-footer-links">
            About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language
          </div>
          <div className="ig-footer-copyright">
            © 2026 INSTAGRAM FROM ANTIGRAVITY
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {canPost && (
        <div id="create-post-modal" className="ig-modal-backdrop" style={{ display: 'none' }}>
          <div className="ig-modal-content">
            <div className="ig-modal-header">
              <h3>Create new post</h3>
              <button onClick={() => document.getElementById('create-post-modal').style.display = 'none'} className="ig-modal-close-btn">
                ✕
              </button>
            </div>
            
            <div className="ig-modal-body">
              <textarea
                placeholder="Write a caption..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="ig-post-textarea"
                rows="4"
              />
              
              <div className="ig-media-upload">
                <label className="ig-upload-btn">
                  Select from computer
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    style={{ display: 'none' }}
                  />
                </label>
                
                {preview && (
                  <div className="ig-preview-container">
                    {mediaType === 'image' ? (
                      <img src={preview} alt="Preview" />
                    ) : (
                      <video src={preview} controls />
                    )}
                    <button
                      type="button"
                      className="ig-remove-preview"
                      onClick={() => {
                        setNewPostMedia(null);
                        setPreview(null);
                        setMediaType('');
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button
                className="btn-primary ig-submit-btn"
                onClick={handleCreatePost}
                disabled={submitting || (!newPostContent.trim() && !newPostMedia)}
              >
                {submitting ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;