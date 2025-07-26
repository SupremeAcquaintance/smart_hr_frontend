// components/employees/SkillDNA.tsx
import React from 'react';
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
import '../../styles/EmployeeCard.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Skill {
  name: string;
  level: number;
}

interface SkillDNAProps {
  skills: Skill[];
}

const SkillDNA: React.FC<SkillDNAProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return <div className="skill-dna">No skill data available</div>;
  }

  const data = {
    labels: skills.map(skill => skill.name),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map(skill => skill.level),
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
      }
    ]
  };

  const options = {
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
          color: 'rgba(200, 200, 200, 0.1)'
        },
        angleLines: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        pointLabels: {
          color: 'var(--text-color)',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="skill-dna">
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillDNA;
