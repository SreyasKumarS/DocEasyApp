// import React, { useState, useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { RRule, RRuleSet } from 'rrule';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; 


// interface SpecificDate {
//   date: Date;
//   startTime: string;
//   endTime: string;
//   breakStart: string;
//   breakEnd: string;
// }

// interface WeeklyDay {
//   day: string;
//   startTime: string;
//   endTime: string;
//   breakStart: string;
//   breakEnd: string;
// }

// interface TimeConfig {
//   startDate?: Date | null;
//   endDate?: Date | null;
//   startTime: string;
//   endTime: string;
//   breakStart: string;
//   breakEnd: string;
// }

// const MonthlySlot: React.FC = () => {
//   const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
//   const navigate = useNavigate(); // Hook for navigation


//   const [monthlyDefaultTime, setMonthlyDefaultTime] = useState<TimeConfig>({
//     startDate: null,
//     endDate: null,
//     startTime: '',
//     endTime: '',
//     breakStart: '',
//     breakEnd: '',
//   });
//   const [specificDates, setSpecificDates] = useState<SpecificDate[]>([]);
//   const [weeklyDays, setWeeklyDays] = useState<WeeklyDay[]>([]);
//   const [excludedDates, setExcludedDates] = useState<Date[]>([]);
//   const [generatedSlots, setGeneratedSlots] = useState<Date[]>([]);


//   const handleSpecificDateChange = (index: number, field: keyof SpecificDate, value: any) => {
//     const updatedDates = [...specificDates];
//     updatedDates[index][field] = value;
//     setSpecificDates(updatedDates);
//   };

//   const addSpecificDate = () => {
//     setSpecificDates([
//       ...specificDates,
//       { date: new Date(), startTime: '', endTime: '', breakStart: '', breakEnd: '' },
//     ]);
//   };

//   const handleWeeklyDayChange = (index: number, field: keyof WeeklyDay, value: any) => {
//     const updatedDays = [...weeklyDays];
//     updatedDays[index][field] = value;
//     setWeeklyDays(updatedDays);
//   };

//   const addWeeklyDay = () => {
//     setWeeklyDays([
//       ...weeklyDays,
//       { day: 'Monday', startTime: '', endTime: '', breakStart: '', breakEnd: '' },
//     ]);
//   };

//   const handleExcludedDatesChange = useCallback((date: Date | null) => {
//     if (date) {
//       setExcludedDates((prevDates) => [...prevDates, date]);
//     }
//   }, []);

//   const generateRecurrenceRule = async () => {
//     const ruleSet = new RRuleSet();
//     ruleSet.rrule(
//       new RRule({
//         freq: RRule.MONTHLY,
//         interval: 1,
//         dtstart: monthlyDefaultTime.startDate || new Date(),
//         until: monthlyDefaultTime.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
//       })
//     );
  
//     // Add excluded dates to the rule set
//     excludedDates.forEach((date) => ruleSet.exdate(date));
  
//     // Generate slots based on default, specific dates, and weekly days
//     const slots = ruleSet.all().flatMap((date) => {
//       const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
  
//       const specificDate = specificDates.find(
//         (specDate) => specDate.date.toDateString() === date.toDateString()
//       );
//       if (specificDate) {
//         return generateTimeSlotsForDay(date, specificDate);
//       }
  
//       const weeklyDay = weeklyDays.find((day) => day.day === dayOfWeek);
//       if (weeklyDay) {
//         return generateTimeSlotsForDay(date, weeklyDay);
//       }
  
//       return generateTimeSlotsForDay(date, monthlyDefaultTime);
//     });
  
//     // Prepare the data to be sent to the backend
//     const slotData = {
//       doctorId: doctorId,
//       defaultMonthlyTime: {
//         startDate: monthlyDefaultTime.startDate,
//         endDate: monthlyDefaultTime.endDate,
//         startTime: monthlyDefaultTime.startTime,
//         endTime: monthlyDefaultTime.endTime,
//         breakStart: monthlyDefaultTime.breakStart,
//         breakEnd: monthlyDefaultTime.breakEnd,
//       },
//       specificDates: specificDates.map((specDate) => ({
//         date: specDate.date,
//         startTime: specDate.startTime,
//         endTime: specDate.endTime,
//         breakStart: specDate.breakStart,
//         breakEnd: specDate.breakEnd,
//       })),
//       weeklyDays: weeklyDays.map((weeklyDay) => ({
//         day: weeklyDay.day,
//         startTime: weeklyDay.startTime,
//         endTime: weeklyDay.endTime,
//         breakStart: weeklyDay.breakStart,
//         breakEnd: weeklyDay.breakEnd,
//       })),
//       excludedDates: excludedDates.map((date) => date.toISOString().split('T')[0]),
//       generatedSlots: slots.map((slot) => slot.toISOString()),
//     };
//   (slotData,'slotttt dtaaaaaa');
//   (doctorId,'didddddd');
  
//   try {
//     // Send data to backend API
//     const response = await axios.post(
//       `http://localhost:5000/api/doctor/createDoctorMonthlySlots/${doctorId}`,
//       slotData
//     );
  
//     if (response.status === 200) {
//       ('Slots successfully generated:', response.data.slots);
//       navigate('/doctor/DoctorSlotsDisplay');
//     } else {
//       console.error('Error generating slots. Status:', response.status);
//     }
//   } catch (error) {
//     console.error('Failed to connect to the backend:', error);
//   }  
//   };

