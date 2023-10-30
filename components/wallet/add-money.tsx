import Image from 'next/image';
import React, { useState } from 'react'
import IconsComponent from '../snippets/icons';
import ChoosePaymentMethods from './choose-payment-methods';


interface DynamicId {
  newId: number;
  show:boolean;
  setShow:Function;
}


const AddMoney = (props:DynamicId) => {
  const [show,setShow] = useState(false);

  return (
    <div className='p-20 md:p-40 rounded-10 bg-white dark:bg-d-bg-primary'>
      <div className='flex items-center gap-[10px] mb-[40px] justify-between'>
        <p className="lg:text-[23px] text-[18px] leading-7 font-medium  dark:text-white">Select Currency and Payment</p>
        {/* <div className='flex items-center gap-[10px] justify-center' onClick={()=>{props.setShow(false)}}>
          <IconsComponent type='close' hover={false} active={false} />
        </div> */}
      </div>
        {/* select currency */}
        <div className='mb-[20px]'>
            <p className='sm-text mb-10 dark:text-white'>Select Currency</p>    
            <div className='border border-grey-v-1 dark:border-opacity-[15%] p-[15px] rounded-[5px] flex items-center justify-between cursor-pointer'>
                <div className='flex items-center gap-[5px]'>
                  <Image src="/assets/currencies/Coin.png" className='dark:block hidden' width={24} height={24} alt="arrow" />
                  <Image src="/assets/currencies/Coin-light.png" className='dark:hidden' width={24} height={24} alt="arrow" />
                  <p className='sm-text dark:!text-white'>USD</p>
                </div>
                <div>
                  <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="arrow" />
                </div>
            </div>
        </div>
        
        {/* Amount */}
        <div className='mb-[40px]'>
            <p className='sm-text mb-10 dark:text-white'>Amount</p>    
            <input type='number' className='border border-grey-v-1 dark:border-opacity-[15%] p-[15px] rounded-[5px] cursor-pointer   w-full focus:outline-none nav-text-lg dark:bg-d-bg-primary' placeholder='$30,255.22' />
        </div>


        {/* Choose payment methods */}
        <div>
          <p className='sm-text mb-20  text-delta'>Choose Payment method:</p>    
          <ChoosePaymentMethods id={0} newId={props.newId} />
        </div>


        <button className='solid-button w-full mt-40'>Add money</button>

    </div>
  )
}

export default AddMoney;