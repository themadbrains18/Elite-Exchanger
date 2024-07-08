import React, { useContext, useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Context from "@/components/contexts/context";

interface PropsData {
  slug: string,
  view?: string
}

const ChartSec = (props: PropsData) => {
  const { mode } = useContext(Context);

  useEffect(() => {}, [mode]);

  return (
    <div className='rounded-10 bg-white dark:bg-d-bg-primary'>
      <AdvancedRealTimeChart
        key={props.slug} // Use slug as key to re-mount component when slug changes
        symbol={props.slug}
        interval="D"
        theme={mode === "dark" ? "dark" : "light"}
        height={800}
        width="100%"
        container_id={`tradingview_46b68${props.view}`}
      />
    </div>
  );
}

export default ChartSec;
