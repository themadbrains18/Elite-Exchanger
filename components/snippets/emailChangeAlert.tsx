import Image from 'next/image'
import React from 'react'

interface changeProps{
    data:Object
}

const EmailChangeAlert = (props:changeProps) => {
    console.log("hi");
    
  return (
    <div className='p-6 fixed max-h-[calc(100%-124px)] overscroll-none	 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded-[10px] bg-white  z-[99] max-w-[calc(100%-36px)] md:max-w-[520px] w-full overflow-auto'>
            <div className='flex justify-center items-center mb-[16px]'>
                {/* <Image src={`/assets/profile/${props?.data?.img}`} alt="img" width={96} height={96}/> */}
                <Image src={`/assets/profile/security-medium.svg`} alt="img" width={96} height={96}/>
            </div>
            <p className='text-[16px] md:text-[20px] leading-4 md:leading-5 text-center mb-2'>Are You Sure You Want to Change Your Email Address?</p>
            <ul className='px-[6px] list-disc list-inside mt-6'> 
                <li className='text-[14px] leading-[22px] text-d-body-primary'>Withdrawals and P2P transactions will be disabled for 24 hours after changing your email verification to ensure the safety of your assets.</li>
                <li className='text-[14px] leading-[22px] text-d-body-primary'>The old email address cannot be used to re-register for 30 days after updating it.</li>
            </ul>
            <div className="flex items-center gap-10 mt-6">
                    <button
                        className="solid-button2 w-full"
                  
                    >
                        Cancel
                    </button>
                    <button
                        className="solid-button w-full"
                        // onClick={() => {
                        //     props.actionPerform();
                        // }}
                    >
                        Continue
                    </button>
                </div>

    </div>
  )
}

export default EmailChangeAlert