// components/employees/EmployeeCard.tsx
import React from 'react';
import { FaUserCircle, FaEnvelope, FaBriefcase } from 'react-icons/fa';
import SkillDNA from './SkillDNA';
import '../../styles/EmployeeCard.css';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  skills: { name: string; level: number }[];
  email: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  return (
    <div className="employee-card-container" onClick={onClick}>
      <div className="employee-card-header">
        <FaUserCircle className="employee-avatar" />
        <div className="employee-details">
          <h3>{employee.name}</h3>
          <p><FaBriefcase /> {employee.position}</p>
          <p><FaEnvelope /> {employee.email}</p>
        </div>
      </div>

      <SkillDNA skills={employee.skills} />

      <div className="employee-card-footer">
        <button className="btn-outline" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
          View Profile
        </button>
        <button className="btn-primary">Send Message</button>
      </div>
    </div>
  );
};
