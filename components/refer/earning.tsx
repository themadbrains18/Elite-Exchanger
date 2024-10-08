import Link from 'next/link'
import React from 'react'

const Earning = () => {
  return (
    <section className='py-40 md:py-[100px]'>
        <div className='container bg-[url("/assets/refer/earning-mobile-bg.svg")] md:bg-[url("/assets/refer/earning-bg.svg")] bg-no-repeat py-40 md:py-[50px] flex flex-col justify-center items-center bg-cover rounded-none md:rounded-[30px] overflow-hidden'>
            <p className='sec-subTitle text-center text-white mb-20'>Start Earning Now</p>
            <p className='max-w-[593px] sec-text text-white text-center w-full mx-auto mb-40 md:mb-50'> </p>
            <Link href='/login' prefetch={false} className='solid-button2 bg-white text-center max-w-[244px] w-full'>Sign In</Link>
        </div>

    </section>
  )
}

export default Earning