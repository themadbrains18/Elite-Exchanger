import React, { Fragment, useEffect, useState } from 'react';
import SectionHead from '../snippets/sectionHead';
import CoinCard from '../snippets/coinCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

/**
 * Interface for the props used by the component that handles the coin list.
 * 
 * @interface
 * @property {any} coinList - A list of coins to be displayed or processed.
 * This can include information like coin names, values, symbols, etc., and
 * may vary in structure depending on the data source.
 */
interface propsData {
  coinList: any;
}

const CryptoCoin = (props: propsData) => {
  const [cardData, setCardData] = useState<any[]>([]);

  const headData = {
    title: 'Top Market',
    subTitle: 'Get Various Crypto Coin',
    brief: '',
    spacing: false,
    Cta: false,
    hidden: false
  };

  /**
 * Fetches HLCO (High, Low, Close, Open) data for a list of coins and updates the component state.
 * 
 * This effect runs whenever the `props.coinList` changes. It filters out the "USDT" coin from 
 * the list, limits the number of coins to 8, and fetches HLCO data for each coin. If the data 
 * is successfully fetched, it updates the coin data with additional properties like chart image,
 * status, and change24h. If the fetch fails, it sets the `hlocv` to null and provides default 
 * values for other properties.
 * 
 * @param {Array} props.coinList - The list of coins passed as a prop. Each coin object in the list
 *                                  is expected to have properties like `symbol`, which is used 
 *                                  to fetch HLCO data.
 */
  useEffect(() => {
    const fetchHLCOData = async () => {
      let coins = props?.coinList?.filter((item: any) => item?.symbol !== "USDT");
      let limitedCoins = coins?.slice(0, 8);

      const fetchDataForCoin = async (coin: any) => {

        const slug = coin.symbol;
        try {
          let hlocv = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/price/hloc?slug=${slug}`, {
            method: "GET"
          }).then(response => response.json());

          return {
            ...coin,
            chartImg: "ChartImage",
            status: 'high',
            change24h: '4',
            hlocv: hlocv?.data?.data
          };
        } catch (error) {
          console.error(`Error fetching HLCO data for ${slug}:`, error);
          return {
            ...coin,
            chartImg: "ChartImage",
            status: 'high',
            change24h: '4',
            hlocv: null
          };
        }
      };

      const updatedCardData = await Promise.all(limitedCoins.map(fetchDataForCoin));
      setCardData(updatedCardData);
    };

    fetchHLCOData();
  }, [props.coinList]);

  return (
    <section className='py-[30px] md:py-[100px]'>
      <div className='container'>
        <SectionHead headData={headData} center={true} />
        {/* <div className='cryptoCoin_cards hidden lg:mt-[60px] mt-[50px] md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center flex-wrap justify-center gap-[20px] xl:gap-[30px]'>
          {cardData && cardData.length > 0 && cardData.map((elem: any, ind: any) => (
            <Fragment key={ind}>
              <CoinCard coinCardData={elem} />
            </Fragment>
          ))}
        </div> */}
        <div className='mt-[50px]'>
          <Swiper
            slidesPerView={1.2}
            breakpoints={{
              '250': {
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              '767': {
                slidesPerView: 2.5,
                spaceBetween: 10,
              },
              '1200': {
                slidesPerView: 4,
                spaceBetween: 10,
              }
            }}
            spaceBetween={20}
            pagination={true}
            loop={true}
            autoplay={true}
            modules={[Pagination, Autoplay]}
            className="mySwiper tmb-swiper">
            {cardData && cardData.length > 0 && cardData.map((elem: any, ind: any) => (
              <Fragment key={ind}>
                <SwiperSlide key={ind}>
                  <CoinCard coinCardData={elem} />
                </SwiperSlide>
              </Fragment>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CryptoCoin;
