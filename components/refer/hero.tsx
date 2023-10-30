import AdminIcons from "@/admin/admin-snippet/admin-icons";
import Image from "next/image"
const Hero = () => {
    return(
        <div className="pb-[125px] md:py-[91px]  md:pb-[160px] w-full bg-[url(/assets/refer/refer-hero-bg-res.png)] md:bg-[url(/assets/refer/refer-hero-bg.png)] bg-bottom bg-cover">
            <div className="">
                <div className="container">
                    <div className="heroGrid grid lg:grid-cols-2  gap-4 " >
                        <div className="hero_left self-center max-w-[760px] w-full lg:order-1 order-2 px-[15px] md:px-0">
                            <div className="hero_Header relative inline-block">
                                <h2 className="xxl-heading text-banner-heading dark:text-d-banner-heading">Invite Friends Earn</h2>
                                <h2 className="xxl-heading text-banner-heading dark:text-d-banner-heading"><span className="text-primary">40%</span>Commission</h2>
                                <div className="absolute top-[118px] md:top-[-37px] right-[-93px] md:right-[-43px] max-w-[30px] md:max-w-[70px] w-full">
                                    <AdminIcons type="starIcon" hover={false} active={false} />
                                </div>
                            </div>

                            <div className="hero_body mt-5 md:mt-30 mb-[0px] md:mb-80 ">
                                <p className="text-banner-text dark:text-d-banner-text mb-40 md:mb-50">After your friends become a BitMart user you<br className="hidden md:block" />
can get commission</p>
                                <a href="#" className="solid-button max-w-full sm:max-w-[244px] w-full inline-block text-center">Register</a>
                            </div>
                            
                        </div>

                        <div className="hero_right w-full max-w-[820px] lg:flex lg:items-center order-1 lg:order-2">
                            <Image src="/assets/refer/hero-img.png" alt="Laptop-image" className="block w-full" width={653} height={500}/>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default Hero;
