// components/dashboard/TeamClimate.tsx
import React, { useState, useEffect } from 'react';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { useApi } from '../../services/api';
import { Chart } from 'react-chartjs-2';
import { useNotifications } from '../../contexts/NotificationContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/TeamClimate.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MoodData {
  date: string;
  happy: number;
  neutral: number;
  sad: number;
}

interface ApiResponse {
  data: MoodData[] | { mood: 'happy' | 'neutral' | 'sad' };
}

export const TeamClimate: React.FC = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [currentMood, setCurrentMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const api = useApi();
  const { addNotification } = useNotifications();
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await api.get<MoodData[]>('/team-climate/weekly');
        setMoodData(response.data);
        addNotification({ type: 'success', message: 'Mood fetched!', priority: 'medium' });
      } catch{
        addNotification({ type: 'error', message: 'Failed to fetch mood', priority: 'medium' });
      }
    };
    
    fetchMoodData();
    
    // Check if user has submitted mood today
    const checkTodayMood = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const response = await api.get<{ mood: 'happy' | 'neutral' | 'sad' }>(`/team-climate/today?date=${today}`);
        setCurrentMood(response.data.mood);
      }catch{

      }
    };
    
    checkTodayMood();
  }, [api]);

  const handleMoodSelect = async (mood: 'happy' | 'neutral' | 'sad') => {
    try {
      await api.post('/team-climate/submit', { mood });
      setCurrentMood(mood);
      addNotification({ type: 'success', message: 'Mood request submitted!', priority: 'medium' });
    } catch (error) {
      console.error('Failed to submit mood', error);
      addNotification({ type: 'error', message: 'Failed to submit mood', priority: 'medium' });
    }
  };

  const chartData = {
    labels: moodData.map(d => d.date),
    datasets: [
      {
        label: 'Happy',
        data: moodData.map(d => d.happy),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3
      },
      {
        label: 'Neutral',
        data: moodData.map(d => d.neutral),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        tension: 0.3
      },
      {
        label: 'Sad',
        data: moodData.map(d => d.sad),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="team-climate">
      <div className="climate-header">
        <h3>Team Pulse</h3>
        <p>How is your team feeling today?</p>
      </div>
      
      {currentMood ? (
        <div className="mood-submitted">
          <p>You reported feeling <strong>{currentMood}</strong> today</p>
        </div>
      ) : (
        <div className="mood-selector">
          <button onClick={() => handleMoodSelect('happy')} className="mood-btn happy">
            <FaSmile /> Happy
          </button>
          <button onClick={() => handleMoodSelect('neutral')} className="mood-btn neutral">
            <FaMeh /> Neutral
          </button>
          <button onClick={() => handleMoodSelect('sad')} className="mood-btn sad">
            <FaFrown /> Sad
          </button>
        </div>
      )}
      
      <div className="climate-chart">
        <Chart type="line" data={chartData} options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          },
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }} />
      </div>
    </div>
  );
};