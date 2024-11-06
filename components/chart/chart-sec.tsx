import React, { useContext, useEffect, useState } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Context from "@/components/contexts/context";

interface PropsData {
  slug: string,
  view?: string
}

const ChartSec = (props: PropsData) => {
  const { mode } = useContext(Context);
  let [responsiveHeight,setResponsiveHeight] = useState(0);
  useEffect(()=>{
    if(window.innerWidth > 767){
      setResponsiveHeight(800)
    }else{
      setResponsiveHeight(400)
    }
  },[])

  useEffect(() => {}, [mode]);

  return (
    <div className='rounded-10 bg-white dark:bg-d-bg-primary'>
      <AdvancedRealTimeChart
        key={props.slug} 
        symbol={props.slug}
        interval="D"
        theme={mode === "dark" ? "dark" : "light"}
        height={responsiveHeight}
        width="100%"
        container_id={`tradingview_46b68${props.view}`}
      />
    </div>
  );
}

export default ChartSec;
