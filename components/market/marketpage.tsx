import React, { useEffect, useState } from "react";
import MarketCoin from "./marketCoin";
import CoinList from "./coinList";
import BuySellCard from "../snippets/market/buySellCard";
import WatchList from "./watchList";

interface propsData {
  coinList: any,
  session: any,
  assets: any,
  networks: any,
}

const Marketpage = (props: propsData) => {

  const marketCoinList = props.coinList.slice(0, 6);
  const [coins, setCoins] = useState([]);
  const [filter, setFilter] = useState('')
  const [cardData, setCardData] = useState<any[]>([]);

  /**
 * @effect useEffect hook for fetching HLCO data
 * 
 * This `useEffect` hook fetches HLCO data for each coin in the provided `coinList` prop, 
 * excluding the "USDT" symbol. It then updates the state with the fetched data.
 * 
 * @returns {void}
 */
  useEffect(() => {

    /**
   * Fetches HLCO data for all coins in the `coinList` prop (excluding "USDT").
   * 
   * @async
   * @function fetchHLCOData
   * @returns {Promise<void>} Resolves after fetching and updating the card data.
   */
    const fetchHLCOData = async () => {
      let coins = props?.coinList?.filter((item: any) => item?.symbol !== "USDT");

      /**
     * Fetches HLCO data for a specific coin and adds it to the coin object.
     * 
     * @async
     * @function fetchDataForCoin
     * @param {any} coin - The coin object for which HLCO data needs to be fetched.
     * @returns {Promise<any>} A coin object with added HLCO data or null if an error occurs.
     */
      const fetchDataForCoin = async (coin: any) => {
        const slug = coin.symbol;
        try {
          let hlocv = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/hloc?slug=${slug}`, {
            method: "GET"
          }).then(response => response.json())
          return {
            ...coin,
            hlocv: hlocv?.data?.data
          };
        } catch (error) {
          console.error(`Error fetching HLCO data for ${slug}:`, error);
          return {
            ...coin,
            hlocv: null
          };
        }
      };

      const updatedCardData: any = await Promise.all(coins.map(fetchDataForCoin));
      setCardData(updatedCardData)
      setCoins(updatedCardData)
    };

    fetchHLCOData();
  }, [props.coinList]);


  /**
   * Filters the list of coins based on the user input.
   * 
   * This function takes the input value from an event (e.g., a text input), 
   * converts it to lowercase, and filters the `cardData` array to return only the 
   * coins whose symbols match the input. The filtered results are then updated 
   * in the `coins` state.
   * 
   * @function filterCoins
   * @param {any} e - The event object, typically from an input element.
   * @returns {void}
   */
  const filterCoins = (e: any) => {
    // Update the filter state with the input value converted to lowercase
    setFilter(e.target.value.toLowerCase())
    // Filter the cardData array to find coins whose symbol matches the input value
    let records: any = cardData?.filter((item: any) => {
      return item.symbol.toLowerCase().includes(e.target.value.toLowerCase());
    })
    // Update the coins state with the filtered records
    setCoins(records)
  }

  return (
    <section className=" bg-light-v-1 py-[20px] md:py-[80px]  dark:bg-black-v-1">
      <div className="container flex flex-wrap gap-30">
        <div className="max-w-full lg:max-w-full w-full">
          <MarketCoin bannerCoinList={marketCoinList} setCoins={setCoins} allCoins={cardData?.slice(0, 6)} />
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
