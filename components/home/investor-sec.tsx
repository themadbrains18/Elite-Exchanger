import React, { Fragment } from 'react';
import Image from 'next/image';


const InvestorSec = () => {
    const investorData = [
        {
            "investorLogo":"investorLogo4.png"
        },
        {
            "investorLogo":"investorLogo5.png"
        },
        {
            "investorLogo":"investorLogo6.png"
        },
        {
            "investorLogo":"investorLogo4.png"
        },
        {
            "investorLogo":"investorLogo5.png"
        },
        {
            "investorLogo":"investorLogo6.png"
        }
    ]
  return (
    <>
        <section className="investor-sec py-40 md:py-100 bg-bg-secondary dark:bg-d-bg-primary">
            <div className="container">
                <div className='capitalize text-center sec-title'>Backed By Investors</div>
                <div className='flex py-40 md:pt-50 gap-5 justify-between align-middle flex-wrap'>
                {
                    investorData.map((elem,ind)=>{
                        return(
                        <Fragment key={ind}>
                            <Image src={`/assets/home/${elem.investorLogo}`}  alt='logo' width={153} height={40} className='md:max-w-[153px] max-w-[140px] w-full'  />
                        </Fragment>
                        )
                    })
                }

                </div>
            </div>
        </section>
    </>
  )
}

export default InvestorSec