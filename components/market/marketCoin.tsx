import Image from "next/image";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import IconsComponent from "../snippets/icons";
import Link from "next/link";

interface propsData {
  bannerCoinList: any,
  setCoins : Function,
  allCoins :any
}

const MarketCoin = (props: propsData) => {
  const cardData = props.bannerCoinList;


  const filterCoins = (e:any)=>{
    let records = props.allCoins.filter((item:any)=>{
      return item.symbol.toLowerCase().includes(e.target.value.toLowerCase());
    }) 
    props.setCoins(records);
  }

  return (
    <div className="p-20 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
      <div className="flex justify-between gap-[15px] flex-wrap xl:flex-nowrap">
        <div>
          <p className="text-[23px] leading-7 font-medium mb-2 md:mb-[10px] dark:text-white">Market Coins</p>
        </div>
        <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px] w-full py-[13px] px-[10px] ">
          <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
          <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" onChange={(e)=>filterCoins(e)}/>
        </div>
      </div>
      <div className="mt-30 md:mt-50">
        <Swiper
          pagination={true}
          autoplay={true}
          modules={[Pagination, Autoplay]}
          breakpoints={{

            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            991: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            1150: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1350: {
              slidesPerView: 2.5,
              spaceBetween: 30,
            },
            1550: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="mySwiper tmb-swiper">
          {cardData.map((elem: any, ind: any) => {            
            return (
              <SwiperSlide key={ind}>
                <Link href={`/chart/${elem.symbol}`} className="block">
                  <div className="items-center flex w-full rounded-8 p-20 bg-primary-100 dark:bg-black-v-1 border border-grey dark:border-[transparent] duration-300 hover:drop-shadow-xl gap-[10px] justify-between">
                    <div>
                      <div className="flex items-center gap-[15px] mb-[10px]">
                        <span className="block coinCard_logo">
                          <Image src={`${elem.image}`} alt="Coin Logo" width={30} height={30} />
                        </span>
                        <span className="coinCard_fname  leading-24 text-[18px] dark:text-white !font-normal"> {elem.fullName}</span>
                      </div>

                      <div className="coinCard_Cost flex items-center gap-[20px]">
                        <h2 className="md-text !text-[18px] md:!text-[16px] dark:text-white">${elem.price.toFixed(5)}</h2>
                        <div className={`flex items-center gap-[10px] `}>
                          <p className={`footer-text-secondary  ${elem.status == "high" ? "!text-[#03A66D]" : "!text-[#DC2626]"}`}>{elem.totalSupply && elem.totalSupply.toLocaleString('en-US')}</p>
                          <IconsComponent type={elem.status} active={false} hover={false} />
                        </div>
                      </div>
                    </div>

                    <div className="max-w-[113px] w-full">
                      <IconsComponent type={elem.chartImg} active={false} hover={false} />
                    </div>

                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  )
};

export default MarketCoin;
