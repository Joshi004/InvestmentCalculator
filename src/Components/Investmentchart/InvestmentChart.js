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
        maintainAspectRatio: false, // Disable maintaining the default aspect ratio
        aspectRatio: 2, // You can adjust this aspect ratio for desktop users
        scales: {
          y: {
            id: 'y-axis-1',
            position: 'left', // Y-axis on the left
            ticks: {
              beginAtZero: true,
            },
            title: {
              display: true,
              text: 'Remaining Amount',
            }
          },
          y1: {
            id: 'y-axis-2',
            position: 'right', // Y-axis on the right
            ticks: {
              beginAtZero: true,
            },
            grid: {
              drawOnChartArea: false, // Prevent grid lines from this axis
            },
            title: {
              display: true,
              text: 'Withdrawn & Added Amounts',
            }
          },
        },
        plugins: {
          tooltip: {
            enabled: true, // Enable tooltips on hover
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.dataset.label}: ₹${tooltipItem.raw.toLocaleString('en-IN')}`;
              }
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 20,
              usePointStyle: true,
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

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}> {/* Set container height and width */}
      <canvas ref={chartRef} />
    </div>
  );
};

export default InvestmentChart;
