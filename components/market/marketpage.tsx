import React, { useState } from "react";
import MarketCoin from "./marketCoin";
import CoinList from "./coinList";
import BuySellCard from "../snippets/buySellCard";
import WatchList from "./watchList";
import ResponsiveFixCta from "./responsive-fix-cta";

interface propsData {
  coinList: any,
  session: any,
  assets:any
}

const Marketpage = (props: propsData) => {

  const watchCoinList = props.coinList.slice(0, 8);
  const marketCoinList = props.coinList.slice(0, 6);
  const [coins, setCoins] = useState(props.coinList);

  return (
    <section className=" bg-light-v-1 py-80 md:py-[120px]  dark:bg-black-v-1">
      <div className="container flex flex-wrap gap-30">
        <div className="max-w-full lg:max-w-[calc(100%-463px)] w-full">
          <MarketCoin bannerCoinList={marketCoinList} setCoins={setCoins} allCoins={props.coinList}/>
          <CoinList coins={props.coinList} />
        </div>
        <div className="lg:max-w-[432px] w-full md:block hidden">
          <div className="lg:block hidden ">
            <BuySellCard id={0} coins={props.coinList} session={props.session} assets={props.assets} />
          </div>
          <WatchList coinList={watchCoinList} />
        </div>
      </div>
      {/* <div className="lg:hidden">
        <ResponsiveFixCta />
      </div> */}
    </section>
  )
};

export default Marketpage;
