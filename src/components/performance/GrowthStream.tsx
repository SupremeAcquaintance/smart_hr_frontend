// src/components/performance/GrowthStream.tsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaComment, FaStar, FaChartBar } from 'react-icons/fa';
import { performanceService } from '../../services/api';
import { Button } from '../ui/Tabs';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/GrowthStream.css';

interface GrowthEntry {
  id: number;
  content: string;
  date: string;
  author?: string;
  rating?: number;
  skill?: string;
  level?: number;
}

const GrowthStream: React.FC<{ employeeId: number }> = ({ employeeId }) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'achievements' | 'skills'>('feedback');
  const [newEntry, setNewEntry] = useState('');
  const [entries, setEntries] = useState({
    feedback: [] as GrowthEntry[],
    achievements: [] as GrowthEntry[],
    skills: [] as GrowthEntry[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const response = await performanceService.getPerformanceData(employeeId);
        setEntries({
          feedback: response.data.feedback || [],
          achievements: response.data.achievements || [],
          skills: response.data.skills || []
        });
      } catch (error) {
        console.error('Failed to fetch growth data', error);
        addNotification({
          type: 'error',
          message: 'Failed to load growth data',
          priority: 'medium'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrowthData();
  }, [employeeId, addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      const newItem: GrowthEntry = {
        id: Date.now(),
        content: newEntry,
        date: new Date().toISOString(),
        author: 'You'
      };

      await performanceService.addFeedback(employeeId, {
        content: newEntry,
        value: activeTab === 'skills' ? 4 : activeTab === 'feedback' ? 3 : null,
        type: activeTab === 'achievements' ? 'achievement' : activeTab === 'skills' ? 'skill' : 'feedback'
      });

      setEntries(prev => ({
        ...prev,
        [activeTab]: [newItem, ...prev[activeTab]]
      }));

      setNewEntry('');
      addNotification({
        type: 'success',
        message: 'Entry added successfully!',
        priority: 'low'
      });
    } catch (error) {
      console.error('Failed to add entry', error);
      addNotification({
        type: 'error',
        message: 'Failed to add entry',
        priority: 'medium'
      });
    }
  };

  if (isLoading) return <div className="growth-stream loading">Loading growth data...</div>;

  return (
    <div className="growth-stream futuristic-glass">
      <div className="stream-header">
        <h3 className="review-heading">Growth Stream</h3>
        <div className="growth-tabs">
          <Button
            variant={activeTab === 'feedback' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('feedback')}
            aria-label="Feedback tab"
          >
            <FaComment /> Feedback
          </Button>
          <Button
            variant={activeTab === 'achievements' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('achievements')}
            aria-label="Achievements tab"
          >
            <FaStar /> Achievements
          </Button>
          <Button
            variant={activeTab === 'skills' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('skills')}
            aria-label="Skills tab"
          >
            <FaChartBar /> Skills
          </Button>
        </div>
      </div>

      <div className="stream-content">
        <form onSubmit={handleSubmit} className="new-entry">
          <input
            type="text"
            placeholder={`Add new ${activeTab}...`}
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="primary"
            className="btn-icon"
            disabled={isLoading}
            aria-label="Add new entry"
          >
            <FaPlus />
          </Button>
        </form>

        <div className="entries">
          {entries[activeTab].length === 0 ? (
            <div className="empty-state">No {activeTab} yet</div>
          ) : (
            entries[activeTab].map((entry) => (
              <div key={entry.id} className={`entry ${activeTab}-entry`}>
                <div className="content">{entry.content}</div>
                <div className="meta">
                  {entry.skill && <div className="skill-name">{entry.skill}</div>}
                  {entry.level !== undefined && (
                    <div className="skill-level">
                      <div className="level-bar" style={{ width: `${(entry.level || 0) * 20}%` }}></div>
                      <span>Level {entry.level}</span>
                    </div>
                  )}
                  {entry.author && <span className="author">{entry.author}</span>}
                  <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
                  {entry.rating !== undefined && (
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (entry.rating || 0) ? 'filled' : ''}>★</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthStream;