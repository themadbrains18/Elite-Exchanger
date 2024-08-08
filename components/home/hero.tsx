import Image from "next/image"
import 'swiper/css';
import Link from "next/link";
import { useContext } from "react";
import Context from "../contexts/context";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; 


const Hero = () => {
    const { mode } = useContext(Context)
    return (
        <div className="pb-[0] pt-[20px]   w-full">
            <div className="dark:bg-d-bg-primary bg-bg-primary rounded-[10px] md:rounded-20 xl:px-[114px] py-[20px] lg:py-[32px] ">
                <div className="container ">
                    <div className="heroGrid grid lg:grid-cols-2 gap-[60px] md:gap-4 ">
                        <div className="hero_left self-center max-w-[760px] w-full lg:order-1 order-2">
                            <div className="hero_Header ">
                                <h2 className="xxl-heading text-banner-heading dark:text-d-banner-heading">Buy & Sell</h2>
                                <h2 className="xxl-heading text-primary">Crypto Instant</h2>
                            </div>

                            <div className="hero_body mt-5 md:mt-30 mb-[60px] md:mb-80 ">
                                <p className="font-medium text-[14px] md:text-[18px] leading-22 md:leading-24 text-banner-text dark:text-d-banner-text mb-[40px] md:mb-50">Join the world's biggest and most trusted exchange. Trade Bitcoin, Ethereum, Ripple, and many more currencies securely and efficiently.</p>
                                <Link className="solid-button text-[18px] max-w-full sm:max-w-[244px] w-full inline-block text-center" href="/chart/BTCB">Start Trading</Link>
                            </div>


                            <div className="hero_footer">
                                {/* <div className="lg:hidden">
                                    <Swiper
                                        className="mySwiper"
                                        slidesPerView={2}
                                        spaceBetween={20}
                                    >
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-1.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-2.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-3.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-4.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-5.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-6.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Image
                                                src="/assets/home/bannerLogo-6.png"
                                                alt="Logo"
                                                className="max-w-[125px] w-full"
                                                width={125}
                                                height={50}
                                            />
                                        </SwiperSlide>
                                    </Swiper>
                                </div> */}

                                <div className="lg:grid hidden overflow-x-auto gap-[30px] grid-cols-3 md:gap-x-[101px] md:gap-y-[50px]">
                                    <Image className="block m-auto aspect-[1] h-[50px] object-contain w-[157px]" src="/assets/home/bannerLogo-1.png" alt="Logo" width={251} height={50} />
                                    <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/assets/home/bannerLogo-2.png" alt="Logo" width={251} height={50} />
                                    <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/assets/home/bannerLogo-3.png" alt="Logo" width={251} height={50} />
                                    <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/assets/home/bannerLogo-4.png" alt="Logo" width={251} height={50} />
                                    <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/assets/home/bannerLogo-5.png" alt="Logo" width={251} height={50} />
                                    <Image className="block m-auto aspect-[1] h-[50px] object-contain" src="/assets/home/bannerLogo-6.png" alt="Logo" width={251} height={50} />
                                </div>
                            </div>
                        </div>

                        <div className="hero_right w-full max-w-[820px] lg:flex lg:items-center order-1 lg:order-2">
                            <Image src={`/assets/home/${mode === "light" ? "BannerLight1.png" : "BannerDark1.png"}`} alt="Laptop-image" className="block w-full" width={653} height={500} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Hero
