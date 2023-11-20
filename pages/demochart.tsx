import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
// import hollowcandlestick from "highcharts/stock/modules/hollowcandlestick.js"
import { useEffect, useState } from 'react';

import { getProviders, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { authOptions } from './api/auth/[...nextauth]';

if (typeof Highcharts === "object") {
    // init the module
    Indicators(Highcharts);
    DragPanes(Highcharts);
    AnnotationsAdvanced(Highcharts);
    PriceIndicator(Highcharts);
    FullScreen(Highcharts);
    StockTools(Highcharts);
}

const DemoChart = () => {

    const [hlocData, sethlocData] = useState([]);
    useEffect(()=>{
        getAllMarketOrderByToken();
    },[]);

    const getAllMarketOrderByToken = async () => {
        
        let marketHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/market/token_trade_history?token_id=07bc93a7-6138-460c-af6f-139238178bfe`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json());

        

        const data = await fetch(
            'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
        ).then(response => response.json());

        sethlocData(data)
        
    }
    const options = {
        yAxis: [
            {
                height: "100%"
            },
            {
                top: "100%",
                height: "0%",
                offset: 0
            }
        ],

        series: [
            {
                type: "candlestick",
                data: hlocData,
                yAxis: 0
            }
        ]
    };


    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={options}
            />
        </>
    )
}

export default DemoChart;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getServerSession(context.req, context.res, authOptions);
    const providers = await getProviders()

    let userAssets: any = [];

    let tokenList = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/token`, {
        method: "GET"
    }).then(response => response.json());

    if (session) {

        userAssets = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/user/assets?userid=${session?.user?.user_id}`, {
            method: "GET",
            headers: {
                "Authorization": session?.user?.access_token
            },
        }).then(response => response.json());

    }

    return {
        props: {
            providers: providers,
            sessions: session,
            tokenList: tokenList?.data || [],
            assets: userAssets || [],
        },
    };

}