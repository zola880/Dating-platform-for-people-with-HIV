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
  const [newPostImage, setNewPostImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostImage) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (newPostImage) formData.append('image', newPostImage);

      const response = await createPost(formData);
      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setNewPostImage(null);
      setPreview(null);
    } catch (error) {
      console.error('Create post error:', error);
      setError('Failed to create post');
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
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="feed">
      <div className="create-post">
        <h3>What's on your mind?</h3>
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="Share your thoughts..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="3"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <button type="button" onClick={() => { setNewPostImage(null); setPreview(null); }}>
                Remove
              </button>
            </div>
          )}
          <button type="submit" disabled={submitting || (!newPostContent.trim() && !newPostImage)}>
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="posts-list">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Be the first to share!</p>
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