// Post.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { likePost, unlikePost, addComment, deleteComment } from '../utils/postApi';
import config from '../utils/config';
import './Post.css';

const Post = ({ post, onDelete, isActive }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(post.likes?.some(like => like._id === user._id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // local follow state
  const videoRef = useRef(null);

  const getProfilePictureUrl = (profilePicture) => {
    if (profilePicture && profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(profilePicture);
    }
    return '/default-avatar.png';
  };

  const getMediaUrl = () => {
    const fileName = post.media || post.image;
    if (fileName && fileName !== 'default-avatar.png') {
      return config.getUploadUrl(fileName);
    }
    return null;
  };

  const mediaUrl = getMediaUrl();
  const mediaType = post.mediaType || (mediaUrl ? 'image' : 'none');

  useEffect(() => {
    if (videoRef.current && mediaType === 'video') {
      if (isActive) {
        videoRef.current.play().catch(e => console.log('Video play failed:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, mediaType]);

  const handleLike = async () => {
    try {
      setLoading(true);
      if (liked) {
        await unlikePost(post._id);
        setLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post._id);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Like/unlike error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setLoading(true);
      const response = await addComment(post._id, commentText);
      setComments(response.data.comments);
      setCommentText('');
    } catch (error) {
      console.error('Add comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      setLoading(true);
      const response = await deleteComment(post._id, commentId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Delete comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: add actual follow/unfollow API call
  };

  return (
    <div className="post-wrapper">
      {/* Post Card */}
      <div className="post-card">
        <div className="post-header">
          <img
            src={getProfilePictureUrl(post.user?.profilePicture)}
            alt={post.user?.name}
            className="post-avatar"
          />
          <div className="post-user-info">
            <h4>{post.user?.name}</h4>
            <span className="post-date">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          {post.user?._id === user._id && (
            <button className="post-delete" onClick={() => onDelete(post._id)}>
              Delete
            </button>
          )}
        </div>
        <div className="post-content">
          <p>{post.content}</p>
          {mediaUrl && (
            <div className="post-media">
              {mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt="Post"
                  className="post-image"
                  onClick={() => setSelectedImage(mediaUrl)}
                  style={{ cursor: 'pointer' }}
                />
              ) : mediaType === 'video' ? (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  className="post-video"
                  controls={false}
                  loop
                  muted={false}
                />
              ) : null}
            </div>
          )}
        </div>
        <div className="post-actions">
          <button onClick={handleLike} disabled={loading} className="like-btn">
            {liked ? '❤️' : '🤍'} {likesCount}
          </button>
          <button onClick={() => setShowComments(!showComments)}>
            💬 {comments.length}
          </button>
        </div>
        {showComments && (
          <div className="post-comments">
            {comments.map(comment => (
              <div key={comment._id} className="comment">
                <img
                  src={getProfilePictureUrl(comment.user?.profilePicture)}
                  alt={comment.user?.name}
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <strong>{comment.user?.name}</strong>
                  <p>{comment.text}</p>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                {(comment.user?._id === user._id || post.user?._id === user._id) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="comment-delete"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <form onSubmit={handleAddComment} className="add-comment">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !commentText.trim()}>
                Post
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Side Actions */}
      <div className="post-actions-side">
        <div className="action-profile">
          <img
            src={getProfilePictureUrl(post.user?.profilePicture)}
            alt={post.user?.name}
            className="action-avatar"
          />
          <div className="action-username">{post.user?.name}</div>
          <button className={`follow-btn ${isFollowing ? 'following' : ''}`} onClick={toggleFollow}>
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
        <div className="action-item" onClick={handleLike}>
          <div className="action-icon">{liked ? '❤️' : '🤍'}</div>
          <div className="action-count">{likesCount}</div>
        </div>
        <div className="action-item" onClick={() => setShowComments(!showComments)}>
          <div className="action-icon">💬</div>
          <div className="action-count">{comments.length}</div>
        </div>
        <div className="action-item">
          <div className="action-icon">🔖</div>
          <div className="action-count">0</div>
        </div>
        <div className="action-item">
          <div className="action-icon">➤</div>
        </div>
      </div>

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

export default Post;