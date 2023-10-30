import React from 'react'
import SectionHead from '../snippets/sectionHead';
import Image from 'next/image';

const NewsHero = () => {
    const headData = {
        title: 'NEWS',
        subTitle: 'Stay informed about our news',
        brief: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown',
        spacing:true,
        Cta:false,
        hidden:false
    };
  return (
    <section className='md:py-[100px] py-[60px] bg-bg-primary dark:bg-omega'>
        <div className="container">
            <div className='max-w-[991px] w-full mx-auto text-center'>
                <SectionHead headData={headData}  center={true} />
                <div className="w-full flex gap-[10px] max-w-[800px] mx-auto rounded-[30px] bg-primary-100  py-[13px] px-[10px] md:mb-[48px] mb-[30px]">
                    <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
                    <input type="search" placeholder="Search" className="nav-text-sm !text-black outline-none bg-[transparent] w-full" />
                </div>
                <div className='overflow-x-auto filter-wrapper'>
                    <div className='flex items-center md:gap-30 gap-20 justify-center w-full min-w-[543px]'>
                        <button className='info-14-18 dark:hover:!text-white hover:!text-black'>What's Trending</button>
                        <button className='info-14-18 dark:hover:!text-white hover:!text-black'>Market Updates</button>
                        <button className='info-14-18 dark:hover:!text-white hover:!text-black'>Product News</button>
                        <button className='info-14-18 dark:hover:!text-white hover:!text-black'>Company News</button>
                        <button className='info-14-18 dark:hover:!text-white hover:!text-black'>Events</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default NewsHero;