// import CandleStickChart from './candleStickChart';
// import priceData from '../../jsonData/price-data.json';
// import { AdvancedChart } from "react-tradingview-embed";
import React, { useContext, useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Context from "@/components/contexts/context";

interface propsData{
  slug:string
}
const ChartSec = (props:propsData) => {
  let { mode } = useContext(Context);
  

  useEffect(()=>{
  },[mode])
  
  return (
    <div className='p-20 md:p-20 rounded-10  bg-white dark:bg-d-bg-primary'>
      {/* <div className="flex justify-between gap-[15px] flex-wrap xl:flex-nowrap">
        <div>
          <p className="text-[23px] leading-7 font-medium mb-2 md:mb-[10px] dark:text-white">Market Coins</p>
          <p className="nav-text-sm  md:leading-17 leading-20 banner-text dark:text-beta">Lorem Ipsum is simply dummy text of the printing.</p>
        </div>
        <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px] w-full py-[13px] px-[10px] ">
          <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
          <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" />
        </div>
      </div> */}

      {/* <div id="chart" className='mt-50'>
        <Chart options={chartData.options} series={chartData.series} type="area" height={350} />
      </div> */}
      
      {/* <CandleStickChart hloc_data={priceData} /> */}
      <AdvancedRealTimeChart
          symbol= {`${props.slug}USDT`}
          interval="D"
          theme= {mode === "dark"?"dark":"light"}
          height={550}
          container_id="tradingview_46b68"
        ></AdvancedRealTimeChart>
    </div>
  )
}

export default ChartSec