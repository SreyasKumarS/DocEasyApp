import React, { useState } from 'react';
import api from '../../axios'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';

const WeeklyRecurringSlots = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [daysConfig, setDaysConfig] = useState(
    Array(7).fill(null).map(() => ({
      selected: false,
      startTime: '',
      endTime: '',
      breakStart: '',
      breakEnd: '',
      slotDuration: '', // New field for slot duration
    }))
  );

  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const navigate = useNavigate();

  const handleDaySelection = (index: number) => {
    setDaysConfig((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, selected: !day.selected } : { ...day }
      )
    );
  };

  const handleTimeChange = (
    index: number,
    field: 'startTime' | 'endTime' | 'breakStart' | 'breakEnd' | 'slotDuration', // Include slotDuration here
    value: string
  ) => {
    setDaysConfig((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, [field]: value } : { ...day }
      )
    );
  };

  const addExcludedDate = (date: Date) => {
    setExcludedDates((prev) => [...prev, date]);
  };

  const removeExcludedDate = (index: number) => {
    setExcludedDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Filter and map selected days with full config
    const selectedDays = daysConfig
      .map((config, index) =>
        config.selected
          ? {
              day: index, // 0 for Sunday, 1 for Monday, etc.
              startTime: config.startTime,
              endTime: config.endTime,
              breakStart: config.breakStart,
              breakEnd: config.breakEnd,
              slotDuration: Number(config.slotDuration), // Parse slotDuration as a number
            }
          : null
      )
      .filter(Boolean); // Remove null entries
  
    const slotData = {
      doctorId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      daysConfig: selectedDays, // Send all fields for selected days
      excludedDates: excludedDates.map((date) => date.toISOString().split('T')[0]),
    };
  
    try {
      const response = await api.post(
        '/doctor/createWeeklyRecurringSlots',
        slotData
      );
      navigate('/doctor/DoctorSlotsDisplay');
    } catch (error) {
      console.error('Error creating slots:', error);
      alert('Failed to create slots');
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="text-center mb-4">Create Weekly Recurring Slots</h2>

      {/* Start and End Dates */}
      <div className="form-group mb-3">
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => date && setStartDate(date)}
          minDate={new Date()}
          className="form-control"
        />
      </div>
      <div className="form-group mb-3">
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => date && setEndDate(date)}
          minDate={startDate}
          className="form-control"
        />
      </div>

      {/* Excluded Dates */}
      <div className="form-group mb-3">
        <label>Excluded Dates:</label>
        <div className="d-flex align-items-center">
          <DatePicker
            selected={null}
            onChange={(date) => date && addExcludedDate(date)}
            minDate={new Date()}
            className="form-control me-2"
            placeholderText="Select date to exclude"
          />
        </div>
        <ul className="mt-2 list-unstyled">
          {excludedDates.map((date, index) => (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              {date.toDateString()}
              <button
                type="button"
                className="btn btn-sm btn-danger ms-2"
                onClick={() => removeExcludedDate(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Days Configuration */}
      <div className="form-group mb-3">
        <label>Configure Days:</label>
        <div className="d-flex flex-wrap">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
            (day, index) => (
              <div key={index} className="d-flex flex-column align-items-start mb-3 w-100">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={daysConfig[index].selected}
                    onChange={() => handleDaySelection(index)}
                  />
                  <label className="form-check-label ms-2">{day}</label>
                </div>
                {daysConfig[index].selected && (
                  <div className="d-flex flex-wrap mt-2">
                    <div className="form-group me-2">
                      <label>Start Time:</label>
                      <input
                        type="time"
                        value={daysConfig[index].startTime}
                        onChange={(e) =>
                          handleTimeChange(index, 'startTime', e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="form-group me-2">
                      <label>End Time:</label>
                      <input
                        type="time"
                        value={daysConfig[index].endTime}
                        onChange={(e) =>
                          handleTimeChange(index, 'endTime', e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="form-group me-2">
                      <label>Break Start:</label>
                      <input
                        type="time"
                        value={daysConfig[index].breakStart}
                        onChange={(e) =>
                          handleTimeChange(index, 'breakStart', e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Break End:</label>
                      <input
                        type="time"
                        value={daysConfig[index].breakEnd}
                        onChange={(e) =>
                          handleTimeChange(index, 'breakEnd', e.target.value)
                        }
                        className="form-control"
                      />
                    </div>

                    {/* Slot Duration */}
                    <div className="form-group">
                      <label>Slot Duration (minutes):</label>
                      <input
                        type="number"
                        value={daysConfig[index].slotDuration}
                        onChange={(e) =>
                          handleTimeChange(index, 'slotDuration', e.target.value)
                        }
                        className="form-control"
                        placeholder="Enter duration in minutes"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Create Slots
      </button>
    </form>
  );
};

export default WeeklyRecurringSlots;
