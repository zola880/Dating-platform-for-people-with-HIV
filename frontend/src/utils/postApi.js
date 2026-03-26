import API from './api';

// Get all posts for the feed
export const getPosts = async () => {
  return await API.get('/posts');
};

// Create a new post with optional image/video
export const createPost = async (formData) => {
  return await API.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete a post
export const deletePost = async (postId) => {
  return await API.delete(`/posts/${postId}`);
};

// Like/unlike a post
export const likePost = async (postId) => {
  return await API.put(`/posts/${postId}/like`);
};

export const unlikePost = async (postId) => {
  return await API.put(`/posts/${postId}/unlike`);
};

// Add a comment
export const addComment = async (postId, text) => {
  return await API.post(`/posts/${postId}/comments`, { text });
};

// Delete a comment
export const deleteComment = async (postId, commentId) => {
  return await API.delete(`/posts/${postId}/comments/${commentId}`);
};