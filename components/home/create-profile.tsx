import React, { Fragment } from 'react'
import SectionHead from '../snippets/sectionHead'
import IconsComponent from '../snippets/icons';
import Link from 'next/link';

const CreateProfile = () => {
    
const headData = {
    title: 'Create Profile',
    subTitle: 'Easy Way to Get Started',
    brief: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown",
    spacing:true,
    Cta:true,
    hidden:true
};

const cardsData = [
    {
        "svgType":"addUser",
        "cardHeading":"Create an Account",
        "cardInfo":"Sign up with your email and mobile in just 5 minutes"
    },
    {
        "svgType":"verifyBank",
        "cardHeading":"Verify Bank Account",
        "cardInfo":"Verify Your Bank Account in Easy Way"
    },
    {
        "svgType":"fundsWallet",
        "cardHeading":"Add Funds to Wallet",
        "cardInfo":"Quickly add money to your investment wallet"
    },
    {
        "svgType":"tradingInstantly",
        "cardHeading":"Start Tranding Instantly",
        "cardInfo":"Buy & Sell a variety of top coins at the best prices"
    },
]
    return (
        <section className='md:py-[100px] py-[60px] dark:bg-omega bg-bg-secondary'>
            <div className='container'>
                <div className='flex items-center justify-between gap-[0px] lg:gap-[60px] flex-col lg:flex-row'>
                    <div className='max-w-full lg:max-w-[50%] w-full'>
                        <div className='max-w-full lg:max-w-[584px] w-full text-center md:text-start '>
                            <SectionHead headData={headData}  center={false} />
                        </div>
                    </div>
                    <div className='max-w-full lg:max-w-[50%] w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[30px] place-items-center lg:place-items-start bg-contain bg-no-repeat bg-center bg-[url("/assets/home/profileBg.webp")]'>
                            {
                                cardsData.map((elem,ind)=>{
                                    return(
                                    <Fragment key={ind}>
                                        <div className='dark:bg-black-v-1 bg-white card duration-300 hover:drop-shadow-xl  px-[30px] md:px-[20px] py-[30px] max-w-full lg:max-w-[330px] w-full md:text-center rounded-[10px] gap-[30px] md:gap-[50px] flex items-center md:block' key={ind}>
                                            <div className='max-w-[40px] w-full md:mx-auto mx-0'>
                                                <IconsComponent type={elem.svgType} hover={false}  active={false}/>
                                            </div>
                                            <div>
                                                <h4 className='sm-heading text-[14px] font-[700] md:text-[19px] dark:text-white md:mt-[15px] mb-[10px]'>{elem.cardHeading}</h4>
                                                <p className='sec-text text-[12px] dark:text-beta md:text-[18px]'>{elem.cardInfo}</p>
                                            </div>
                                        </div>
                                    </Fragment>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                
                <Link prefetch={false} href="/chart/BTCB" className='sec-Brief breief flex lg:hidden items-center gap-[10px] !text-primary mt-[50px] mx-auto text-center md:text-start justify-center'>
                    <span className='block relative !text-[18px] !leading-[24px] after:absolute after:w-full after:h-[2px] after:bg-primary hover:!text-white after:top-[100%] after:left-0'>Start Trading</span>
                    <IconsComponent type='rightArrow' hover={false} active={false}/>
                    
                </Link>
                
            </div>
        </section> 
    )
}

export default CreateProfile