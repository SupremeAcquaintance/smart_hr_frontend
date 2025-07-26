import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { performanceService } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/ReviewRadar.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface SkillData {
  name: string;
  level: number;
  target: number;
}

interface SkillDataResponse {
  skills: SkillData[];
}

const ReviewRadar: React.FC<{ employeeId: number }> = ({ employeeId }) => {
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        const response = await performanceService.getSkillData(employeeId);
        setSkillData(response.data.skills || []);
      } catch (error) {
        console.error('Failed to fetch skill data', error);
        addNotification({
          type: 'error',
          message: 'Failed to load skill data',
          priority: 'medium'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillData();
  }, [employeeId, addNotification]);

  const chartData = {
    labels: skillData.map(s => s.name),
    datasets: [
      {
        label: 'Current Skills',
        data: skillData.map(s => s.level),
        backgroundColor: 'rgba(0, 153, 255, 0.3)',
        borderColor: 'rgba(0, 153, 255, 1)',
        pointBackgroundColor: 'rgba(0, 153, 255, 1)',
        borderWidth: 2,
      },
      {
        label: 'Target Skills',
        data: skillData.map(s => s.target),
        backgroundColor: 'rgba(0, 255, 170, 0.2)',
        borderColor: 'rgba(0, 255, 170, 1)',
        pointBackgroundColor: 'rgba(0, 255, 170, 1)',
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="review-radar futuristic-panel">
      <div className="radar-header">
        <h2 className="review-heading">Performance Radar</h2>
        <p className="radar-subtext">Visualize skill alignment with targets</p>
      </div>
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div> Loading radar data...
        </div>
      ) : skillData.length > 0 ? (
        <Radar 
          data={chartData} 
          options={{
            responsive: true,
            scales: {
              r: {
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1,
                  display: false
                },
                grid: {
                  color: 'rgba(255,255,255,0.08)'
                },
                angleLines: {
                  color: 'rgba(255,255,255,0.08)'
                },
                pointLabels: {
                  color: 'var(--text)',
                  font: {
                    size: 13
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: 'var(--text-muted)',
                  boxWidth: 12,
                  font: {
                    size: 12
                  }
                }
              }
            }
          }} 
        />
      ) : (
        <div className="no-data">No skill data available</div>
      )}
    </div>
  );
};

export default ReviewRadar;