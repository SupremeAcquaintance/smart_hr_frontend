// src/components/dashboard/StatsWidget.tsx
import React from 'react';
import { FaUsers, FaCalendarAlt, FaChartLine, FaClock } from 'react-icons/fa';
import '../../styles/StatsWidget.css';

const StatsWidget: React.FC = () => {
  // Mock data - in real app, fetch from API
  const stats = [
    { icon: <FaUsers />, label: 'Total Employees', value: 42, change: +5 },
    { icon: <FaCalendarAlt />, label: 'On Leave Today', value: 3, change: -1 },
    { icon: <FaChartLine />, label: 'Avg. Productivity', value: '87%', change: +2 },
    { icon: <FaClock />, label: 'Pending Approvals', value: 7, change: 0 }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
          <div className={`stat-change ${stat.change > 0 ? 'positive' : stat.change < 0 ? 'negative' : 'neutral'}`}>
            {stat.change > 0 ? '+' : ''}{stat.change !== 0 ? stat.change : '-'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsWidget;