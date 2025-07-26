import React, { useState, useEffect } from 'react';
import { FaStar, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';
import { performanceService } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';

interface ImpactItem {
  category: string;
  score: number;
  description: string;
}

const ImpactReceipts: React.FC<{ employeeId: number }> = ({ employeeId }) => {
  const [impactData, setImpactData] = useState<ImpactItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await performanceService.getPerformanceData(employeeId);
        // Simulated aggregation: parse data into impact categories
        const allEntries = [...(response.data.feedback || []), ...(response.data.achievements || [])];
        const categories: Record<string, ImpactItem> = {};

        allEntries.forEach((entry: any) => {
          const category = categorize(entry.content);
          if (!categories[category]) {
            categories[category] = {
              category,
              score: entry.rating || 5,
              description: entry.content,
            };
          } else {
            categories[category].score = Math.min(10, categories[category].score + (entry.rating || 1));
          }
        });

        setImpactData(Object.values(categories));
      } catch (err) {
        console.error('Failed to load impact data', err);
        addNotification({
          type: 'error',
          message: 'Failed to load impact data',
          priority: 'high',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const categorize = (text: string): string => {
    if (/team|collaborat/i.test(text)) return 'collaboration';
    if (/lead|mentor/i.test(text)) return 'leadership';
    if (/innov|idea|creative/i.test(text)) return 'innovation';
    if (/deliver|fast|efficient/i.test(text)) return 'productivity';
    return 'general';
  };

  const getIcon = (category: string) => {
    const icons: Record<string, React.ReactElement> = {
      leadership: <FaStar />,
      productivity: <FaChartLine />,
      collaboration: <FaUsers />,
      innovation: <FaLightbulb />,
      general: <FaStar />,
    };
    return icons[category] || <FaStar />;
  };

  return (
    <div className="impact-receipts">
      <h3 className="review-heading">Impact Receipts</h3>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : impactData.length > 0 ? (
        <div className="receipt-grid">
          {impactData.map((item, index) => (
            <div key={index} className="receipt-card">
              <div className="icon">{getIcon(item.category)}</div>
              <div className="content">
                <h4 className="receipt-category">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</h4>
                <div className="score-bar">
                  <div className="bar" style={{ width: `${(item.score / 10) * 100}%` }} />
                  <span className="score">{item.score.toFixed(1)} / 10</span>
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">No impact data found</div>
      )}
    </div>
  );
};

export default ImpactReceipts;
