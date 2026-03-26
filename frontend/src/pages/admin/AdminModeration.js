import React, { useState, useEffect } from 'react';
import { getAllUsers, deletePostAdmin, deleteCommentAdmin } from '../../utils/adminApi';
import Spinner from '../../components/Spinner';
import './AdminModeration.css';

const AdminModeration = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({ limit: 50 });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    try {
      await deletePostAdmin(postId);
      // Refresh user data
      fetchUsers();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteCommentAdmin(postId, commentId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="admin-moderation">
      <div className="admin-header">
        <h1>Content Moderation</h1>
        <p>Review and manage user posts and comments</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="moderation-filters">
        <input
          type="text"
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-list">
        {filteredUsers.map((user) => (
          <div key={user._id} className="moderation-user-card">
            <div className="moderation-user-header" onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}>
              <img
                src={user.profilePicture ? `http://localhost:5001/uploads/${user.profilePicture}` : '/default-avatar.png'}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className={`status-badge ${user.status}`}>{user.status}</span>
              </div>
              <span className="expand-icon">{selectedUser === user._id ? '▲' : '▼'}</span>
            </div>
            {selectedUser === user._id && (
              <div className="moderation-user-content">
                {user.posts && user.posts.length > 0 ? (
                  <div className="user-posts">
                    <h4>Posts ({user.posts.length})</h4>
                    {user.posts.map((post) => (
                      <div key={post._id} className="moderation-post">
                        <div className="post-header">
                          <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
                          <button
                            className="delete-post-btn"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete Post
                          </button>
                        </div>
                        <p className="post-content">{post.content}</p>
                        {post.media && (
                          <div className="post-media-preview">
                            {post.mediaType === 'image' ? (
                              <img src={`http://localhost:5001/uploads/${post.media}`} alt="Post media" />
                            ) : post.mediaType === 'video' ? (
                              <video controls src={`http://localhost:5001/uploads/${post.media}`} />
                            ) : null}
                          </div>
                        )}
                        {post.comments && post.comments.length > 0 && (
                          <div className="post-comments-mod">
                            <h5>Comments ({post.comments.length})</h5>
                            {post.comments.map((comment) => (
                              <div key={comment._id} className="moderation-comment">
                                <div className="comment-header">
                                  <strong>{comment.user?.name}</strong>
                                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                  <button
                                    className="delete-comment-btn"
                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                                <p>{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-content">No posts from this user</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminModeration;