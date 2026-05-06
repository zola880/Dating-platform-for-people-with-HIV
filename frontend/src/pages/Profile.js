import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../utils/postApi';
import config from '../utils/config';
import Spinner from '../components/Spinner';
import './Profile.css';

// SVG Icons
const Icons = {
  Grid: ({ active }) => (
    <svg aria-label="Posts" color={active ? "#262626" : "#8e8e8e"} fill={active ? "#262626" : "#8e8e8e"} height="12" role="img" viewBox="0 0 24 24" width="12">
      <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
      <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
    </svg>
  ),
  Settings: () => (
    <svg aria-label="Options" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24">
      <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
      <path d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  )
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    lookingFor: user?.lookingFor?.[0] || '',
    bio: user?.bio || '',
    profilePicture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // To display user posts grid
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await getPosts();
      // Filter for this user's posts
      const myPosts = response.data.filter(p => p.user?._id === user._id);
      setUserPosts(myPosts);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const getProfilePictureUrl = () => {
    if (user?.profilePicture && user.profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(user.profilePicture);
    }
    return '/default-avatar.png';
  };

  const getMediaUrl = (post) => {
    const fileName = post.media || post.image;
    if (fileName && fileName !== 'default-avatar.png') {
      return config.getUploadUrl(fileName);
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateUser(user._id, formData);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPreview(null);
      setFormData(prev => ({ ...prev, profilePicture: null }));
      setIsEditing(false);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (!user) return <div className="ig-loading-container"><Spinner /></div>;

  return (
    <div className="ig-profile-page">
      <div className="ig-profile-header">
        
        {/* Left: Avatar */}
        <div className="ig-profile-avatar-wrapper">
          <div className="ig-profile-avatar-inner">
            <img src={getProfilePictureUrl()} alt={user.name} />
          </div>
        </div>

        {/* Right: Info */}
        <div className="ig-profile-info-wrapper">
          <div className="ig-profile-username-row">
            <h2>{user.name?.split(' ').join('_').toLowerCase() || 'user'}</h2>
            <div className="ig-profile-actions">
              <button className="btn-secondary ig-edit-btn" onClick={() => setIsEditing(true)}>Edit profile</button>
              <button className="ig-settings-btn"><Icons.Settings /></button>
            </div>
          </div>

          <div className="ig-profile-stats">
            <span><span className="font-weight-semibold">{userPosts.length}</span> posts</span>
            <span><span className="font-weight-semibold">124</span> followers</span>
            <span><span className="font-weight-semibold">150</span> following</span>
          </div>

          <div className="ig-profile-bio-section">
            <h1 className="ig-profile-fullname">{user.name}</h1>
            {user.gender && user.age && <div className="ig-profile-details text-secondary">{user.age} • {user.gender}</div>}
            {user.bio && <div className="ig-profile-bio">{user.bio}</div>}
          </div>
        </div>
      </div>

      {/* Mobile Bio Section (shows below stats on mobile) */}
      <div className="ig-profile-bio-mobile">
        <h1 className="ig-profile-fullname">{user.name}</h1>
        {user.gender && user.age && <div className="ig-profile-details text-secondary">{user.age} • {user.gender}</div>}
        {user.bio && <div className="ig-profile-bio">{user.bio}</div>}
      </div>

      <div className="ig-profile-tabs">
        <div className="ig-profile-tab active">
          <Icons.Grid active={true} /> POSTS
        </div>
      </div>

      <div className="ig-profile-grid">
        {postsLoading ? (
          <div className="ig-profile-loading"><Spinner /></div>
        ) : userPosts.length > 0 ? (
          userPosts.map(post => {
            const mediaUrl = getMediaUrl(post);
            const isVideo = post.mediaType === 'video' || (mediaUrl && mediaUrl.endsWith('.mp4'));
            
            if (!mediaUrl) return null;

            return (
              <div key={post._id} className="ig-profile-grid-item">
                {isVideo ? (
                  <video src={mediaUrl} muted />
                ) : (
                  <img src={mediaUrl} alt="Post thumbnail" />
                )}
                <div className="ig-profile-grid-overlay">
                  <span>❤️ {post.likes?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="ig-profile-empty">
            <div className="ig-profile-empty-icon">📷</div>
            <h3>No Posts Yet</h3>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="ig-modal-backdrop">
          <div className="ig-modal-content ig-edit-modal">
            <div className="ig-modal-header">
              <h3>Edit Profile</h3>
              <button className="ig-modal-close-btn" onClick={() => setIsEditing(false)}>✕</button>
            </div>
            
            <div className="ig-modal-body">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleSubmit} className="ig-edit-form">
                <div className="ig-edit-avatar-section">
                  <img src={preview || getProfilePictureUrl()} alt="Preview" className="ig-edit-avatar-preview" />
                  <div className="ig-edit-avatar-input">
                    <span className="ig-edit-username">{user.name?.split(' ').join('_').toLowerCase()}</span>
                    <label className="ig-change-photo-btn">
                      Change profile photo
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                <div className="ig-edit-form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                </div>

                <div className="ig-edit-form-row">
                  <div className="ig-edit-form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" min="18" max="120" />
                  </div>
                  <div className="ig-edit-form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="ig-edit-form-group">
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" />
                  <div className="ig-textarea-count">{formData.bio.length} / 150</div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;