import React, { useRef, useEffect, useContext } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts';
import Context from '../contexts/context';

const CandleStickChart = (props) => {

    const { mode } = useContext(Context)
    const chartContainerRef = useRef(null);
    const chart = useRef(null);


    useEffect(() => {
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
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            priceScale: {
                borderColor: '#485c7b',
            },
            timeScale: {
                borderColor: '#485c7b',
            },
        });

        const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#4bffb5',
            downColor: '#ff4976',
            borderDownColor: '#ff4976',
            borderUpColor: '#4bffb5',
            wickDownColor: '#838ca1',
            wickUpColor: '#838ca1',
        });


        candleSeries.setData(props.hloc_data);
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

        function mergeTickToBar(price) {
            if (currentBar.open === null) {
                currentBar.open = price;
                currentBar.high = price;
                currentBar.low = price;
                currentBar.close = price;
            } else {
                currentBar.close = price;
                currentBar.high = Math.max(currentBar.high, price);
                currentBar.low = Math.min(currentBar.low, price);
            }
            candleSeries.update(currentBar);
        }

        function reset() {
            candleSeries.setData(props.hloc_data);
            lastClose = props.hloc_data[props.hloc_data.length - 1].close;
            lastIndex = props.hloc_data.length - 1;

            targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
            targetPrice = getRandomPrice();

            currentIndex = lastIndex + 1;
            currentBusinessDay = { day: 29, month: 5, year: 2019 };
            ticksInCurrentBar = 0;
        }

        function getRandomPrice() {
            return 10 + Math.round(Math.random() * 10000) / 100;
        }

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