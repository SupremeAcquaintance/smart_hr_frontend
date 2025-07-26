// components/employees/BridgeBuilder.tsx
import React, { useState, useEffect } from 'react';
import { FaHandshake, FaUserPlus, FaTimes } from 'react-icons/fa';
import { useApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/BridgeBuilder.css';

interface Employee {
  id: number;
  name: string;
  position: string;
}

interface CollaborationSuggestion {
  employee1: Employee;
  employee2: Employee;
  reason: string;
  strength: number;
}

export const BridgeBuilder: React.FC = () => {
  const [suggestions, setSuggestions] = useState<CollaborationSuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(true);
  const api = useApi();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await api.get<CollaborationSuggestion[]>('/collaborations/suggestions');
        setSuggestions(response.data);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      } finally {
        setIsSuggesting(false);
      }
    };
    fetchSuggestions();
  }, [api]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const handleConnect = async () => {
    const current = suggestions[currentIndex];
    try {
      await api.post('/collaboration/introduce', {
        employeeId1: current.employee1.id,
        employeeId2: current.employee2.id,
        introducerId: user?.id,
      });

      const updated = suggestions.filter((_, i) => i !== currentIndex);
      setSuggestions(updated);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to introduce', error);
    }
  };

  if (isSuggesting) return <div className="bridge-builder loading">🔄 Analyzing connections...</div>;
  if (suggestions.length === 0) return <div className="bridge-builder empty">No collaboration suggestions found.</div>;

  const current = suggestions[currentIndex];

  return (
    <div className="bridge-builder">
      <div className="builder-header">
        <FaHandshake className="icon" />
        <h3>BridgeBuilder: Connect Potential</h3>
      </div>

      <div className="connection-strength">
        <div className="strength-bar-wrapper">
          <div className="strength-bar" style={{ width: `${current.strength}%` }}>
            {current.strength}% Match
          </div>
        </div>
      </div>

      <div className="employee-pair">
        {[current.employee1, current.employee2].map((emp, index) => (
          <div key={emp.id} className="employee-card">
            <div className="avatar-circle">{emp.name[0]}</div>
            <h4>{emp.name}</h4>
            <p>{emp.position}</p>
          </div>
        ))}

        <div className="vs-divider">
          <div className="vs-text">VS</div>
        </div>
      </div>

      <div className="connection-reason">
        <p>{current.reason}</p>
      </div>

      <div className="builder-actions">
        <button className="btn skip" onClick={handleNext}>
          Skip <FaTimes />
        </button>
        <button className="btn connect" onClick={handleConnect}>
          Connect <FaUserPlus />
        </button>
      </div>
    </div>
  );
};
