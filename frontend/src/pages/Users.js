import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser, clearError, clearSuccess } from '../store/userSlice';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success } = useSelector((state) => state.users);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return;
    }

    if (editingUser) {
      await dispatch(updateUser({ id: editingUser.id, userData: formData }));
      setEditingUser(null);
    } else {
      await dispatch(createUser(formData));
    }

    setFormData({ name: '', email: '' });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(id));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>User Management</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              type="submit" 
              className="button"
              disabled={loading}
            >
              {loading ? 'Processing...' : (editingUser ? 'Update User' : 'Create User')}
            </button>
            
            {editingUser && (
              <button 
                type="button" 
                className="button" 
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Users List</h3>
        
        {loading && users.length === 0 ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <p>No users found. Create your first user above!</p>
        ) : (
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id} className="user-item">
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <small>Created: {new Date(user.created_at).toLocaleDateString()}</small>
                </div>
                <div className="user-actions">
                  <button
                    className="button button-small"
                    onClick={() => handleEdit(user)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-small button-danger"
                    onClick={() => handleDelete(user.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
