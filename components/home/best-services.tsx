import React, { Fragment } from 'react'
import SectionHead from '../snippets/sectionHead';
import IconsComponent from '../snippets/icons';

const BestServices = () => {
    const headData = {
        title: 'Benefits',
        subTitle: 'Our Best Service',
        brief: '',
        spacing:false,
        Cta:false,
        hidden:false
    };
const cardsData = [
    {
        "svgType":"safetyLogo",
        "cardHeading":"Windows",
        "cardInfo":""
    },
    {
        "svgType":"easyDeposit",
        "cardHeading":"Easy Deposit & Withdrawls",
        "cardInfo":""
    },
    {
        "svgType":"lowCharges",
        "cardHeading":"Low Charges",
        "cardInfo":""
    },
    {
        "svgType":"BonusRefferal",
        "cardHeading":"Bonus & Refferal",
        "cardInfo":""
    },
    {
        "svgType":"FastTransactions",
        "cardHeading":"Fast Transactions",
        "cardInfo":""
    },
    {
        "svgType":"DeepEncryption",
        "cardHeading":"Deep Encryption ",
        "cardInfo":""
    },
    {
        "svgType":"FastKYC",
        "cardHeading":"Fast KYC",
        "cardInfo":""
    },
    {
        "svgType":"Support",
        "cardHeading":"24/7 Support",
        "cardInfo":""
    },
]
  return (
    <section className='py-60 md:py-100'>
        <div className="container">
            <div className='max-w-[954px] w-full mx-auto text-center'>
                <SectionHead headData={headData}  center={true} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[33px] mt-[50px] md:mt-[63px]'>
                {
                    cardsData.map((elem,ind)=>{
                        return(
                            <Fragment key={ind}> 
                                <div className='p-[28px] rounded-10 dark:bg-omega border border-grey dark:border-[transparent] flex items-center gap-[30px] sm:block duration-300 hover:drop-shadow-xl '>
                                    <div className='sm:mb-30 max-w-[60px] sm:max-w-[70px] w-full'>
                                        <IconsComponent type={elem.svgType} hover={false} active={false}/> 
                                    </div>
                                    <div>
                                        <h4 className='sm-heading text-[14px] font-[700] md:text-[19px] dark:text-white sm:mt-[15px] mb-[10px]'>{ elem.cardHeading}</h4>
                                        <p className='sec-text text-[12px] dark:text-beta md:text-[16px]'>{elem.cardInfo}</p>
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