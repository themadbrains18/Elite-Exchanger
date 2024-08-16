import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import clickOutSidePopupClose from './clickOutSidePopupClose'

interface changeProps {
    setShow: Function
    setEnable: Function
    setShow2: Function
}

const EmailChangeAlert = (props: changeProps) => {

    const closePopup = () => {
        props?.setShow2(false);
        props.setEnable(0);
    }
    const wrapperRef = useRef(null);
    clickOutSidePopupClose({ wrapperRef, closePopup });

    return (
        <div ref={wrapperRef} className='p-5 md:p-40  fixed max-h-[calc(100%-124px)] overscroll-none	 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded-[10px] bg-white dark:bg-omega
          z-[99] max-w-[calc(100%-36px)] md:max-w-[520px] w-full overflow-auto'>
            <div className='flex justify-center items-center mb-[16px]'>
                {/* <Image src={`/assets/profile/${props?.data?.img}`} alt="img" width={96} height={96}/> */}
                <Image src={`/assets/profile/security-medium.svg`} alt="img" width={96} height={96} />
            </div>
            <p className='text-[16px] md:text-[20px] dark:text-white leading-4 md:leading-5 text-center mb-2'>Are You Sure You Want to Change Your Email Address?</p>
            <ul className='px-[6px] list-disc list-inside mt-6'>
                <li className='text-[14px] leading-[22px] text-d-body-primary list-outside'>Withdrawals and P2P transactions will be disabled for 24 hours after changing your email verification to ensure the safety of your assets.</li>
                {/* <li className='text-[14px] leading-[22px] text-d-body-primary list-outside'>The old email address cannot be used to re-register for 30 days after updating it.</li> */}
            </ul>
            <div className="flex items-center gap-10 mt-6">
                <button
                    className="solid-button2 w-full"
                    onClick={() => {
                        props?.setShow2(false);
                        props.setEnable(0);
                    }}
                >
                    Cancel
                </button>
                <button
                    className="solid-button w-full"
                    onClick={() => {
                        props.setShow(false);
                    }}
                >
                    Continue
                </button>
            </div>

        </div>
    )
}

export default EmailChangeAlert