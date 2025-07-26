// src/pages/EmployeesPage.tsx
import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import { EmployeeCard } from '../components/employees/EmployeeCard';
import SkillDNA from '../components/employees/SkillDNA';
import TimeCapsule from '../components/employees/TimeCapsule';
import { BridgeBuilder } from '../components/employees/BridgeBuilder';
import { Tabs, Tab, Input, Button } from '../components/ui/Tabs';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import '../styles/EmployeesPage.css';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  skills: { name: string; level: number }[];
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredEmployees(employees);
    } else {
      const results = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(results);
    }
  }, [searchTerm, employees]);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setActiveTab('profile');
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <h1 className="review-heading">Smart Directory</h1>
        <div className="search-bar">
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
          <Button variant="primary" className="add-button">
            <FaUserPlus /> Add Employee
          </Button>
        </div>
      </div>

      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <Tab id="directory" label="Directory">
          <div className="employee-grid">
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onClick={() => handleEmployeeSelect(employee)}
              />
            ))}
          </div>
        </Tab>

        <Tab id="profile" label="Profile" disabled={!selectedEmployee}>
          {selectedEmployee && (
            <div className="employee-profile">
              <div className="profile-header">
                <div className="avatar">
                  {selectedEmployee?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h2>{selectedEmployee.name}</h2>
                  <p>{selectedEmployee.position} • {selectedEmployee.department}</p>
                  <p>{selectedEmployee.email}</p>
                </div>
              </div>

              <div className="profile-sections">
                <div className="section">
                  <h3>Skill DNA</h3>
                  <SkillDNA skills={selectedEmployee.skills} />
                </div>

                <div className="section">
                  <h3>Time Capsule</h3>
                  <TimeCapsule employeeId={selectedEmployee.id} />
                </div>
              </div>
            </div>
          )}
        </Tab>

        <Tab id="connections" label="Connections">
          <BridgeBuilder />
        </Tab>
      </Tabs>
    </div>
  );
};

export default EmployeesPage;