import Image from 'next/image';
import React, { Fragment } from 'react'
import secImgLight from '../../public/assets/home/trade-anywhare-light.png';
import secImgDark from '../../public/assets/home/trade-anywhare-dark.png';
import SectionHead from '../snippets/sectionHead';
import IconsComponent from '../snippets/icons';
const TradeAnyWhere = () => {
    const headData = {
        title: 'Download the app',
        subTitle: 'Trade Anywhere, Anytime',
        brief: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown",
        spacing:true,
        Cta:false,
        hidden:false
    };
    const cardsData = [
        {
            "svgType":"windows",
            "cardHeading":"Windows",
            "cardInfo":"Download PC-Client"
        },
        {
            "svgType":"appStore",
            "cardHeading":"App Store",
            "cardInfo":"Download on the"
        },
        {
            "svgType":"macOs",
            "cardHeading":"Mac OS",
            "cardInfo":"Download for the"
        },
        {
            "svgType":"googlePlay",
            "cardHeading":"Google Play",
            "cardInfo":"Get in on"
        }
    ]
  return (
    <section className='py-[60px] md:py-[100px] dark:bg-black-v-1'>
        <div className="container">
            <div className='flex items-center flex-col lg:flex-row gap-[50px] md:gap-[70px]'>
                <div className='max-w-full md:max-w-[554px] w-full'>
                    <div className='lg:hidden text-center'>
                        <SectionHead headData={headData}  center={false} />
                    </div>
                    <Image src={secImgLight} className='dark:hidden' alt='error' width={554} height={678} />
                    <Image src={secImgDark} className='hidden dark:block' alt='error' width={554} height={678} />
                </div>
                <div className='max-w-full w-full'>
                    <div className='lg:block hidden max-w-full lg:max-w-[600px] w-full'> 
                        <SectionHead headData={headData}  center={false} />
                    </div>
                    <div className='grid grid-cols-2 xl:grid-cols-4 gap-y-[30px] gap-[20px] md:gap-[30px]'>
                        
                        {
                            cardsData.map((elem,ind)=>{
                                return(
                                <Fragment key={ind}>
                                    <div className='dark:bg-omega bg-bg-secondary p-[20px] md:p-[35px] rounded-[10px] duration-300 hover:drop-shadow-xl max-w-full w-full lg:max-w-[330px]  text-center'>
                                        <div className='max-w-[40px] w-full mx-auto'>
                                            <IconsComponent type={elem.svgType} hover={false}  active={false}/>
                                        </div>
                                        <div>
                                            <h4 className='sm-heading text-[14px] font-[700] md:text-[19px] dark:text-white mt-[30px] md:mt-[40px] mb-[10px]'>{elem.cardHeading}</h4>
                                            <p className='sec-text text-[12px] dark:text-beta md:text-[14px]'>{elem.cardInfo}</p>
                                        </div>
                                    </div>
                                </Fragment>
                                )
                            })
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default TradeAnyWhere;