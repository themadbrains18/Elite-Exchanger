import React from 'react';
import Image from 'next/image';
import RoundedDoughnutChart from '@/admin/admin-snippet/dougnutChart';
import RadialChart from '@/admin/admin-snippet/radialChart';
import RevenueDougnut from '@/admin/admin-snippet/revenueDougnut';
import DonutChartWithText from '@/admin/admin-snippet/revenueDougnut';

const RevenueRsources = () => {
  return (
    <>
      <div className='w-full'>
        <div className=' w-full mt-[24px] '>
          {/* <RevenueDougnut /> */}
          <DonutChartWithText />
        </div>
        <div className=' w-full mt-[24px] '>
          <RoundedDoughnutChart />
        </div>
        <div className='mt-6'>
          <RadialChart />
        </div>
      </div>
    </>
  )
}

export default RevenueRsources;