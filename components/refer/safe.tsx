import Image from 'next/image'
import React from 'react'

const Safe = () => {
  return (
<section className='py-40 md:py-[100px] bg-[#F4F9FC] dark:bg-[#121318]'>
    <div className='container flex gap-30 justify-between items-center flex-col md:flex-row'>
        <Image src='/assets/refer/referSafe.png' width={487} height={529} alt="refr-safe-sction"/>
        <div className='max-w-[584px] w-full'>
            <p className='text-lg leading-6 font-normal text-primary  mb-[10px] md:mb-[15px]'>Friends</p>
            <p className='sec-subTitle dark:!text-white !text-black pb-[15px] md:pb-[30px]'>Your Friends Are Safe with us</p>
            <p className='info-14-18 pb-30 md:pb-12'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown</p>
            <p className='underline text-primary text-lg leading-6 font-normal'>Learn More</p>
        </div>
    </div>

</section>
  )
}

export default Safe