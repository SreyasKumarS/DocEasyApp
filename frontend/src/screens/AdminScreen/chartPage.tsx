import React from 'react';
import RevenuePieChart from '../../components/adminComponent/pieChart'; 
import DoctorsRevenueBarChart from '../../components/adminComponent/BarChartForDoctorRevenue';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChartPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center text-success mb-4">Chart Page</h1>

      <div className="row mb-5">
        <div className="col-md-6">
          <h3 className="text-center text-primary">Revenue by Specialization</h3>
          <RevenuePieChart />
        </div>

        <div className="col-md-6">
          <h3 className="text-center text-primary">Doctors Revenue Bar Chart</h3>
          <DoctorsRevenueBarChart />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3 className="text-center text-primary">Additional Chart</h3>
          {/* Placeholder for additional charts */}
          <div className="d-flex justify-content-center align-items-center border p-5">
            <p className="text-muted">Add another chart here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
