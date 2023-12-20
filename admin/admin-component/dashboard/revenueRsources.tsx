import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RoundedDoughnutChart from '@/admin/admin-snippet/dougnutChart';
import RadialChart from '@/admin/admin-snippet/radialChart';
import RevenueDougnut from '@/admin/admin-snippet/revenueDougnut';
import DonutChartWithText from '@/admin/admin-snippet/revenueDougnut';
import adminProfit from '@/pages/api/user/adminProfit';

interface propData{
  adminProfit:any;
  activity:any;

}

const RevenueRsources = (props:propData) => {

  let [fee,setFee] = useState(0.00);
  let [profit,setProfit] = useState(0.00)
  const [cities,setCities] = useState([])

  useEffect(()=>{
calculateFeeorProfit()
  },[])

  const calculateFeeorProfit = () => {
    try {
      const { adminProfit } = props;

      const { totalFees, totalProfit } = adminProfit.reduce(
        (acc:any, transaction:any) => {

          acc.totalFees += transaction.fees || 0;

          acc.totalProfit += transaction.profit || 0;

          return acc;
        },
        { totalFees: 0, totalProfit: 0 } // Initial accumulator values
      );

      setFee(totalFees);
      setProfit(totalProfit);
      const groupCount = props?.activity.reduce((countMap:any, item:any) => {
        const { region } = item;
        countMap[region] = (countMap[region] || 0) + 1;
        return countMap;
      }, {});
      
      setCities(groupCount)
    } catch (error) {
      console.error('Error calculating fees and profit:', error);
    }
  };

  return (
    <>
      <div className='w-full'>
        <div className=' w-full mt-[24px] '>
          {/* <RevenueDougnut /> */}
          <DonutChartWithText  fee={fee} profit={profit}/>
        </div>
        <div className=' w-full mt-[24px] '>
          <RoundedDoughnutChart cities={cities}/>
        </div>
        <div className='mt-6'>
          <RadialChart />
        </div>
      </div>
    </>
  )
}

export default RevenueRsources;