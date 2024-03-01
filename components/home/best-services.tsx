import React, { Fragment } from 'react'
import SectionHead from '../snippets/sectionHead';
import IconsComponent from '../snippets/icons';

const BestServices = () => {
    const headData = {
        title: 'Benefits',
        subTitle: 'Our Best Service',
        brief: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown",
        spacing:false,
        Cta:false,
        hidden:false
    };
const cardsData = [
    {
        "svgType":"safetyLogo",
        "cardHeading":"Safty Comes First",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"easyDeposit",
        "cardHeading":"Easy Deposit & Withdrawls",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"lowCharges",
        "cardHeading":"Low Charges",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"BonusRefferal",
        "cardHeading":"Bonus & Refferal",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"FastTransactions",
        "cardHeading":"Fast Transactions",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"DeepEncryption",
        "cardHeading":"Deep Encryption ",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"FastKYC",
        "cardHeading":"Fast KYC",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
    {
        "svgType":"Support",
        "cardHeading":"24/7 Support",
        "cardInfo":"Lorem ipsum dolor sit amet, dui  consectetur adipiscing elit. Nibh aenean dui aliquet amet."
    },
]
  return (
    <section className='py-60 md:py-100'>
        <div className="container max-w-[1410px] w-full">
            <div className='max-w-[954px] w-full mx-auto text-center'>
                <SectionHead headData={headData}  center={true} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[20px] md:gap-[33px] mt-[50px] md:mt-[63px]'>
                {
                    cardsData.map((elem,ind)=>{
                        return(
                            <Fragment key={ind}> 
                                <div className='p-[28px] rounded-10 dark:bg-omega border border-grey dark:border-[transparent] flex items-center gap-[30px] sm:block duration-300 hover:drop-shadow-xl '>
                                    <div className='sm:mb-30 max-w-[60px] sm:max-w-[70px] w-full'>
                                        <IconsComponent type={elem.svgType} hover={false} active={false}/> 
                                    </div>
                                    <div>
                                        <h4 className='sm-heading text-[14px] md:text-[19px] dark:text-white mb-[10px]'>{ elem.cardHeading}</h4>
                                        <p className='sec-text text-[12px] text-body-primary md:leading-[22px] leading-[18px] dark:text-beta md:text-[16px]'>{elem.cardInfo}</p>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                }
               
            </div>
        </div>
    </section>
  )
}

export default BestServices;