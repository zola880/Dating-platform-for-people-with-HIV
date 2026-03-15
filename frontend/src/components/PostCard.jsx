import { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardActions, Avatar, IconButton,
  Typography, TextField, Button, Box
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Comment as CommentIcon, MoreVert
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';

const PostCard = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      await api.put(`/posts/${post._id}/like`);
      setLiked(!liked);
      onUpdate && onUpdate();
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await api.post(`/posts/${post._id}/comment`, { text: comment });
      setComment('');
      toast.success('Comment added');
      onUpdate && onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar src={post.createdBy?.profilePicture}>{post.createdBy?.username?.[0]}</Avatar>}
        action={<IconButton><MoreVert /></IconButton>}
        title={post.createdBy?.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="body1">{post.text}</Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleLike}>
          {liked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2">{post.likes?.length || 0}</Typography>
        
        <IconButton onClick={() => setShowComments(!showComments)}>
          <CommentIcon />
        </IconButton>
        <Typography variant="body2">{post.comments?.length || 0}</Typography>
      </CardActions>

      {showComments && (
        <CardContent>
          <Box sx={{ mb: 2 }}>
            {post.comments?.map((c, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{c.user?.username}:</strong> {c.text}
                </Typography>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleComment} sx={{ mt: 1 }}>Post Comment</Button>
        </CardContent>
      )}
    </Card>
  );
};

export default PostCard;
