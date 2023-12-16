import React, { useContext } from 'react';
import ReactApexChart from 'react-apexcharts';

import dynamic from 'next/dynamic'
import Context from '@/components/contexts/context';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


const RoundedDoughnutChart = () => {
  const { mode } = useContext(Context)

  const chartOptions:ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      height: 'fit-content',
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '70%',
          background: 'transparent',
          labels: {
            show: false,
            name: {
              show: false,
              fontSize: '22px',
            },
            value: {
              show: true,
              fontSize: '22px',
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: '#373d3f',
              formatter: function (w:any) {
                return w.globals.seriesTotals.reduce((a:any, b:any) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    colors: ['#42A5F5', '#4AB58E', '#5F5CF1', '#FCC419', '#723F65'],

    series: [28, 20, 19, 11, 20],
    labels: ['India', 'United States', 'Germany', 'Bolivia', 'Australia'],
    dataLabels: {
      enabled: false, // Disable data labels by default
    },
    legend: {
      labels: {
        // fontSize: 14,
        colors: mode === 'dark' ? '#fff' : '#B5B5C3',
      },
      markers: {
        width: 12,
        height: 12,
        radius: 4,
      },
      formatter: function (seriesName:string, opts:any) {
        // Customize legend text and add values
        return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}%`;
      },
       
      // formatter: function (val:any, opts:any) {
      //     // Customize data labels (values inside the chart)
      //     return `${val}%`;
      //   },
     
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };



  return (
    <div className="w-full bg-white dark:bg-[#121212] p-6 pb-0 xl:pb-6 rounded-[10px] dounut_chart">
      <div className="flex justify-between items-center  px-4">
        <h2 className="text-[20px] font-medium leading-8 tracking-[0.15px] dark:text-white text-[#212121]">Vistor Distribution</h2>
      </div>
      <div className='py-[15px]'>

        <Chart
          options={chartOptions}
          series={chartOptions.series}
          type="donut"
          height='200'
        />
      </div>
      <p className='text-[12px] font-normal leading-5 tracking-[0.4px] dark:text-[#ffffffb3] text-[#B5B5C3]'>Traders percentage from the worldwide</p>
    </div>

  );
};

export default RoundedDoughnutChart;
