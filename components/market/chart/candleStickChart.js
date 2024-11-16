import React, { useRef, useEffect, useContext } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts';
import Context from '../contexts/context';

const CandleStickChart = (props) => {

    const { mode } = useContext(Context)
    const chartContainerRef = useRef(null);
    const chart = useRef(null);

    /**
     * Initializes a chart and sets up a candlestick series, updating the chart
     * with data and simulating price changes.
     * 
     * The chart is initialized with different layouts, crosshair settings, grid colors, and more.
     * The `candleSeries` is set with initial data and is periodically updated with simulated price data.
     */
    useEffect(() => {
        // Create a new chart instance and configure its layout and style based on the theme mode (dark or light).
        chart.current = createChart(chartContainerRef.current, {
            height: 520,
            layout: {
                background: {
                    type: mode === "dark" ? 'solid' : 'light',
                    color: mode === "dark" ? '#000000' : '#ffffff',
                },
                textColor: mode === "dark" ? 'rgba(255, 255, 255, 0.9)' : '#000000',
            },
            grid: {
                vertLines: {
                    color: 'rgba(197, 203, 206, 0.5)',
                },
                horzLines: {
                    color: 'rgba(197, 203, 206, 0.5)',
                },
            },
            crosshair: { mode: CrosshairMode.Normal }, // Enable normal crosshair mode
            priceScale: { borderColor: '#485c7b' }, // Set price scale border color
            timeScale: { borderColor: '#485c7b' }, // Set time scale border color
        });

        // Add a candlestick series to the chart with specific up and down colors.
        const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#4bffb5', // Up candlestick color
            downColor: '#ff4976', // Down candlestick color
            borderDownColor: '#ff4976', // Border color for down candlesticks
            borderUpColor: '#4bffb5', // Border color for up candlesticks
            wickDownColor: '#838ca1', // Wick color for down candlesticks
            wickUpColor: '#838ca1', // Wick color for up candlesticks
        });

        // Set initial data for the candlestick series
        candleSeries.setData(props.hloc_data);

        // Cleanup function to remove the chart on component unmount
        return () => {
            chart.current.remove();
        }

        var lastClose = props.hloc_data[props.hloc_data.length - 1].close;
        var lastIndex = props.hloc_data.length - 1;

        var targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
        var targetPrice = getRandomPrice();

        var currentIndex = lastIndex + 1;
        var currentBusinessDay = { day: 29, month: 5, year: 2019 };
        var ticksInCurrentBar = 0;
        var currentBar = {
            open: null,
            high: null,
            low: null,
            close: null,
            time: currentBusinessDay,
        };

        /**
         * Merges a new price tick into the current candlestick data.
         * 
         * If this is the first price tick (i.e., `currentBar.open` is null), 
         * it sets the `open`, `high`, `low`, and `close` prices to the tick price.
         * 
         * Otherwise, it updates the `close`, `high`, and `low` prices based on 
         * the new price, and the `close` price is always set to the latest tick price.
         * 
         * After updating the candlestick data, it calls `candleSeries.update()` 
         * to reflect the changes on the chart.
         * 
         * @param {number} price - The current price tick to be merged into the bar.
         */
        function mergeTickToBar(price) {
            if (currentBar.open === null) {
                currentBar.open = price; // Set open price
                currentBar.high = price; // Set high price (same as open for the first tick)
                currentBar.low = price;  // Set low price (same as open for the first tick)
                currentBar.close = price; // Set close price (same as open for the first tick)
            } else {
                currentBar.close = price; // Set the latest close price to the current tick price
                currentBar.high = Math.max(currentBar.high, price); // Update the high price if the tick is higher than the current high
                currentBar.low = Math.min(currentBar.low, price);   // Update the low price if the tick is lower than the current low
            }
            candleSeries.update(currentBar);
        }

        /**
         * Resets the chart data and prepares the system for new candlestick data generation.
         * 
         * This function is typically called when the chart reaches a certain limit (e.g., 5000 data points),
         * and it initializes the candlestick chart with new data while keeping track of the necessary state
         * for generating the next batch of candlesticks.
         */
        function reset() {
            // Set the new data for the candlestick chart (props.hloc_data contains historical data)
            candleSeries.setData(props.hloc_data);
            // Update the last close price from the most recent data point in props.hloc_data
            lastClose = props.hloc_data[props.hloc_data.length - 1].close;
            // Update the last index to the index of the last data point in props.hloc_data
            lastIndex = props.hloc_data.length - 1;

            // Determine a new target index for generating future price data
            // The targetIndex will be 5 bars ahead of the current lastIndex plus a random offset (between 30-60)
            targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
            targetPrice = getRandomPrice();

            currentIndex = lastIndex + 1;
            currentBusinessDay = { day: 29, month: 5, year: 2019 };
            ticksInCurrentBar = 0;
        }

        function getRandomPrice() {
            return 10 + Math.round(Math.random() * 10000) / 100;
        }

        /**
         * Calculates the next business day from the given date.
         * 
         * This function takes a date object `time` with `year`, `month`, and `day` properties,
         * and calculates the next business day. It increments the day by 1 and returns the updated
         * date in the same format (year, month, day).
         *
         * @param {Object} time - The current date represented by the object { year, month, day }.
         * @returns {Object} - The next business day represented by an object { year, month, day }.
         */
        function nextBusinessDay(time) {
            var d = new Date();
            d.setUTCFullYear(time.year);
            d.setUTCMonth(time.month - 1);
            d.setUTCDate(time.day + 1);
            d.setUTCHours(0, 0, 0, 0);
            return {
                year: d.getUTCFullYear(),
                month: d.getUTCMonth() + 1,
                day: d.getUTCDate(),
            };
        }

        setInterval(function () {
            var deltaY = targetPrice - lastClose;
            var deltaX = targetIndex - lastIndex;
            var angle = deltaY / deltaX;
            var basePrice = lastClose + (currentIndex - lastIndex) * angle;
            var noise = (0.1 - Math.random() * 0.1) + 1.0;
            var noisedPrice = basePrice * noise;
            mergeTickToBar(noisedPrice);
            if (++ticksInCurrentBar === 5) {
                // move to next bar
                currentIndex++;
                currentBusinessDay = nextBusinessDay(currentBusinessDay);
                currentBar = {
                    open: null,
                    high: null,
                    low: null,
                    close: null,
                    time: currentBusinessDay,
                };
                ticksInCurrentBar = 0;
                if (currentIndex === 5000) {
                    reset();
                    return;
                }
                if (currentIndex === targetIndex) {
                    // change trend
                    lastClose = noisedPrice;
                    lastIndex = currentIndex;
                    targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
                    targetPrice = getRandomPrice();
                }
            }
        }, 500);


    }, [props.hloc_data, mode]);

    return (
        <div ref={chartContainerRef} className="chart-container" />
    )
}

export default CandleStickChart;