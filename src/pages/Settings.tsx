import React, { useState, useEffect } from 'react';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { settingsService } from '../services/api';
import '../styles/Settings.css';

interface ProfileFormData {
  name: string;
  email: string;
  department: string;
  position: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    department: '',
    position: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: `${user.first_name} ${user.last_name}` || '',
        email: user.email || '',
        department: user.department || '',
        position: user.position || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setProfileError('');
    setProfileSuccess('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const saveProfile = async () => {
    if (!formData.name || !formData.email) {
      setProfileError('Name and email are required');
      return;
    }

    setIsSaving(true);
    try {
      await settingsService.updateProfile(formData);
      await refreshUser();
      setProfileSuccess('Profile updated successfully');
      setProfileError('');
    } catch (error: any) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setIsSaving(true);
    try {
      await settingsService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('Password changed successfully');
      setPasswordError('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <div className="settings-card-grid">

        <div className="settings-card">
          <h2 className="setting-card-heading">👤 Profile</h2>
          {profileError && <div className="alert error">{profileError}</div>}
          {profileSuccess && <div className="alert success">{profileSuccess}</div>}
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleProfileChange} />
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleProfileChange} />
          <label>Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleProfileChange} />
          <label>Position</label>
          <input type="text" name="position" value={formData.position} onChange={handleProfileChange} />
          <button className="primary-btn" onClick={saveProfile} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        <div className="settings-card">
          <h2 className="setting-card-heading">🔒 Password</h2>
          {passwordError && <div className="alert error">{passwordError}</div>}
          {passwordSuccess && <div className="alert success">{passwordSuccess}</div>}
          <label>Current Password</label>
          <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
          <label>New Password</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
          <button className="primary-btn" onClick={changePassword} disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Change Password'}
          </button>
        </div>

        <div className="settings-card">
          <h2 className="setting-card-heading">🎨 Theme</h2>
          <ThemeToggle />
        </div>

        <div className="settings-card danger">
          <h2 className="setting-card-heading">🚪 Logout</h2>
          <button className="logout-btn" onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
