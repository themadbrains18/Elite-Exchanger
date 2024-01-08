import Image from "next/image"
import 'swiper/css';
import Link from "next/link";

const Hero = () => {
    return(
        <div className="pb-[0] pt-[40px] md:py-[91px]  w-full">
            <div className="dark:bg-d-bg-primary bg-bg-primary rounded-20 xl:px-[92px] py-[20px] lg:py-[32px] ">
                <div className="container">
                    <div className="heroGrid grid lg:grid-cols-2  gap-4 " >
                        <div className="hero_left self-center max-w-[760px] w-full lg:order-1 order-2">
                            <div className="hero_Header ">
                                <h2 className="xxl-heading text-banner-heading dark:text-d-banner-heading">Buy & Sell</h2>
                                <h2 className="xxl-heading text-primary">Crypto Instant</h2>
                            </div>

                            <div className="hero_body mt-5 md:mt-30 mb-[60px] md:mb-80 ">
                                <p className="text-banner-text dark:text-d-banner-text mb-[20px] md:mb-50">Join world’s biggest & tursted Exchange.Trade inBitcoin, Ethereum, Ripple and many more currencies.</p>
                                <Link className="solid-button max-w-full sm:max-w-[244px] w-full" href="/chart/BTC">Start Trading</Link>
                            </div>

                            <div className="hero_footer">
                                {/* <div className="block md:hidden">
                                    <Swiper
                                        slidesPerView={2.4}
                                        spaceBetween={10}
                                        loop={true}
                                        className="mySwiper"
                                        >
                                            <SwiperSlide >
                                                <Image  src="/../public/assets/home/bannerLogo-1.png" alt="Logo" width={125} height={50}/>
                                            </SwiperSlide>
                                            <SwiperSlide >
                                                <Image  src="/../public/assets/home/bannerLogo-2.png" alt="Logo" width={125} height={50}/>
                                            </SwiperSlide>
                                            <SwiperSlide >
                                                <Image  src="/../public/assets/home/bannerLogo-3.png" alt="Logo" width={125} height={50}/>
                                            </SwiperSlide>
                                            <SwiperSlide >
                                                <Image  src="/../public/assets/home/bannerLogo-4.png" alt="Logo" width={125} height={50}/>
                                            </SwiperSlide>
                                            <SwiperSlide >
                                                <Image  src="/../public/assets/home/bannerLogo-5.png" alt="Logo" width={125} height={50}/>
                                            </SwiperSlide>
                                            <SwiperSlide >
                                                <Image  src="/../public/assets/home/bannerLogo-6.png" alt="Logo" width={125} height={50}/>
                                            </SwiperSlide>
                                    </Swiper>
                                </div> */}

                            <div className="md:grid hidden grid-cols-3 gap-[15px]">
                                <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/../public/assets/home/bannerLogo-1.png" alt="Logo" width={251} height={50}/>
                                <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/../public/assets/home/bannerLogo-2.png" alt="Logo" width={251} height={50}/>
                                <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/../public/assets/home/bannerLogo-3.png" alt="Logo" width={251} height={50}/>
                                <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/../public/assets/home/bannerLogo-4.png" alt="Logo" width={251} height={50}/>
                                <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/../public/assets/home/bannerLogo-5.png" alt="Logo" width={251} height={50}/>
                                <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/../public/assets/home/bannerLogo-6.png" alt="Logo" width={251} height={50}/>
                            </div>
                            </div>
                        </div>

                        <div className="hero_right w-full max-w-[820px] lg:flex lg:items-center order-1 lg:order-2">
                            <Image src="/../public/assets/home/BannerLight1.png" alt="Laptop-image" className="block w-full" width={653} height={500}/>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default Hero
