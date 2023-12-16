import React, { useContext, useState } from "react";

import dynamic from 'next/dynamic'
import Context from "@/components/contexts/context";
// import IconComponents from "../snippets/iconComponents";
import { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartData {
  theme:Object;
  options: ApexOptions;
  series: ApexAxisChartSeries | any[]; // Use any[] if you don't want to be strict about the series format
}
const LineChart = () => {
    const {mode} = useContext(Context)

    console.log(mode,"==mode");
    

  const [chartData, setChartData] = useState<ChartData>({
    theme: {
      mode: mode, 
      monochrome: {
          enabled: false,
          color: '#8e8e8e',
          shadeTo: mode,
          shadeIntensity: 0.65
      },
  },
    options: {
      chart: {
        id: "basic-bar",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          color: '#8e8e8e',
          top: 10,
          left: 7,
          blur: 10,
          opacity: 0.1,
        },
      },

      stroke: {
        show: true,
        width: 0.5, // This controls the stroke line thickness
        curve: 'smooth' // This controls the curvature of the line (if applicable)
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
            style: {
              fontSize: '12px',
              fontWeight:400,
              colors: '#8e8e8e', // Dynamic color based on mode
            },
          },
      },
      yaxis: {
        min: 100,
        max: 600,
        tickAmount: 5,
        labels: {
          formatter: (value:number) => { return value + "k" },
          style: {
            fontSize: '12px',
            fontWeight:400,
            colors: '#8e8e8e' , // Dynamic color based on mode
          },
        },
      },
      legend: {
        show: true,
        labels: {
          
              colors:'#8e8e8e', // Dynamic color based on mode
          
          },
        
      },
      colors: ["#F44336", "#90CAF9"],
    },
    series: [
      {
        data: [100, 200, 250, 250, 449, 200, 500, 501, 487, 467, 667, 700]
      },
      {
        data: [300, 500, 150, 359, 532, 99, 289, 224, 267, 267, 300, 300]
      }
    ],
  });

  

  return (

    <div className="w-full bg-white dark:bg-grey-v-4 p-6 pb-0 xl:pb-6 rounded-[10px] line_chart">
      <div className="flex justify-between items-center  px-4">
        <h2 className="text-[20px] font-medium leading-8 tracking-[0.15px] dark:text-white text-[#212121]">Revenue Statistics</h2>
        <div className="flex gap-[30px] items-center">
          <p className="text-[14px] font-normal leading-5 tracking-[0.17px] dark:text-[#ffffffb3] text-[#B5B5C3] ml-[7px]">Net Profit  <span className="text-[#464E5F] dark:text-white">70M USD</span></p>
          <p className="flex gap-4 items-center">
            <span className="w-2 h-2 rounded-full bg-[#F44336] block"></span>
            <span className="text-[14px] font-normal leading-5 tracking-[0.17px] dark:text-white text-[#212121]">Expense</span>
          </p>
          <p className="flex gap-4 items-center">
            <span className="w-2 h-2 rounded-full bg-[#90CAF9] block"></span>
            <span className="text-[14px] font-normal leading-5 tracking-[0.17px] dark:text-white text-[#212121]">Revenue</span>
          </p>
          {/* <button className="btn-icon !bg-black flex items-center gap-3 hover:!bg-[#6D6D6D] ">
            Today
            <IconComponents type="downArrowWhite" />
          </button> */}
        </div>
      </div>

      <Chart
        series={chartData.series}
        options={chartData.options}
        type="line"
        height="405"
        stroke-width="1"


      />
    </div>

  );
};

export default LineChart;