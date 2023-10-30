import React from 'react';
import Image from 'next/image';

const RevenueRsources = () => {
  return (
    <>
        <div className='w-full'>
            <Image src="/assets/admin/graph-one.svg" alt="img-description" width={327} height={397} className=' w-full dark:block hidden' />
            <Image src="/assets/admin/graph-one-light.svg" alt="img-description" width={327} height={397} className=' w-full dark:hidden block' />

            <Image src="/assets/admin/Distribution.svg" alt="img-description"  width={327} height={397}  className=' w-full mt-[24px] dark:block hidden'/>
            <Image src="/assets/admin/Distribution-light.svg" alt="img-description"  width={327} height={397}  className=' w-full mt-[24px] dark:hidden block'/>


            <Image src="/assets/admin/Suported.svg" alt="img-description"  width={327} height={397}  className=' w-full mt-[24px]  dark:block hidden'/>
            <Image src="/assets/admin/Suported-light.svg" alt="img-description"  width={327} height={397}  className=' w-full mt-[24px] dark:hidden block'/>
        </div>
    </>
  )
}

export default RevenueRsources;