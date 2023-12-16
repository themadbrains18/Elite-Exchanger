import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import Context from '@/components/contexts/context';
import ReactApexChart from 'react-apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RevenueDougnut = () => {
    const { mode } = useContext(Context);

    const chartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'donut',
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
                        },
                    },
                },
            },
        },
        colors: ['#3699FF', '#4AB58E', '#FFA800'],
        series: [10.5, 17.5, 42],
        labels: ['Trading Commission', 'Gas Fee', 'Token Listing'],
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: 'bottom',
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
            labels: {
                // fontSize: 16,
                colors: mode === 'dark' ? '#fff' : '#B5B5C3',
            },
            markers: {
                width: 12,
                height: 12,
                radius: 4,
            },
            formatter: function (seriesName: any, opts: any) {
                const percentage = opts.w.globals.series[opts.seriesIndex];
                return `${seriesName}:\n${percentage}B USD`;
            },
        },
    };

    return (
        <div className="w-full bg-white dark:bg-[#121212] p-6 pb-0 xl:pb-6 rounded-[10px] revenue_dounut_chart">
            <div className="flex justify-between items-center px-4">
                <h2 className="text-[20px] font-medium leading-8 tracking-[0.15px] dark:text-white text-[#212121]">Revenue Resources</h2>
            </div>
            <div className="py-[15px]">
                {Chart && <Chart options={chartOptions} series={chartOptions.series} type="donut" height="400" />}
            </div>
        </div>
    );
};

export default RevenueDougnut;