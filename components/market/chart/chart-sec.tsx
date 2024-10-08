// import CandleStickChart from './candleStickChart';
// import priceData from '../../jsonData/price-data.json';
// import { AdvancedChart } from "react-tradingview-embed";
import React, { useContext, useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Context from "@/components/contexts/context";
// import DemoChart from "@/pages/demochart";

interface propsData {
  slug: string,
  view?: string
}
const ChartSec = (props: propsData) => {
  let { mode } = useContext(Context);

  useEffect(() => {
  }, [mode])

  return (
    <div className=' rounded-10  bg-white dark:bg-d-bg-primary'>
      {/* <CandleStickChart hloc_data={priceData} /> */}
      <AdvancedRealTimeChart
        symbol={`${props.slug}`}
        interval="D"
        theme={mode === "dark" ? "dark" : "light"}
        height={630}
        container_id={`tradingview_46b68${props.view}`}
      ></AdvancedRealTimeChart>
      {/* <DemoChart /> */}
    </div>
  )
}

export default ChartSec