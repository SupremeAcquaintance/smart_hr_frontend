// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/SignupForm.css';

const departments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Product Development' },
  { id: 5, name: 'Finance' },
  { id: 6, name: 'Operations' },
  { id: 7, name: 'Design' },
  { id: 8, name: 'Quality Assurance' },
  { id: 9, name: 'Customer Support' },
  { id: 10, name: 'Business Analysis' },
];

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department_id: '',
    position: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { first_name, last_name, email, password, department_id, position } = formData;

    if (!first_name || !last_name || !email || !password || !department_id || !position) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name,
        last_name,
        email,
        password,
        department_id: Number(department_id), // ✅ Convert string to number
        position,
        role: 'employee',
      };
      const res = await authService.signup(payload);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          value={formData.first_name}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          value={formData.last_name}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <select
          name="department_id"
          onChange={handleChange}
          value={formData.department_id}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <input
          name="position"
          placeholder="Position"
          onChange={handleChange}
          value={formData.position}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default SignupPage;