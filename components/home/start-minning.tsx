import Image from 'next/image'
import React from 'react'
import ETH from '../../public/assets/home/etherium-bg.png';
import BitCoin from '../../public/assets/home/bitcoin-bg.png';
const StartMinning = () => {
  return (
    <section className='py-60 md:py-100 dark:bg-black-v-1'>
        <div className="container max-w-[1272px] px-20 py-60 lg:p-50 bg-primary lg:rounded-16 relative">
            <Image src={ETH} width={170} height={185} alt='error' className='absolute top-0 left-0' />
            <Image src={BitCoin} width={170} height={185} alt='error'  className='absolute bottom-0 right-0' />
            <div className='flex items-center flex-col lg:flex-row justify-between relative z-1'>
                <div className='max-w-full md:max-w-[368px] w-full text-center mb-[50px] lg:mb-0 lg:text-start'>
                    <h3 className='lg-heading mb-[17px] !text-white'>Start mining now</h3>
                    <p className='sec-text !text-white'>Join now with DYNAMIC to get the latest news and start mining now</p>
                </div>
                <div className='flex flex-col sm:flex-row items-center gap-[42px] max-w-full md:max-w-[598px] w-full justify-center lg:justify-end'>
                    <input type="text" placeholder='Enter your email' className='pb-[10px] sec-text text-white outline-none border-b border-[#ffffff66] bg-[transparent] max-w-[396px] w-full' />
                    <button type='submit' className='w-full sm:w-auto pill-solid-button '>Subscribe</button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default StartMinning