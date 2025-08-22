import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Settings as SettingsIcon } from 'lucide-react';

const SettingsModal = ({
  show,
  onClose,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onGenerateMockData
}) => {
  const [activeSection, setActiveSection] = useState('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Tester',
    status: 'active'
  });

  if (!show) return null;

  const leftAlignStyle = { textAlign: 'left' };

  const handleAddUser = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'Tester',
      status: 'active'
    });
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleSubmitUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    const userData = {
      ...userForm,
      id: editingUser ? editingUser.id : Date.now().toString()
    };

    if (editingUser) {
      onUpdateUser(editingUser.id, userData);
    } else {
      onAddUser(userData);
    }

    setShowUserForm(false);
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      role: 'Tester',
      status: 'active'
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(userId);
    }
  };

  const renderUserManagement = () => (
    <div className="space-y-4" style={leftAlignStyle}>
      <div className="flex justify-between items-center" style={leftAlignStyle}>
        <h4 className="text-lg font-medium text-gray-900" style={leftAlignStyle}>User Management</h4>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
          style={leftAlignStyle}
        >
          <Plus className="w-3 h-3" />
          Add User
        </button>
      </div>

      {showUserForm && (
        <div className="border rounded-lg p-4 bg-gray-50" style={leftAlignStyle}>
          <h5 className="text-md font-medium text-gray-900 mb-3" style={leftAlignStyle}>
            {editingUser ? 'Edit User' : 'Add New User'}
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" style={leftAlignStyle}>
            <div style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={leftAlignStyle}>Name</label>
              <input
                type="text"
                value={userForm.name}
                onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user name"
                style={leftAlignStyle}
              />
            </div>
            <div style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={leftAlignStyle}>Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
                style={leftAlignStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" style={leftAlignStyle}>
            <div style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={leftAlignStyle}>Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={leftAlignStyle}
              >
                <option value="Admin" style={leftAlignStyle}>Admin</option>
                <option value="Test Manager" style={leftAlignStyle}>Test Manager</option>
                <option value="Tester" style={leftAlignStyle}>Tester</option>
                <option value="Developer" style={leftAlignStyle}>Developer</option>
                <option value="Viewer" style={leftAlignStyle}>Viewer</option>
              </select>
            </div>
            <div style={leftAlignStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={leftAlignStyle}>Status</label>
              <select
                value={userForm.status}
                onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={leftAlignStyle}
              >
                <option value="active" style={leftAlignStyle}>Active</option>
                <option value="inactive" style={leftAlignStyle}>Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2" style={leftAlignStyle}>
            <button
              onClick={() => setShowUserForm(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
              style={leftAlignStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitUser}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              style={leftAlignStyle}
            >
              {editingUser ? 'Update' : 'Add'} User
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border" style={leftAlignStyle}>
        <div className="overflow-x-auto" style={leftAlignStyle}>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(users || []).map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(!users || users.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No users found</p>
            <button
              onClick={handleAddUser}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Add your first user
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-4" style={leftAlignStyle}>
      <h4 className="text-lg font-medium text-gray-900" style={leftAlignStyle}>Data Management</h4>
      
      <div className="bg-gray-50 p-4 rounded-lg" style={leftAlignStyle}>
        <h5 className="text-md font-medium text-gray-900 mb-3" style={leftAlignStyle}>Generate Test Data</h5>
        <p className="text-sm text-gray-600 mb-4" style={leftAlignStyle}>
          Generate sample projects, test cases, test plans, and test runs for testing and demonstration purposes.
        </p>
        <button
          onClick={() => {
            if (window.confirm('This will add new sample data to your existing data. Continue?')) {
              if (onGenerateMockData) {
                onGenerateMockData();
                alert('Sample data generated successfully!');
              }
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          style={leftAlignStyle}
        >
          <Plus className="w-4 h-4" />
          Generate Sample Data
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg" style={leftAlignStyle}>
        <h5 className="text-md font-medium text-gray-900 mb-3" style={leftAlignStyle}>Clear All Data</h5>
        <p className="text-sm text-gray-600 mb-4" style={leftAlignStyle}>
          Remove all projects, test cases, test plans, and test runs. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          style={leftAlignStyle}
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={leftAlignStyle}>
        <div className="flex justify-between items-center mb-4" style={leftAlignStyle}>
          <h3 className="text-lg font-semibold flex items-center gap-2" style={leftAlignStyle}>
            <SettingsIcon className="w-5 h-5 text-gray-600" />
            Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            style={leftAlignStyle}
          >
            ✕
          </button>
        </div>

        <div className="flex border-b mb-6" style={leftAlignStyle}>
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeSection === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            style={leftAlignStyle}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveSection('data')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeSection === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            style={leftAlignStyle}
          >
            <SettingsIcon className="w-4 h-4 inline mr-2" />
            Data Management
          </button>
        </div>

        {activeSection === 'users' && renderUserManagement()}
        {activeSection === 'data' && renderDataManagement()}
        
        <div className="flex justify-end mt-6" style={leftAlignStyle}>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            style={leftAlignStyle}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
