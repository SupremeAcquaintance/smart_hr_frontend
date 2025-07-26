// src/components/employees/TimeCapsule.tsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import {
  FaMedal,
  FaProjectDiagram,
  FaGraduationCap,
  FaCalendarAlt,
} from 'react-icons/fa';
import '../../styles/TimeCapsule.css';

interface Milestone {
  id: string;
  type: 'achievement' | 'project' | 'education' | 'other';
  date: string;
  title: string;
  description: string;
  project?: string;
}

interface TimeCapsuleProps {
  employeeId: string;
  showProjects?: boolean;
}

const TimeCapsule: React.FC<TimeCapsuleProps> = ({ employeeId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchMilestones = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Milestone[]>(`/employees/${employeeId}/timeline`);
        setMilestones(response.data);
      } catch (error) {
        console.error('Failed to fetch milestones', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) fetchMilestones();
  }, [employeeId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <FaMedal className="icon achievement" />;
      case 'project':
        return <FaProjectDiagram className="icon project" />;
      case 'education':
        return <FaGraduationCap className="icon education" />;
      default:
        return <FaCalendarAlt className="icon other" />;
    }
  };

  if (isLoading) {
    return <div className="time-capsule loading">Loading milestones...</div>;
  }

  if (!isLoading && milestones.length === 0) {
    return <div className="time-capsule empty">No milestones found.</div>;
  }

  return (
    <div className="time-capsule">
      <h2 className="capsule-header">Time Capsule</h2>
      <div className="timeline">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-point">{getIcon(milestone.type)}</div>
            <div className="timeline-content">
              <span className="date">{new Date(milestone.date).toLocaleDateString()}</span>
              <h4>{milestone.title}</h4>
              <p>{milestone.description}</p>
              {milestone.project && <span className="project-tag">{milestone.project}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeCapsule;