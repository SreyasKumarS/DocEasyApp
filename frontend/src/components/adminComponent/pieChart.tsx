import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import api from '../../axios'

const RevenuePieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Revenue by Specialization',
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  });

  const fetchRevenueData = async () => {
    try {
      const response = await api.get('/admin/getSpecializationsPieChart', { withCredentials: true });
      const { labels, data } = response.data;

      setChartData((prev) => ({
        ...prev,
        labels,
        datasets: [
          {
            ...prev.datasets[0],
            data,
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  return (
    <div style={{ width: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h3 className="text-primary mb-4"></h3>
      <Pie data={chartData} />
    </div>
  );
};

export default RevenuePieChart;
