// src/pages/LeavePage.tsx
import React, { useState } from 'react';
import HarmonyScheduler from '../components/leave/HarmonyScheduler';
import LeaveCalendar from '../components/leave/LeaveCalendar';
import CoverMap from '../components/leave/CoverMap';
import { Tabs, Tab } from '../components/ui/Tabs';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LeavePage.css';

const LeavePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scheduler');
  const { user } = useAuth();
  console.log("User: ", user);

  if (!user) {
    return <div className="leave-page loading">Loading user data...</div>;
  }

  return (
    <div className="leave-page container">
      <h1 className="review-heading">🗓️ Leave Management</h1>

      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <Tab id="scheduler" label="Plan Leave">
          <div className="tab-panel">
            <HarmonyScheduler employeeId={Number(user.id)} />
          </div>
        </Tab>

        <Tab id="calendar" label="Team Calendar">
          <div className="tab-panel">
            <LeaveCalendar />
          </div>
        </Tab>

        <Tab id="coverage" label="Coverage Map">
          <div className="tab-panel">
            <CoverMap />
          </div>
        </Tab>

        <Tab id="history" label="My Leave History">
          <div className="tab-panel leave-history">
            <div className="placeholder">
              🚧 Leave history functionality coming soon...
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default LeavePage;
