import React, { useState } from 'react';
import ReviewRadar from '../components/performance/ReviewRadar';
import ImpactReceipts from '../components/performance/ImpactReceipts';
import GrowthStream from '../components/performance/GrowthStream';
import { Tabs, Tab } from '../components/ui/Tabs';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PerformancePage.css';

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('radar');
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="performance-loading">
        <span className="spinner" />
        Loading your performance profile...
      </div>
    );
  }

  return (
    <div className="performance-page">
      <header className="performance-header">
        <h1>Performance Hub</h1>
        <p className="subtitle">Your growth, impact, and trajectory—mapped in real time</p>
      </header>

      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <Tab id="radar" label="Review Radar">
          <ReviewRadar employeeId={user.id} />
        </Tab>

        <Tab id="impact" label="Impact Receipts">
          <ImpactReceipts employeeId={user.id} />
        </Tab>

        <Tab id="growth" label="Growth Stream">
          <GrowthStream employeeId={user.id} />
        </Tab>

        <Tab id="feedback" label="Give Feedback">
          <div className="feedback-form-card">
            <p className="coming-soon">🚧 Feedback form coming soon</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PerformancePage;