//   const generateTimeSlotsForDay = (date: Date, timeConfig: SpecificDate | WeeklyDay | TimeConfig) => {
//     const slots: Date[] = [];
//     const start = new Date(date);
//     const end = new Date(date);

//     const [startHour, startMinute] = timeConfig.startTime.split(':').map((str) => parseInt(str, 10));
//     const [endHour, endMinute] = timeConfig.endTime.split(':').map((str) => parseInt(str, 10));

//     start.setHours(startHour, startMinute, 0, 0);
//     end.setHours(endHour, endMinute, 0, 0);

//     while (start < end) {
//       slots.push(new Date(start));
//       start.setMinutes(start.getMinutes() + 30);
//     }

//     return slots;
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Doctor's Scheduler</h1>

//       <h3>Default Monthly Timing</h3>
//       <label>Start Date:</label>
//       <DatePicker
//         selected={monthlyDefaultTime.startDate}
//         onChange={(date) => setMonthlyDefaultTime({ ...monthlyDefaultTime, startDate: date })}
//         placeholderText="Select start date"
//       />
//       <label>End Date:</label>
//       <DatePicker
//         selected={monthlyDefaultTime.endDate}
//         onChange={(date) => setMonthlyDefaultTime({ ...monthlyDefaultTime, endDate: date })}
//         placeholderText="Select end date"
//       />
//       <label>Start Time:</label>
//       <input
//         type="time"
//         value={monthlyDefaultTime.startTime}
//         onChange={(e) => setMonthlyDefaultTime({ ...monthlyDefaultTime, startTime: e.target.value })}
//       />
//       <label>End Time:</label>
//       <input
//         type="time"
//         value={monthlyDefaultTime.endTime}
//         onChange={(e) => setMonthlyDefaultTime({ ...monthlyDefaultTime, endTime: e.target.value })}
//       />
//       <label>Break Start:</label>
//       <input
//         type="time"
//         value={monthlyDefaultTime.breakStart}
//         onChange={(e) => setMonthlyDefaultTime({ ...monthlyDefaultTime, breakStart: e.target.value })}
//       />
//       <label>Break End:</label>
//       <input
//         type="time"
//         value={monthlyDefaultTime.breakEnd}
//         onChange={(e) => setMonthlyDefaultTime({ ...monthlyDefaultTime, breakEnd: e.target.value })}
//       />

//       <h3>Specific Dates with Custom Timings</h3>
//       {specificDates.map((specDate, index) => (
//         <div key={index}>
//           <label>Date:</label>
//           <DatePicker
//             selected={specDate.date}
//             onChange={(date) => handleSpecificDateChange(index, 'date', date)}
//           />
//           <label>Start Time:</label>
//           <input
//             type="time"
//             value={specDate.startTime}
//             onChange={(e) => handleSpecificDateChange(index, 'startTime', e.target.value)}
//           />
//           <label>End Time:</label>
//           <input
//             type="time"
//             value={specDate.endTime}
//             onChange={(e) => handleSpecificDateChange(index, 'endTime', e.target.value)}
//           />
//           <label>Break Start:</label>
//           <input
//             type="time"
//             value={specDate.breakStart}
//             onChange={(e) => handleSpecificDateChange(index, 'breakStart', e.target.value)}
//           />
//           <label>Break End:</label>
//           <input
//             type="time"
//             value={specDate.breakEnd}
//             onChange={(e) => handleSpecificDateChange(index, 'breakEnd', e.target.value)}
//           />
//         </div>
//       ))}
//       <button onClick={addSpecificDate}>Add Specific Date</button>

//       <h3>Recurring Weekly Slots within the Month</h3>
//       {weeklyDays.map((weeklyDay, index) => (
//         <div key={index}>
//           <label>Day:</label>
//           <select
//             value={weeklyDay.day}
//             onChange={(e) => handleWeeklyDayChange(index, 'day', e.target.value)}
//           >
//             {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
//               (day) => (
//                 <option key={day} value={day}>
//                   {day}
//                 </option>
//               )
//             )}
//           </select>
//           <label>Start Time:</label>
//           <input
//             type="time"
//             value={weeklyDay.startTime}
//             onChange={(e) => handleWeeklyDayChange(index, 'startTime', e.target.value)}
//           />
//           <label>End Time:</label>
//           <input
//             type="time"
//             value={weeklyDay.endTime}
//             onChange={(e) => handleWeeklyDayChange(index, 'endTime', e.target.value)}
//           />
//           <label>Break Start:</label>
//           <input
//             type="time"
//             value={weeklyDay.breakStart}
//             onChange={(e) => handleWeeklyDayChange(index, 'breakStart', e.target.value)}
//           />
//           <label>Break End:</label>
//           <input
//             type="time"
//             value={weeklyDay.breakEnd}
//             onChange={(e) => handleWeeklyDayChange(index, 'breakEnd', e.target.value)}
//           />
//         </div>
//       ))}
//       <button onClick={addWeeklyDay}>Add Weekly Day</button>

//       <h3>Excluded Dates</h3>
//       <DatePicker
//         selected={null}
//         onChange={handleExcludedDatesChange}
//         placeholderText="Select date to exclude"
//       />
//       <ul>
//         {excludedDates.map((date, index) => (
//           <li key={index}>{date.toDateString()}</li>
//         ))}
//       </ul>

//       <button onClick={generateRecurrenceRule}>Generate Slots</button>

//       <h3>Generated Slots</h3>
//       <ul>
//         {generatedSlots.map((slot, index) => (
//           <li key={index}>{slot.toString()}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };


// export default MonthlySlot;




