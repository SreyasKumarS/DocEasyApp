import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../axios'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {ReportDataScreen} from '../../../interfaces/adminInterfaces'


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

const ReportsPage = () => {
  const [reportData, setReportData] = useState<ReportDataScreen | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState<string | null>(null);

  const fetchReport = async (rangeType: 'custom' | 'monthly' | 'weekly' | 'yearly') => {
    try {
      let customStart = startDate?.toISOString() || null;
      let customEnd = endDate?.toISOString() || null;

      if (rangeType !== 'custom') {
        const predefined = getPredefinedDates(rangeType);
        customStart = predefined.startDate;
        customEnd = predefined.endDate;
      }

      const response = await api.post(
        '/admin/getReport',
        { rangeType, startDate: customStart, endDate: customEnd },
        { withCredentials: true }
      );

      setReportType(rangeType.charAt(0).toUpperCase() + rangeType.slice(1));
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const getPredefinedDates = (type: 'monthly' | 'weekly' | 'yearly') => {
    const today = new Date();
    let start: Date;
    if (type === 'monthly') {
      start = new Date();
      start.setMonth(start.getMonth() - 1);
    } else if (type === 'weekly') {
      start = new Date();
      start.setDate(start.getDate() - 7);
    } else {
      start = new Date();
      start.setFullYear(start.getFullYear() - 1);
    }
    return { startDate: start.toISOString(), endDate: today.toISOString() };
  };

  const generatePDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`${reportType} Revenue Report`, 14, 20);

    // Add report summary
    doc.setFontSize(12);
    doc.text(`Start Date: ${formatDate(reportData.startDate)}`, 14, 30);
    doc.text(`End Date: ${formatDate(reportData.endDate)}`, 14, 40);
    doc.text(`Total Slots Booked: ${reportData.totalSlots}`, 14, 50);
    doc.text(`Total Profits Generated: ₹${reportData.totalRevenue}`, 14, 60);

    // Add doctor revenue details if available
    if (reportData.doctorRevenue) {
      const headers = [
        ['#', 'Doctor Name', 'Email', 'Contact', 'Specialization', 'Total Revenue'],
      ];

      const data = reportData.doctorRevenue.map((doctor, index) => [
        index + 1,
        doctor.doctorName,
        doctor.email,
        doctor.contact,
        doctor.specialization,
        `₹${doctor.totalRevenue}`,
      ]);

      doc.autoTable({
        startY: 70,
        head: headers,
        body: data,
      });
    }

    // Save the PDF
    doc.save(`${reportType}_Revenue_Report.pdf`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Revenue Report</h1>
      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-outline-primary mx-2" onClick={() => fetchReport('monthly')}>
          Monthly Report
        </button>
        <button className="btn btn-outline-primary mx-2" onClick={() => fetchReport('weekly')}>
          Weekly Report
        </button>
        <button className="btn btn-outline-primary mx-2" onClick={() => fetchReport('yearly')}>
          Yearly Report
        </button>
      </div>
      <div className="card shadow mb-4 p-3">
        <h5 className="card-title text-center text-dark">Generate Custom Report</h5>
        <div className="d-flex justify-content-between align-items-center">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="form-control"
            maxDate={new Date()}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="form-control mx-3"
            maxDate={new Date()}
          />
          <button className="btn btn-outline-success" onClick={() => fetchReport('custom')}>
            Generate
          </button>
        </div>
      </div>
      {reportData && (
        <div className="card shadow-lg p-4 mt-4">
          <h3 className="text-center text-secondary">{reportType} Report</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Start Date:</strong> {formatDate(reportData.startDate)}
            </li>
            <li className="list-group-item">
              <strong>End Date:</strong> {formatDate(reportData.endDate)}
            </li>
            <li className="list-group-item">
              <strong>Total Slots Booked:</strong> {reportData.totalSlots}
            </li>
            <li className="list-group-item">
              <strong>Total Profits Generated:</strong> ₹{reportData.totalRevenue}
            </li>
          </ul>
          {reportData.doctorRevenue && (
            <div className="mt-4">
              <h4>Doctor Revenue Details:</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Doctor Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Specialization</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.doctorRevenue.map((doctor, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{doctor.doctorName}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.contact}</td>
                      <td>{doctor.specialization}</td>
                      <td>₹{doctor.totalRevenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button className="btn btn-primary mt-4" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
