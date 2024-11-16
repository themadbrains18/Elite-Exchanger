import React, { useContext, useEffect, useState } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Context from "@/components/contexts/context";

interface PropsData {
  slug: string,
  view?: string
}

/**
 * ChartSec component displays a real-time chart based on the provided slug.
 * It uses the TradingView widget to render the chart with dynamic height based on the screen size.
 * 
 * @component
 * @example
 * // Usage of ChartSec with a slug prop:
 * <ChartSec slug="BTCUSD" />
 *
 * @param {Object} props - The properties passed to the component
 * @param {string} props.slug - The slug representing the market symbol (e.g., "BTCUSD")
 * @param {string} [props.view] - Optional view parameter for custom container ID
 * 
 * @returns {JSX.Element} The JSX markup for the ChartSec component
 */
const ChartSec = (props: PropsData) => {
  const { mode } = useContext(Context);
  /**
   * State to track the responsive height for the chart.
   * @type {number}
   */
  let [responsiveHeight, setResponsiveHeight] = useState(0);

  /**
   * Effect hook to adjust the chart height based on window size.
   * @effect
   */
  useEffect(() => {
    if (window.innerWidth > 767) {
      setResponsiveHeight(800)
    } else {
      setResponsiveHeight(400)
    }
  }, [])

  /**
   * Effect hook to handle theme mode changes (dark/light).
   * Currently not performing any specific logic on mode change.
   * @effect
   */
  useEffect(() => { }, [mode]);

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
