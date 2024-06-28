import React, { useEffect, useState } from 'react'
import IconsComponent from './icons';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface dataList {
  data?: any;
  placeholder?: string;
  auto?: boolean;
  widthFull?: boolean;
  onNetworkChange?: any;
  onDocumentChange?: any;
  value?: string;
  type?: any;
  onPaymentMethodChange?: any;
  onTimeChange?: any;
  dropdown?: any;
  depositToken?: any;
  setUnSelectCoinError?:any;
}

const FiliterSelectMenu = (props: dataList) => {


  const [show, setShow] = useState(false);
  const [active, setActive] = useState(props.value);

  useEffect(() => {
    setActive(props?.value)

    document.addEventListener('click', (evt: any) => {
      let dropdown = document.querySelector('.coin-dropdown');
      let targetEl = evt?.target?.parentNode?.parentElement; // clicked element
      if (evt?.target.nodeName === 'svg') {
        targetEl = evt?.target?.parentNode?.parentNode
      }
      if (targetEl?.classList.contains('coin-dropdown') === false) {
        setShow(false);
      }
    })
  }, [props.value])

  return (
    <>
      <div className={`relative max-w-full ${props.widthFull ? 'max-w-full' : 'lg:max-w-[300px]'} w-full ${props.auto && 'mx-auto'}`}>
        {/* top dropdown input */}
        <div className={`border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[${props.type === 'express' ? '15px' : '8px'}] px-[15px]`} onClick={() => {
          if(props.onNetworkChange && props.depositToken === undefined && props?.setUnSelectCoinError!==undefined){
            props?.setUnSelectCoinError('Please select any coin first')
            return
          }
          else{
            setShow(!show)
          }
          
        }}>
          <div className="coin-dropdown flex items-center gap-10 cursor-pointer justify-between" >
            <div className='w-full'>
              <input type="text" id='paymentMethod' className="sm-text max-w-none placeholder:dark:text-white dark:bg-d-bg-primary  bg-[transparent] pr-0 outline-none bg-transparent w-full  cursor-pointer dark:!text-white"
                placeholder={`${active ? active : props.placeholder}`} readOnly value={active} />
            </div>
            <div className={`pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] cursor-pointer `}>
              <IconsComponent type="downArrow" hover={false} active={false} rotate={show} />
            </div>
          </div>
        </div>

        {/* dropdown */}
        {/* dropdown */}
        {props.type !== 'pmethod' && props?.data && props?.data.length > 0 &&
          <div className={`absolute z-[1] shadow-lg shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] duration-300 ${show ? "top-[calc(100%+7px)] opacity-1 visible" : "top-[calc(100%+17px)] opacity-0 invisible"}`}>
            <ul>
              {props?.data && props?.data.length > 0 && props?.data.map((item: any, index: number) => {
                return (
                  <li key={index} onClick={() => { setActive(item?.fullname); setShow(false); props.onNetworkChange && props.onNetworkChange(item); props.onDocumentChange && props.onDocumentChange(item) }}>
                    <p className={`sm-text px-10 py-[7px] rounded-[5px] hover:bg-grey dark:hover:bg-d-bg-primary cursor-pointer dark:!text-d-nav-secondary  !text-banner-text`}>{item?.fullname}</p>
                  </li>
                )
              })}

            </ul>
          </div>
        }

        {(props.type === 'pmethod' || props.type === 'express') &&

          <div className={`absolute z-[1] shadow-lg shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] duration-300 ${show ? "top-[calc(100%+7px)] opacity-1 visible" : "top-[calc(100%+17px)] opacity-0 invisible"}`}>
            <ul>
              {props?.data && props?.data.map((item: any, index: number) => {
                return (
                  <li key={index} className='flex justify-between items-center hover:bg-grey dark:hover:bg-d-bg-primary cursor-pointer' onClick={() => { setActive(item?.payment_method); setShow(false); props.onPaymentMethodChange(item?.id) }}>
                    <p className={`sm-text px-10 py-[7px] rounded-[5px] hover:bg-grey dark:hover:bg-d-bg-primary cursor-pointer dark:!text-d-nav-secondary  !text-banner-text`}>{item?.payment_method}</p>
                    {props.type === 'pmethod' || props.type === 'express' && item?.icon !== undefined &&
                      <Image src={item?.icon} alt="payment_method" width={20} height={20} />
                    }
                  </li>
                )
              })}

            </ul>
          </div>
        }

        {props.type === 'stake' &&
          <div className={`absolute z-[1] shadow-lg shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] duration-300 ${show ? "top-[calc(100%+7px)] opacity-1 visible" : "top-[calc(100%+17px)] opacity-0 invisible"}`}>
            <ul>
              {props?.data && props?.data.map((item: any, index: number) => {
                return (
                  <li key={index} onClick={() => { setActive(item?.value); setShow(false); props.onTimeChange(item?.value, props.dropdown) }}>
                    <p className={`sm-text px-10 py-[7px] rounded-[5px] hover:bg-grey dark:hover:bg-d-bg-primary cursor-pointer dark:!text-d-nav-secondary  !text-banner-text`}>{item?.label}</p>
                  </li>
                )
              })}

            </ul>
          </div>
        }
        {/* userstaking */}
        {props.type === 'userstaking' &&
          <div className={`absolute z-[1] shadow-lg shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] duration-300 ${show ? "top-[calc(100%+7px)] opacity-1 visible" : "top-[calc(100%+17px)] opacity-0 invisible"}`}>
            <ul>
              {props?.data && props?.data.map((item: any, index: number) => {
                return (
                  <li key={index} onClick={() => { setActive(item?.time); setShow(false); props.onTimeChange(item) }}>
                    <p className={`sm-text px-10 py-[7px] rounded-[5px] hover:bg-grey dark:hover:bg-d-bg-primary cursor-pointer dark:!text-d-nav-secondary  !text-banner-text`}>{item?.time}</p>
                  </li>
                )
              })}

            </ul>
          </div>
        }

      </div>
    </>
  )
}

export default FiliterSelectMenu;