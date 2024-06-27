import Image from 'next/image';
import React, { useContext } from 'react'
import Context from '../contexts/context';

const FeatureNews = () => {
  const { mode } = useContext(Context);

    return(
        <section className="pb-[15px] pt-[0px] md:pt-[91px]  md:pb-[60px] w-full relative">
            <div className="relative z-[1]">
                <div className="container">
                    <div className="flex items-center md:gap-[100px] gap-[10px]  rounded-[10px]  lg:flex-nowrap flex-wrap " >
                        <div className="hero_left self-center max-w-full lg:max-w-[40%]  w-full lg:order-1 order-2 p-[15px] md:p-0 relative">
                            <div className="hero_Header relative inline-block">
                                <h2 className="sec-subTitle  dark:text-d-banner-heading">
                                    Tech titans meet US lawmakers, Musk seeks “referee” for AI
                                </h2>
                            </div>
                            <div className="hero_body mt-5 md:mt-30  ">
                                <p className="text-banner-text dark:text-d-banner-text mb-40 md:mb-50">Tesla boss Elon Musk called for a "referee" for artificial intelligence (AI) after he, Meta chief Mark Zuckerberg, Alphabet boss Sundar Pichai and other tech CEOs met with US lawmakers to discuss AI regulation.</p>
                                <a href="#" className="solid-button max-w-full sm:max-w-[244px] w-full inline-block text-center">Read More</a>
                            </div>
                        </div>  

                        <div className="hero_right w-full max-w-full lg:max-w-[60%] lg:flex lg:items-center order-1 lg:order-2">
                            <Image src="/assets/news/feature-news-img.png" alt="Laptop-image" className="block w-full" width={653} height={500}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full md:block hidden absolute top-0 left-0 '>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1920 429"
                    fill="none"
                    >
                    <path d="M0 0H1920V425.045C1293.5 22.5 627.5 30 0 429V0Z"  fill={mode === "dark" ? "#121318" : "#F4F9FC"}  />
                </svg>
            </div>
            <div className='w-full md:hidden absolute top-0 left-0'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 375 115"
                    fill="none"
                    >
                    <path d="M0 0H375V114.611C275.5 0.5 92.5 7.5 0 114.611V0Z" fill={mode === "dark" ? "#121318" : "#F4F9FC"}/>
                </svg>

            </div>
        </section>
    )
}

export default FeatureNews;