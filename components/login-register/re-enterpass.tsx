import Image from 'next/image';
import React, { useState } from 'react'

const ReEnterpass = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  return (
    <div className='mt-0 lg:mt-[80px] lg:p-0 p-5  max-w-[calc(100%-30px)] mx-auto lg:mx-0 lg:bg-[transparent] lg:dark:bg-[transparent] bg-white lg:rounded-none rounded-10 dark:bg-d-bg-primary md:max-w-[562px] w-full lg:mb-0 mb-[10px]'>
        <h1 className='lg-heading mb-5 lg:mb-[70px]'>Please Enter New password</h1>
        <form action="">
            <div className="relative mb-[15px]">
                <input type={`${show === true ? "text" : "password"}`}  name="password" placeholder="Password" className="input-cta w-full" />
                <Image
                src={`/assets/register/${show === true ? "show.svg" : "hide.svg"}`}
                alt="eyeicon"
                width={24}
                height={24}
                onClick={() => {
                    setShow(!show);
                }}
                className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                />
            </div>
            <div className="relative">
                <input type={`${show1 === true ? "text" : "password"}`} placeholder="Confirm Password"  name="confirmPassword" className="input-cta w-full" />
                <Image
                src={`/assets/register/${show1 === true ? "show.svg" : "hide.svg"}`}
                alt="eyeicon"
                width={24}
                height={24}
                onClick={() => {
                    setShow1(!show1);
                }}
                className="cursor-pointer absolute top-[50%] right-[20px] translate-y-[-50%]"
                />
            </div>
            <button type="submit" className="my-[30px] lg:my-[50px] solid-button w-full hover:bg-primary-600">Sign in</button>
        </form>
    </div>
  )
}

export default ReEnterpass;