import API from './api';

export const getPosts = () => API.get('/posts');
export const createPost = (formData) => API.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePost = (id, formData) => API.put(`/posts/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const unlikePost = (id) => API.put(`/posts/${id}/unlike`);
export const addComment = (id, text) => API.post(`/posts/${id}/comments`, { text });
export const deleteComment = (postId, commentId) => API.delete(`/posts/${postId}/comments/${commentId}`);