// src/components/leave/CoverMap.tsx
import React, { useState, useEffect } from 'react';
import { FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';
import { leaveService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/CoverMap.css';

interface EmployeeCoverage {
  id: string;
  name: string;
  status: 'covered' | 'uncovered' | 'partial';
}

interface DayCoverage {
  date: string;
  employees: EmployeeCoverage[];
}

const CoverMap: React.FC = () => {
  const [coverage, setCoverage] = useState<DayCoverage[]>([]);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.toISOString().split('T')[0];
  });

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCoverage = async () => {
      setIsLoading(true);
      try {
        const response = await leaveService.getCoverMap({ start: startDate, end: endDate });
        setCoverage(response.data);
      } catch (error) {
        console.error('Failed to fetch cover map', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverage();
  }, [startDate, endDate]);

  const getStatusIcon = (status: EmployeeCoverage['status']) => {
    switch (status) {
      case 'covered':
        return <FaUserCheck />;
      case 'uncovered':
        return <FaUserTimes />;
      case 'partial':
        return <FaUserClock />;
      default:
        return null;
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    setStartDate(new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]);
    setEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]);
  };

  return (
    <div className="cover-map-container">
      <div className="cover-map-controls">
        <button onClick={() => handleMonthChange('prev')} className="nav-btn">&lt;</button>
        <div className="date-range">
          <label>
            Start:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>
          <label>
            End:
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>
        </div>
        <button onClick={() => handleMonthChange('next')} className="nav-btn">&gt;</button>
      </div>

      {isLoading ? (
        <div className="cover-loading">Loading coverage...</div>
      ) : coverage.length === 0 ? (
        <div className="no-coverage">No data available</div>
      ) : (
        <div className="cover-grid">
          {coverage.map((day) => (
            <div key={day.date} className="cover-card">
              <div className="cover-date">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })} <br />
                <span>{new Date(day.date).getDate()}</span>
              </div>
              <div className="cover-employees">
                {day.employees.map((emp) => (
                  <div key={emp.id} className={`emp-badge ${emp.status}`}>
                    <div className="avatar">{emp.name.charAt(0)}</div>
                    <div className="icon">{getStatusIcon(emp.status)}</div>
                    <div className="tooltip">{emp.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverMap;
