import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react'

const RecentPosts = () => {
    let gridCards = [1,1,1,1];

  return (
    <section className='py-[60px] md:py-[100px] bg-bg-secondary dark:bg-omega'>
        <div className="container">
            <div className='mb-[30px] max-w-[721px] w-full'>
                <h1 className='sec-title !text-[19px] md:!text-[28px] md:mb-[15px] mb-[10px]'>Recent Posts</h1>
                <p className='info-16-18 dark:!text-beta !text-[12px] md:!text-[16px] !leading-[18px] md:!leading-[24px] '></p>
            </div>
            <div className='grid lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2  grid-cols-1 gap-[30px]'>
                {
                    gridCards.map((elem,ind)=>{
                        return(
                            <Fragment key={ind}>
                                <div className='rounded-[10px] duration-300 dark:bg-black bg-white rounded-t-[30px]  dark:hover:shadow-none dark:shadow-none hover:shadow-[0px_1.3px_4.1px_0px_#d2d0e1] max-[767px]:shadow-[0px_1.3px_4.1px_0px_#d2d0e1] max-[767px]:shadow-[0px_0px_44px_0px_#0000000d]'>
                                    <div>
                                        <Image src="/assets/news/news-card-img.png" alt="error" width={523} height={310} className='w-full' />
                                    </div> 
                                    <div className='p-[15px] pb-[20px] md:p-[24px]'>
                                        <div className='flex items-center gap-30 justify-between mb-[15px] md:mb-[24px]'>
                                            <p className='sec-title !text-primary !text-[16px]'>Product</p>
                                            <p className='sec-title !text-beta md:!text-[16px] !text-[14px]'>Sep 12, 2023</p>
                                        </div>
                                        <h3 className='sec-title md:mb-20 mb-[15px]'>Learn about UI8 coin and earn an All-Access Pass</h3>
                                        <p className='info-14-18 !text-[14px] md:!text-[16px]'></p>
                                        <Link href="/detail" className='sec-Brief flex  items-center gap-[10px] !text-primary md:mt-[30px] mt-[20px]'>
                                            <span className='block relative after:absolute after:w-full after:h-[2px] after:bg-primary after:top-[100%] after:left-0'>Read More</span>
                                        </Link>
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

export default RecentPosts