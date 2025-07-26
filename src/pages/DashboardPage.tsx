// src/pages/Dashboard.tsx (Enhanced)
import React from 'react';
import StatsWidget from '../components/dashboard/StatsWidget';
import { TeamClimate } from '../components/dashboard/TeamClimate';
import '../styles/Dashboard.css'

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-heading">Dashboard</h1>
      <StatsWidget />
      <TeamClimate />
    </div>
  );
};

export default DashboardPage;