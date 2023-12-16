import React, { useContext, useState } from "react";

import dynamic from "next/dynamic";
import Context from "@/components/contexts/context";
// import IconComponents from "../snippets/iconComponents";
import { ApexOptions } from "apexcharts"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


interface ChartData {
  options: ApexOptions;
  options1: ApexOptions;
  options2: ApexOptions;
  series: number[];
  series1: number[];
  series2: number[];
}


const RadialChart = () => {
  const { mode } = useContext(Context);

  const [chartData, setChartData] = useState<ChartData>({
    // options: {
    //   chart: {
    //     height: 74,
    //     type: "radialBar",
    //   },


    //   colors: ["#FFB74D"],
    //   plotOptions: {
    //     radialBar: {
    //       hollow: {
    //         margin: 0,
    //         size: "70%",
    //         background: "transparent",
    //       },
    //       track: {
    //         strokeWidth: '10%',
    //         background: "#fedfb3",
    //         dropShadow: {
    //           enabled: true,
    //           top: 2,
    //           left: 0,
    //           blur: 4,
    //           opacity: 0.15,
    //         },
    //       },
    //       dataLabels: {
    //         name: {
    //           offsetY: -10,
    //           color: "#fff",
    //           show: false,
    //         },
    //         value: {
    //           colors: mode === 'dark' ? '#fff' : '#000',
    //           fontSize: "14px",
    //           show: true,
    //         },
    //       },
    //     },
    //     labels: {
    //       show: true,
    //     }
    //   },
    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shade: "dark",
    //       type: "vertical",
    //       gradientToColors: ["#FFB74D"],
    //       stops: [0, 100],
    //     },
    //   },
    //   stroke: {
    //     lineCap: "round",
    //   },
    //   labels: ["USD"],
    //   legend: {
    //     show: true,

    //   }

    // },

    options:  {
      chart: {
        type: "radialBar",
      },


      colors: ["#FCC419"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "transparent",
          },
          track: {
            strokeWidth: '10%',
            background: "#FCC4194d",
            dropShadow: {
              enabled: true,
              top: 6,
              left: 2,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              show: false,
            },
            value: {
              // colors: mode === 'dark' ? '#ffffffb3' : '#fff',
              fontSize: "14px",
              show: true,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#FCC419"],
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",

      },
      labels: ["INR"],
    },


    options1: {
      chart: {
        height: 74,
        type: "radialBar",
      },


      colors: ["#90CAF9"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "transparent",
          },
          track: {
            strokeWidth: '10%',
            background: "#90caf94d",
            dropShadow: {
              enabled: true,
              top: 6,
              left: 2,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              show: false,
            },
            value: {
              // colors: mode === 'dark' ? '#ffffffb3' : '#fff',
              fontSize: "14px",
              show: true,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#90CAF9"],
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",

      },
      labels: ["INR"],
    },

    options2: {
      chart: {
        height: 74,
        type: "radialBar",
        // color: '#000'
      },
      // background: "red",
      colors: ["#81C784"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "transparent",
          },
          track: {
            strokeWidth: '10%',
            background: '#66bb6a4d',
            dropShadow: {
              enabled: true,
              top: 6,
              left: 2,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              show: false,
            },
            value: {
              // colors: mode === 'dark' ? '#ffffffb3' : '#fff',
              fontSize: "14px",
              show: true,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#81C784"],
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["EUR"],
    },
    series: [67],
    series1: [35],
    series2: [25],
    // responsive: [
    //   {
    //     breakpoint: 1360,
    //     options: {
    //       chart: {
    //         // width: '100%',
    //         height:'130'
    //       },
          
    //     },
    //   },
    //   {
    //     breakpoint: 1500,
    //     options: {
    //       chart: {
    //         width: '150',
    //         height:"150"
    //       },
          
    //     },
    //   },
    // ],
  });

  return (
    <div className="w-full bg-white dark:bg-[#121212] p-6 pb-0 xl:pb-6 rounded-[10px] radial">
      <div className="flex justify-between items-center  px-4">
        <h2 className="text-[20px] font-medium leading-8 tracking-[0.15px] dark:text-white text-[#212121]">
          Fiat Suported
        </h2>
      </div>
      <div className="flex gap-[15px] my-[14px] items-center">
        {/* <div className="max-w-[33%] w-full">
          <Chart
            series={chartData.series}
            options={chartData.options}
            type="radialBar"
            height="150"
          />
        </div> */}
        <div className="max-w-[33%] w-full text-center ">
          <Chart
            series={chartData.series}
            options={chartData.options}
            type="radialBar"
            height="150"
          />
          <div className="flex gap-2 items-center justify-center py-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-[#FCC419]"></span> <span className="dark:text-white">USD</span>
          </div>
        </div>
        <div className="max-w-[33%] w-full">
          <Chart
            series={chartData.series1}
            options={chartData.options1}
            type="radialBar"
            height="150"
          />
          <div className="flex gap-2 items-center justify-center py-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-[#90CAF9]"></span> <span className="dark:text-white">INR</span>
          </div>
        </div>

        <div className="max-w-[33%] w-full">
          <Chart
            series={chartData.series2}
            options={chartData.options2}
            type="radialBar"
             height="150"
          />
          <div className="flex gap-2 items-center justify-center py-2">
            <span className="inline-block w-2 h-2 rounded-sm bg-[#81C784]"></span> <span className="dark:text-white">EUR</span>
          </div>
        </div>
      </div>
      <p className="text-[#80808F] text-sm font-normal font-public-sans tracking-[0.4px]">Users to use the fiat currency to trand in allover the crypto exchange</p>
    </div>
  );
};

export default RadialChart;
