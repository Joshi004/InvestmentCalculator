import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

// Explicitly register the components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const InvestmentChart = ({ chartData }) => {
  const chartRef = useRef(null);
  let myChart = null;

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy the chart if it already exists to avoid "Canvas is already in use" error
    if (myChart) {
      myChart.destroy();
    }

    // Create the new chart with two Y-axes and tooltips enabled
    myChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true, // Ensures the chart is responsive
        maintainAspectRatio: false, // Allows dynamic aspect ratio on different screens
        aspectRatio: window.innerWidth < 768 ? 1 : 2, // Square aspect ratio on mobile, rectangular on larger screens
        scales: {
          y: {
            id: 'y-axis-1',
            position: 'left', // Y-axis on the left
            ticks: {
              beginAtZero: true,
              fontSize: window.innerWidth < 768 ? 10 : 14, // Adjust font size for mobile
            },
            title: {
              display: true,
              text: 'Remaining Amount',
              fontSize: window.innerWidth < 768 ? 12 : 16, // Smaller title on mobile
            }
          },
          y1: {
            id: 'y-axis-2',
            position: 'right', // Y-axis on the right
            ticks: {
              beginAtZero: true,
              fontSize: window.innerWidth < 768 ? 10 : 14, // Adjust font size for mobile
            },
            grid: {
              drawOnChartArea: false, // Prevent grid lines from this axis
            },
            title: {
              display: true,
              text: 'Withdrawn & Added Amounts',
              fontSize: window.innerWidth < 768 ? 12 : 16, // Smaller title on mobile
            }
          },
          x: {
            ticks: {
              fontSize: window.innerWidth < 768 ? 10 : 14, // Adjust font size for mobile
            },
            title: {
              display: true,
              text: 'Time (Months)',
              fontSize: window.innerWidth < 768 ? 12 : 16, // Smaller title on mobile
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: true, // Enable tooltips on hover
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ₹${tooltipItem.raw.toLocaleString('en-IN')}`;
              }
            },
            bodyFontSize: window.innerWidth < 768 ? 10 : 14, // Smaller tooltip font on mobile
            titleFontSize: window.innerWidth < 768 ? 12 : 16, // Adjust tooltip title font size
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 20,
              usePointStyle: true,
              fontSize: window.innerWidth < 768 ? 10 : 14, // Adjust legend font size for mobile
            }
          }
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [chartData]);

  return <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default InvestmentChart;
