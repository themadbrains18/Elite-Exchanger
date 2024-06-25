import React, { Fragment } from 'react'
import SectionHead from '../snippets/sectionHead'
import CoinCard from '../snippets/coinCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper core and required modules

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

interface propsData {
  coinList: any
}

const CryptoCoin = (props: propsData) => {

  const headData = {
    title: 'Top Market',
    subTitle: 'Get Various Crypto Coin',
    brief: '',
    spacing: false,
    Cta: false,
    hidden: false
  };

  let coins = props.coinList.filter((item:any)=>{
    return item?.symbol!=="USDT"
  });

  let cardData = coins.slice(0, 4);
  cardData.forEach(function (element:any) {
    element.chartImg = "ChartImage";
    element.status = 'high';
    element.change24h = '4'
  });

  
  return (
    <>
      <section className='py-[30px] md:py-[100px]'>
        <div className='container'>
          <SectionHead headData={headData} center={true} />
          <div className='cryptoCoin_cards hidden lg:mt-[60px] mt-[50px] md:flex items-center flex-wrap justify-center gap-[30px]'>
            {
              cardData.map((elem: any, ind: any) => {
                return (
                  <Fragment key={ind}>
                    <CoinCard coinCardData={elem} />
                  </Fragment>
                )
              })
            }
          </div>
          <div className='block md:hidden mt-[50px]'>
            <Swiper slidesPerView={1.2} spaceBetween={20} pagination={true} modules={[Pagination]} className="mySwiper tmb-swiper">
              {
                cardData.map((elem: any, ind: any) => {
                  return (
                    <Fragment key={ind}>
                      <SwiperSlide key={ind}>
                        <CoinCard coinCardData={elem} />
                      </SwiperSlide>
                    </Fragment>
                  )
                })
              }

            </Swiper>
          </div>
        </div>
      </section>
    </>
  )
}

export default CryptoCoin
