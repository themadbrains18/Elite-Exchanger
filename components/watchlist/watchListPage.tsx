
import React from "react";

import BuySellCard from "../snippets/buySellCard";
import CoinList from "./coinsList";
import TopGainer from "./topGainer";
import Exchange from "./exchange";
import ResponsiveFixCta from "../market/responsive-fix-cta";

interface propsData{
  watchList?:any;
}

const WatchListPage = (props:propsData) => {
  
  return (
    <section className="bg-light-v-1 py-80 md:py-[120px]  dark:bg-black-v-1">
      <div className="container flex lg:flex-row flex-col gap-30">
        <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
          <CoinList watchList={props?.watchList}/>
        </div>
        <div className="lg:max-w-[432px] w-full">
          <div className="lg:block hidden ">
            <Exchange id={0} />
          </div>
          <TopGainer />
        </div>
      </div>
      <div className="lg:hidden">
        <ResponsiveFixCta />
      </div>
    </section>
  );
};

export default WatchListPage;
