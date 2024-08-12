import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import IconsComponent from "../snippets/icons";
import Link from "next/link";
import { currencyFormatter } from "../snippets/market/buySellCard";
import type { Swiper as SwiperInstance } from 'swiper';

interface propsData {
  bannerCoinList: any,
  setCoins: Function,
  allCoins: any
}

const MarketCoin = (props: propsData) => {
  const cardData = props.allCoins;
  const [imgSrc, setImgSrc] = useState(false);

  const profitImages = [
    '/assets/chart/profit-graph1.png',
    // '/assets/chart/profit-graph2.png',
    '/assets/chart/profit-graph3.png',
    '/assets/chart/profit-graph4.png',
  ];

  const lossImages = [
    '/assets/chart/loss-graph1.png',
    '/assets/chart/loss-graph2.png',
    '/assets/chart/loss-graph3.png',
    '/assets/chart/loss-graph4.png',
  ];

  const getRandomImage = (images: string[]) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const swiperRef = useRef<SwiperInstance | null>(null); // Type the useRef correctly

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update(); // Update Swiper instance after mount
    }
  }, []);

  return (
    <div className="p-20 md:p-40 rounded-10 bg-white dark:bg-d-bg-primary">
      <div className="flex justify-between gap-[15px] flex-wrap xl:flex-nowrap">
        <div>
          <p className="text-[23px] leading-7 font-medium mb-2 md:mb-[10px] dark:text-white">Market Coins</p>
        </div>
      </div>
      <div className="mt-30 md:mt-50">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper; // Capture the Swiper instance
          }}
          pagination={true}
          // observer={false}          
          // observeParents={false}  
          loop={true}
          autoplay={{ delay: 4000 }} 
          modules={[Pagination, Autoplay]}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            991: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            1150: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1350: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            1550: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
          }}
          className="mySwiper tmb-swiper"
        >
          {cardData.map((elem: any, ind: any) => {
            const imagePath = Number(elem?.hlocv?.changeRate) > 0 
              ? getRandomImage(profitImages) 
              : getRandomImage(lossImages);

            return (
              <SwiperSlide key={ind}>
                <Link href={`/chart/${elem.symbol}`} className="block">
                  <div className="items-center flex w-full rounded-8 p-20 bg-primary-100 dark:bg-black-v-1 border border-grey dark:border-[transparent] duration-300 hover:drop-shadow-xl gap-[10px] justify-between">
                    <div>
                      <div className="flex items-center gap-[8px] mb-[10px]">
                        <span className="block coinCard_logo">
                          <Image src={`${imgSrc ? '/assets/history/Coin.svg' : elem?.image}`} width={30} height={30} alt="coins" onError={() => setImgSrc(true)} className={`${elem?.symbol === "XRP" && "bg-white rounded-full"}`} />
                        </span>
                        <span className="coinCard_fname leading-24 text-[18px] dark:text-white !font-normal"> {elem.fullName}</span>
                      </div>

                      <div className="coinCard_Cost flex items-center gap-[20px]">
                        <h2 className="md-text !text-[18px] md:!text-[16px] dark:text-white">${currencyFormatter(elem.price.toFixed(5))}</h2>
                        <div className="w-full">
                          <Image src={imagePath} alt="chart" width={200} height={150} className="h-[50px]"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default MarketCoin;
