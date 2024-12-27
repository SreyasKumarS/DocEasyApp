import React, { useState } from 'react';
import api from '../../axios'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 
import { useNavigate } from 'react-router-dom';

const DailyRecurringSlots = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);
  const [breakStart, setBreakStart] = useState<string | null>(null);
  const [breakEnd, setBreakEnd] = useState<string | null>(null);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const navigate = useNavigate();

  const handleExcludedDatesChange = (date: Date | null) => {
    if (date) {
      setExcludedDates((prevDates) => [...prevDates, date]);
    }
  };

  const handleRemoveExcludedDate = (index: number) => {
    setExcludedDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slotData = {
      doctorId:doctorId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      startTime,
      endTime,
      duration,
      breakStart,
      breakEnd,
      excludedDates: excludedDates.map((date) => date.toISOString().split('T')[0]),
    };
    

    try {
      const response = await api.post('/doctor/DailyRecurringSlots', slotData);
      navigate('/doctor/DoctorSlotsDisplay');
    } catch (error) {
      console.error('Error creating slots:', error);
      alert('Failed to create slots');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">Create Recurring Slots</h2>

      <div className="form-group mb-3">
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => date && setStartDate(date)}
          minDate={new Date()} // Disable past dates
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => date && setEndDate(date)}
          minDate={new Date()} // Disable past dates
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>End Time:</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>Slot Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
          required
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>Break Start Time:</label>
        <input
          type="time"
          value={breakStart || ''}
          onChange={(e) => setBreakStart(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>Break End Time:</label>
        <input
          type="time"
          value={breakEnd || ''}
          onChange={(e) => setBreakEnd(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group mb-3">
        <label>Excluded Dates:</label>
        <DatePicker
          selected={null}
          onChange={handleExcludedDatesChange}
          minDate={new Date()} // Disable past dates
          placeholderText="Click to add date"
          className="form-control mb-2"
        />
        <div className="mt-2">
          {excludedDates.map((date, index) => (
            <span key={index} className="badge bg-secondary me-1">
              {date.toDateString()}{' '}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-1"
                aria-label="Remove"
                onClick={() => handleRemoveExcludedDate(index)}
              ></button>
            </span>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">Create Slots</button>
    </form>
  );
};

export default DailyRecurringSlots;

