import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { likePost, unlikePost, addComment, deleteComment } from '../utils/postApi';
import config from '../utils/config';
import './Post.css';

// SVG Icons matching Instagram
const Icons = {
  Heart: ({ filled }) => (
    <svg aria-label="Like" color={filled ? "#ed4956" : "#262626"} fill={filled ? "#ed4956" : "#262626"} height="24" role="img" viewBox="0 0 24 24" width="24">
      {filled ? (
        <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z" />
      ) : (
        <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z" />
      )}
    </svg>
  ),
  Comment: () => (
    <svg aria-label="Comment" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  Share: () => (
    <svg aria-label="Share Post" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
      <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083" />
      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  Save: () => (
    <svg aria-label="Save" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
      <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  More: () => (
    <svg aria-label="More options" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  )
};

const Post = ({ post, onDelete, isActive }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id;
  const [liked, setLiked] = useState(user ? post.likes?.some(like => like._id === userId) : false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
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
    if (!user) return navigate('/login');
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
    if (!user) return navigate('/login');
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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " YEAR" + (Math.floor(interval) > 1 ? "S" : "") + " AGO";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " MONTH" + (Math.floor(interval) > 1 ? "S" : "") + " AGO";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " DAY" + (Math.floor(interval) > 1 ? "S" : "") + " AGO";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " HOUR" + (Math.floor(interval) > 1 ? "S" : "") + " AGO";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " MINUTE" + (Math.floor(interval) > 1 ? "S" : "") + " AGO";
    
    return "JUST NOW";
  };

  return (
    <article className="ig-post">
      {/* Header */}
      <div className="ig-post-header">
        <div className="ig-post-header-user">
          <img 
            src={getProfilePictureUrl(post.user?.profilePicture)} 
            alt={post.user?.name} 
            className="ig-post-avatar" 
          />
          <span className="ig-post-username">{post.user?.name?.split(' ').join('_').toLowerCase() || 'user'}</span>
          <span className="ig-post-time-dot">•</span>
          <span className="ig-post-time-header">{formatTimeAgo(post.createdAt).split(' ')[0] + formatTimeAgo(post.createdAt).split(' ')[1]?.charAt(0).toLowerCase()}</span>
        </div>
        <div className="ig-post-more" onClick={() => post.user?._id === userId && onDelete(post._id)}>
          <Icons.More />
        </div>
      </div>

      {/* Media */}
      {mediaUrl && (
        <div className="ig-post-media" onDoubleClick={handleLike}>
          {mediaType === 'image' ? (
            <img src={mediaUrl} alt="Post" />
          ) : mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              controls={false}
              loop
              muted={true}
              playsInline
            />
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="ig-post-actions-wrapper">
        <div className="ig-post-actions">
          <div className="ig-post-action-left">
            <button className="ig-action-btn" onClick={handleLike}>
              <Icons.Heart filled={liked} />
            </button>
            <button className="ig-action-btn" onClick={() => document.getElementById(`comment-input-${post._id}`).focus()}>
              <Icons.Comment />
            </button>
            <button className="ig-action-btn">
              <Icons.Share />
            </button>
          </div>
          <div className="ig-post-action-right">
            <button className="ig-action-btn">
              <Icons.Save />
            </button>
          </div>
        </div>

        {/* Likes Count */}
        {likesCount > 0 && (
          <div className="ig-post-likes">
            <span>{likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}</span>
          </div>
        )}

        {/* Caption */}
        <div className="ig-post-caption">
          <span className="ig-post-username">{post.user?.name?.split(' ').join('_').toLowerCase() || 'user'}</span>
          <span className="ig-post-caption-text"> {post.content}</span>
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="ig-post-comments">
            {comments.length > 1 && !showAllComments && (
              <div 
                className="ig-post-view-comments" 
                onClick={() => setShowAllComments(true)}
              >
                View all {comments.length} comments
              </div>
            )}
            
            {(showAllComments ? comments : comments.slice(0, 1)).map((comment) => (
              <div key={comment._id} className="ig-post-comment-item">
                <span className="ig-post-username">{comment.user?.name?.split(' ').join('_').toLowerCase() || 'user'}</span>
                <span className="ig-post-comment-text"> {comment.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="ig-post-time">
          {formatTimeAgo(post.createdAt)}
        </div>
      </div>

      {/* Add Comment */}
      {user && (
        <form className="ig-post-add-comment" onSubmit={handleAddComment}>
          <input
            id={`comment-input-${post._id}`}
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          {commentText.trim() && (
            <button type="submit" disabled={loading} className="ig-post-post-btn">
              Post
            </button>
          )}
        </form>
      )}
    </article>
  );
};

export default Post;