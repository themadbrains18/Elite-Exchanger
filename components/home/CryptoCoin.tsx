import React, { Fragment, useEffect, useState } from 'react';
import SectionHead from '../snippets/sectionHead';
import CoinCard from '../snippets/coinCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

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

  useEffect(() => {
    const fetchHLCOData = async () => {
      let coins = props?.coinList?.filter((item: any) => item?.symbol !== "USDT");
      let limitedCoins = coins?.slice(0, 8);

      const fetchDataForCoin = async (coin: any) => {

        const slug = coin.symbol;
        try {
          console.log("herer", slug,`${process.env.NEXT_PUBLIC_BASEURL}/price/hloc?slug=${slug}` );
          
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
