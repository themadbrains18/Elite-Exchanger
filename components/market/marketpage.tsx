import React, { useEffect, useState } from "react";
import MarketCoin from "./marketCoin";
import CoinList from "./coinList";
import BuySellCard from "../snippets/market/buySellCard";
import WatchList from "./watchList";

interface propsData {
  coinList: any,
  session: any,
  assets:any,
  networks:any,
}

const Marketpage = (props: propsData) => {

  const marketCoinList = props.coinList.slice(0, 6);
  const [coins, setCoins] = useState([]);
  const [filter, setFilter] = useState('')
  const [cardData, setCardData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHLCOData = async () => {
      let coins = props?.coinList?.filter((item: any) => item?.symbol !== "USDT");


      const fetchDataForCoin = async (coin: any) => {
        
        const slug = coin.symbol;
        // console.log(slug,'===========slug');
        
        try {
          let hlocv = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/hloc?slug=${slug}`, {
            method: "GET"
          }).then(response => response.json())
          return {
            ...coin,
            hlocv:hlocv?.data?.data
          };
        } catch (error) {
          console.error(`Error fetching HLCO data for ${slug}:`, error);
          return {
            ...coin,
            hlocv: null
          };
        }
      };

      const updatedCardData:any = await Promise.all(coins.map(fetchDataForCoin));
      // console.log(updatedCardData,"=updatedCardData");
      
      setCardData(updatedCardData)
      setCoins(updatedCardData)
    };

    fetchHLCOData();
  }, [props.coinList]);


  const filterCoins = (e:any)=>{
    
    setFilter(e.target.value.toLowerCase())
    let records:any = cardData?.filter((item:any)=>{
      return item.symbol.toLowerCase().includes(e.target.value.toLowerCase());
    }) 
    setCoins(records)
  }
  
  return (
    <section className=" bg-light-v-1 py-[20px] md:py-[80px]  dark:bg-black-v-1">
      <div className="container flex flex-wrap gap-30">
        <div className="max-w-full lg:max-w-full w-full">
          <MarketCoin bannerCoinList={marketCoinList} setCoins={setCoins} allCoins={cardData?.slice(0,6)}/>
          <CoinList coins={coins} networks={props?.networks} session={props.session} filterCoins={filterCoins} />
        </div>
        {/* <div className="lg:max-w-[432px] w-full md:block hidden">
          <div className="lg:block hidden ">
            <BuySellCard id={0} coins={props.coinList} session={props.session} assets={props.assets} />
          </div>
          <WatchList coinList={cardData?.slice(0, 8)} />
        </div> */}
      </div>
      {/* <div className="lg:hidden">
        <ResponsiveFixCta />
      </div> */}
    </section>
  )
};

export default Marketpage;
