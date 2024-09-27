import React, { useContext, useRef, useState } from 'react'
import Context from '../contexts/context';
import Image from 'next/image';
import IconsComponent from './icons';
import { toast } from 'react-toastify';
import Link from 'next/link';
import clickOutSidePopupClose from './clickOutSidePopupClose';


interface activeSection {
  setShow: Function;
  session: any;
  referEvent?: string;
}

const ReferPopup = (props: activeSection) => {
  const { mode } = useContext(Context);
  const [disable,setDisabled] = useState(false) 
  const [disable2,setDisabled2] = useState(false) 
  // let icons=['whatsapp','fb','twitter','download','telegram','instagram'];
  let icons = [
    {
      iconName: "whatsapp",
      iconLink: "https://web.whatsapp.com/"
    },
    {
      iconName: "fb",
      iconLink: "https://www.facebook.com/"
    },
    {
      iconName: "twitter",
      iconLink: "https://twitter.com/"
    },
    {
      iconName: "download",
      iconLink: "#"
    },
    {
      iconName: "telegram",
      iconLink: "https://web.telegram.org/a/"
    },
    {
      iconName: "instagram",
      iconLink: "https://www.instagram.com/"
    },
  ]

  const closePopup = () => {
    props?.setShow(false);
  }
  const wrapperRef = useRef(null);
  clickOutSidePopupClose({ wrapperRef, closePopup });
  return (
    <div className={`duration-300 max-w-[calc(100%-30px)] md:max-w-[562px] w-full p-5 md:p-40 z-10 fixed rounded-10 bg-white dark:bg-omega top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}>
      <div className="flex items-center justify-between mb-40">
        <p className="sec-title">Refer a Friend and Get Free Products</p>
        <svg
          onClick={() => {
            props.setShow(false);
          }}
          enableBackground="new 0 0 60.963 60.842"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 60.963 60.842"
          xmlSpace="preserve"
          className="max-w-[18px] cursor-pointer w-full"
        >
          <path
            fill={mode === "dark" ? "#fff" : "#000"}
            d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                              c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                              l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                              l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                              C61.42,57.647,61.42,54.687,59.595,52.861z"
          />
        </svg>
      </div>
      <div className='pb-40 border-b-[0.5px]  border-grey-v-2 dark:border-[#e9eaf026] '>
        <Image src='/assets/refer/giftbox.png' width={136} height={179} alt="giftbox" className='mx-auto mb-30' />
        <p className='text-center sec-title !font-normal !text-gamma mb-20'>Your unique referral link:👇</p>

        <div className=" w-full mb-[15px]">
          <label className="sm-text">Lite Referral ID</label>
          <div className="mt-[5px] lg:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
            <p className="sec-text text-gamma">{props?.session?.user?.refer_code}</p>
            <button className={`solid-button py-2 sec-text font-normal ${disable && "cursor-not-allowed"}`} disabled={disable} onClick={() => {
              // navigator.clipboard.writeText(props?.session?.user?.refer_code);
              setDisabled(true)
              const input = document.createElement('textarea')
              input.value = props?.session?.user?.refer_code
              document.body.appendChild(input)
              input.select()
              document.execCommand('copy')
              document.body.removeChild(input)
              toast.success('copy to clipboard', {autoClose:2000})
              setTimeout(()=>{
                setDisabled(false)
              },3000)
            }}>
              Copy
            </button>
          </div>
        </div>
        <div className=" w-full">
          <label className="sm-text mb-[10px]">Lite Referral Link</label>
          <div className="mt-[5px] lg:mt-[10px] items-center flex justify-between gap-[10px] border rounded-5 border-grey-v-1 dark:border-opacity-[15%] py-2 px-[15px]">
            <p className="sec-text text-gamma">{`http://...?r=${props?.session?.user?.refer_code}&e=${props.referEvent}`}</p>
            <button className={`solid-button py-2 sec-text font-normal ${disable2 && "cursor-not-allowed"}`} disabled={disable2} onClick={() => {
              // navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/register?r=${props?.session?.user?.refer_code}&e=${props.referEvent}`);
              setDisabled2(true)
              const input = document.createElement('textarea')
              input.value = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/register?r=${props?.session?.user?.refer_code}&e=${props.referEvent}`
              document.body.appendChild(input)
              input.select()
              document.execCommand('copy')
              document.body.removeChild(input)
              toast.success('copy to clipboard', {autoClose:2000})
              setTimeout(()=>{
                setDisabled2(false)
              },3000)
            }}>
              Copy
            </button>
          </div>
        </div>
      </div>
      <div className='pt-40 flex gap-[15px] items-center justify-center'>
        {
          icons?.map((item: any, index: number) => {
            return (
              <div key={index} className='bg-primary-100 dark:bg-black rounded-full min-w-[32px] md:min-w-[48px] min-h-[32px] md:min-h-[48px] flex'>
                <div className='max-w-[14px] md:max-w-[24px] w-full m-auto'>
                  <Link prefetch={false} href={item.iconLink} target='_blank'>
                    <IconsComponent type={item.iconName} hover={false} active={false} />
                  </Link>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default ReferPopup