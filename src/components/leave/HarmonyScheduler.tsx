// src/components/leave/HarmonyScheduler.tsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaExclamationTriangle, FaUserFriends, FaSpinner } from 'react-icons/fa';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { leaveService } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button, Select } from '../ui/Tabs';
import '../../styles/HarmonyScheduler.css';

interface LeaveType {
  id: number;
  name: string;
}

interface CoverageSuggestion {
  id: number;
  name: string;
  position: string;
  matchScore: number;
}

interface HarmonySchedulerProps {
  employeeId: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

const HarmonyScheduler: React.FC<HarmonySchedulerProps> = ({ employeeId }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: 'selection'
  });
  console.log("harmonyID: ", employeeId);

  const [leaveType, setLeaveType] = useState<string>('');
  const [impactScore, setImpactScore] = useState<number>(0);
  const [teamCoverage, setTeamCoverage] = useState<CoverageSuggestion[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState({
    types: true,
    impact: false,
    coverage: false,
    submitting: false
  });

  const { addNotification } = useNotifications();

  useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        const response = await leaveService.getLeaveTypes();
        setLeaveTypes(response.data);
        if (response.data.length > 0) setLeaveType(response.data[0].id);
      } catch {
        addNotification({ type: 'error', message: 'Failed to load leave types', priority: 'medium' });
      } finally {
        setIsLoading(prev => ({ ...prev, types: false }));
      }
    };
    loadLeaveTypes();
  }, [addNotification]);

  const handleDateChange = (ranges: { selection: DateRange }) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ startDate, endDate, key: 'selection' });
    setIsLoading(prev => ({ ...prev, impact: true, coverage: true }));

    const fetchImpactAndCoverage = async () => {
      try {
        const impact = await leaveService.calculateImpact({ employeeId, startDate, endDate });
        console.log("Score: ", impact);
        setImpactScore(impact.data.score);

        const coverage = await leaveService.getCoverageSuggestions({employeeId});
        setTeamCoverage(coverage);
      } catch {
        addNotification({ type: 'error', message: 'Failed to calculate impact', priority: 'high' });
      } finally {
        setIsLoading(prev => ({ ...prev, impact: false, coverage: false }));
      }
    };

    fetchImpactAndCoverage();
  };

  const submitLeaveRequest = async () => {
    setIsLoading(prev => ({ ...prev, submitting: true }));
    try {
      await leaveService.applyForLeave({ employeeId, startDate: dateRange.startDate, endDate: dateRange.endDate, type: leaveType });
      addNotification({ type: 'success', message: 'Leave request submitted!', priority: 'medium' });

      setDateRange({ startDate: new Date(), endDate: addDays(new Date(), 1), key: 'selection' });
      setImpactScore(0);
      setTeamCoverage([]);
    } catch {
      addNotification({ type: 'error', message: 'Submission failed', priority: 'high' });
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const requestCoverage = async (coverEmployeeId: number) => {
    try {
      await leaveService.requestCoverage({
        requesterId: employeeId,
        coverEmployeeId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      addNotification({ type: 'success', message: 'Coverage request sent!', priority: 'medium' });
    } catch {
      addNotification({ type: 'error', message: 'Coverage request failed', priority: 'high' });
    }
  };

  const days = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="harmony-scheduler">
      <header className="scheduler-header">
        <h2><FaCalendarAlt /> Harmony Scheduler</h2>
        {isLoading.impact ? (
          <div className="impact-status"><FaSpinner className="spinner" /> Calculating Impact...</div>
        ) : (
          <div className={`impact-score ${impactScore > 5 ? 'high' : 'low'}`}>
            <FaExclamationTriangle /> Impact: {impactScore}/10
          </div>
        )}
      </header>

      <section className="scheduler-body">
        <div className="calendar-section">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            disabled={isLoading.types || isLoading.submitting}
            minDate={new Date()}
          />
        </div>

        <div className="info-panel">
          <div className="info-card">
            <h4>Duration</h4>
            <p>{days} day{days !== 1 ? 's' : ''}</p>
          </div>
          <div className="info-card">
            <h4>Type</h4>
            {isLoading.types ? (
              <div className="loading"><FaSpinner className="spinner" /> Loading...</div>
            ) : (
              <Select
                options={leaveTypes.map(lt => ({ value: String(lt.id), label: lt.name }))}
                value={leaveType}
                onChange={setLeaveType}
              />
            )}
          </div>
        </div>
      </section>

      <section className="coverage-suggestions">
        {isLoading.coverage ? (
          <div className="loading"><FaSpinner className="spinner" /> Finding team coverage...</div>
        ) : (
          impactScore > 0 && teamCoverage.length > 0 && (
            <>
              <h3><FaUserFriends /> Suggested Team Coverage</h3>
              <div className="coverage-grid">
                {teamCoverage.map(member => (
                  <div key={member.id} className="coverage-card">
                    <div className="avatar">{member.name.charAt(0)}</div>
                    <div className="details">
                      <h4>{member.name}</h4>
                      <p>{member.position}</p>
                      <span className="match-score">Match: {member.matchScore}%</span>
                    </div>
                    <Button variant="outline" onClick={() => requestCoverage(member.id)}>Request</Button>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </section>

      <footer className="scheduler-footer">
        <Button
          variant="primary"
          onClick={submitLeaveRequest}
          disabled={isLoading.submitting || isLoading.types || !leaveType || dateRange.startDate > dateRange.endDate}
        >
          {isLoading.submitting ? <><FaSpinner className="spinner" /> Submitting...</> : 'Submit Leave Request'}
        </Button>
      </footer>
    </div>
  );
};

export default HarmonyScheduler;