import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import { getPosts, createPost, deletePost } from '../utils/postApi';
import Spinner from '../components/Spinner';
import './Feed.css';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState(''); // 'image' or 'video'
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      setPosts(response.data);
      setError('');
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
      // Validate file size (max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        setError('File size too large. Maximum 15MB allowed.');
        return;
      }
      // Determine media type
      const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' : null;
      if (!type) {
        setError('Only image and video files are allowed.');
        return;
      }
      setNewPostMedia(file);
      setMediaType(type);
      // Create preview
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
      if (newPostMedia) {
        formData.append('image', newPostMedia); // field name 'image' as expected by backend
      }

      const response = await createPost(formData);
      setPosts([response.data, ...posts]);
      // Reset form
      setNewPostContent('');
      setNewPostMedia(null);
      setPreview(null);
      setMediaType('');
      setError('');
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

  if (loading) return <Spinner />;

  return (
    <div className="feed embrace-feed">
      <div className="create-post-card">
        <div className="create-post-header">
          <img
            src={user?.profilePicture ? `http://localhost:5001/uploads/${user.profilePicture}` : '/default-avatar.png'}
            alt={user?.name}
            className="user-avatar"
          />
          <h3>What's on your mind, {user?.name?.split(' ')[0]}?</h3>
        </div>
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="Share your thoughts..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="3"
          />
          <div className="media-upload">
            <label className="upload-btn">
              📎 Attach Media
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
                  <img src={preview} alt="Preview" className="preview-image" />
                ) : (
                  <video src={preview} controls className="preview-video" />
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
                  ✕
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || (!newPostContent.trim() && !newPostMedia)}
            className="post-submit"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <span className="empty-icon">🌱</span>
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <Post key={post._id} post={post} onDelete={handleDeletePost} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;