import React, { Fragment } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay}  from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

const InvestorSec = () => {
  const investorData = [
    {
      "investorLogo": "investorLogo4.png"
    },
    {
      "investorLogo": "investorLogo5.png"
    },
    {
      "investorLogo": "investorLogo6.png"
    },
    {
      "investorLogo": "investorLogo5.png"
    },
    {
      "investorLogo": "investorLogo6.png"
    },
    {
      "investorLogo": "investorLogo5.png"
    },
    {
      "investorLogo": "investorLogo6.png"
    },
    {
      "investorLogo": "investorLogo4.png"
    },
    {
      "investorLogo": "investorLogo5.png"
    },
    {
      "investorLogo": "investorLogo6.png"
    }
  ];

  return (
    <>
      <section className="investor-sec py-60 md:py-100 bg-bg-secondary dark:bg-d-bg-primary">
        <div className="container">
          <div className='flex gap-[30px] items-center'>
            <div className='max-w-full w-full h-[2px] bg-lineGradient2 dark:bg-lineGradient'></div>
            <div className='capitalize text-center sec-title whitespace-nowrap'>Backed By Investors</div>
            <div className='max-w-full w-full h-[2px] bg-lineGradient2 dark:bg-lineGradient'></div>
          </div>
          
          <div className='pt-50'>
            <Swiper
              modules={[Autoplay]}
              slidesPerView={6}  
              spaceBetween={30} 
              loop={true}       
              autoplay={{
                delay: 2500,    
                disableOnInteraction: false,
              }}
              breakpoints={{
                300: {
                  slidesPerView: 2,
                },
                640: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 6,
                },
              }}
            >
              {investorData.map((elem, ind) => (
                <SwiperSlide key={ind}>
                  <Image 
                    src={`/assets/home/${elem.investorLogo}`}  
                    alt='logo' 
                    width={153} 
                    height={40} 
                    className='md:max-w-[153px] mx-auto max-w-[140px] w-full' 
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}

export default InvestorSec;
