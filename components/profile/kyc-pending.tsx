import React from 'react'
import IconsComponent from '../snippets/icons';
import Image from 'next/image';

interface fixSection {
  fixed?: boolean;
  show?: number;
  setShow?: Function | any;
  num?: number;
  session?: any;
}
const KycPending = (props: fixSection) => {
  return (
    <div className={` ${props.show == 4 && "!left-[50%]"} ${props.fixed
        ? " duration-300 p-5 md:p-40 fixed pt-[145px] top-0 left-[160%] translate-x-[-50%] bg-off-white dark:bg-black-v-1 z-[6] w-full h-full pb-[20px] lg:dark:bg-d-bg-primary "
        : "p-5 md:p-40  block"
      }} overflow-y-auto`}>
      {/* only for mobile view */}
      <div className="lg:hidden flex dark:shadow-none shadow-lg shadow-[#c3c3c317] fixed top-0 left-0  w-full  rounded-bl-[20px] rounded-br-[20px]  z-[6] dark:bg-omega bg-white  h-[105px]">
        <div className="grid grid-cols-[auto_1fr_auto] m-auto w-full px-[20px] items-center">
          <div
            onClick={() => {
              props.setShow(0);
            }}
          >
            <IconsComponent type="backIcon" hover={false} active={false} />
          </div>
          <div className="text-center">
            <p className="sec-title">KYC Verification</p>
          </div>

        </div>
      </div>
      <div className='flex items-center justify-between gap-20 mb-[46px]'>
        <p className="sec-title">KYC Verification</p>
        <div className='flex items-center gap-10'>
          <IconsComponent type="underProcess" hover={false} active={false} />
          <p className='nav-text-sm'>Under Process</p>
        </div>
      </div>
      <div>
        <p className='nav-text-lg !text-[18px] mb-[10px]'>Your KYC  is Under Process !</p>
        <Image src="/assets/kyc/kyc-under-process.jpg" alt='image-description' width={1047} height={691} className='max-w-full w-full' />
      </div>
    </div>
  )
}

export default KycPending;