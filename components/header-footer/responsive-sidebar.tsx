import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import Avtar from '../../public/assets/header/Avatar.png';

import Link from 'next/link';
import IconsComponent from '../snippets/icons';
import LanguageCurrency from '../snippets/language-currency';
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface defaultStates {
  showMenu: boolean;
  setShowMenu: Function;
  session: {
    user: any
  },
  userDetail?: any;
  spotTrade?: any;
  futureTrade?: any;
}

const ResponsiveSidebar = (props: defaultStates) => {

  const { status, data: session } = useSession();
  const router = useRouter();

  const [profileImg, setProfileImg] = useState('');

  const ResponsivelinkList = [

    {
      "name": "Buy Crypto",
      "url": "/p2p/buy",
      "svgType": "marketIcon",

    },
    {
      "name": "Market",
      "url": "/market",
      "svgType": "marketIcon",

    },
    {
      name: "Trades",
      url: "#",
      dropdown: true,
      "svgType": "marketIcon",
      rotateIcon: true
    },
    {
      name: "Derivatives",
      url: "#",
      dropdown: true,
      "svgType": "marketIcon",
      rotateIcon: true
    },

  ]
  const showLists = useRef<HTMLDivElement>(null);

  function showList() {
    if (showLists.current) {
      showLists.current.classList.toggle("show")
      if (showLists.current.classList.contains("show")) {

        let showListsHeight = showLists.current.scrollHeight;
        showLists.current.setAttribute("style", `height:${showListsHeight}px`);
      } else {
        showLists.current.removeAttribute("style");

      }
    }
  }

  const handleProfiledpChange = async (e: any) => {

    if (status === 'unauthenticated') {
      toast.error('Your session is expired. You are auto redirect to login page!!');
      setTimeout(() => {
        signOut();
      }, 3000);
      return;
    }

    let files = e.target.files[0];
    if (files) {
      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = async function (e: any) {
        setProfileImg(reader.result as string);

        var formData = new FormData();
        formData.append("image", files);

        let response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/profile/dp`,
          {
            method: "POST",
            headers: {
              "Authorization": session?.user?.access_token
            },
            body: formData,
          }
        ).then((response) => response.json());

      }.bind(this);
    }

  };



  // useEffect(()=>{

  // },[])

  function setDropdownHeight(e: any) {
    // console.log(e.currentTarget);
    // set false to nav menu when click on nested items in dropdown
    let nextSibling = e.currentTarget?.nextElementSibling;
    if (nextSibling) {
      let nextSiblingLinks = nextSibling?.querySelectorAll('a');
      for (let i of nextSiblingLinks) {
        i.addEventListener("click", () => {
          props.setShowMenu(false)
        })
      }
    }

    // set height to dropdown

    if (nextSibling) {

      props.setShowMenu(true);
      e.currentTarget.classList.toggle("show");
      let siblingHeight = nextSibling?.scrollHeight;

      if (e.currentTarget.classList.contains("show")) {
        nextSibling?.setAttribute("style", `height:${siblingHeight}px`);
        // e.currentTarget.classList.remove("show");
      } else {
        nextSibling?.removeAttribute('style');
      }

    } else {
      props.setShowMenu(false)
    }
  }

  return (

    <div className={` ${props.showMenu ? "opacity-1 visible" : "opacity-0 invisible"} duration-300 fixed ${router.pathname.includes("/future") ? 'top-[57px]' : 'top-[100px]'} left-0 w-full h-full min-h-[100vh] overflow-y-auto bg-off-white dark:bg-black-v-1 py-[40px] px-[15px] pb-[120px] z-[2]`}>
      <div className='bg-white dark:bg-d-bg-primary p-[20px] rounded-[10px]'>
        <div className='flex items-center gap-[15px] cursor-pointer pb-[23px] border-b border-[#E9EAF0] dark:border-[#e9eaf00f] mb-[30px] relative' onClick={() => { props.setShowMenu(false) }}>
          <div className='relative inline-block clip-bg'>
            <Image src={props.userDetail !== null && props.userDetail?.messgae === undefined ? process.env.NEXT_PUBLIC_APIURL + "/dp/" + props.userDetail?.image : Avtar} alt='error' width={64} height={64} className='rounded-full object-cover object-top w-[50px] h-[50px]' />
          </div>
          <div>
            <p className='nav-text-lg'>{props.userDetail !== null && props.userDetail?.messgae === undefined && props.userDetail?.fName !== null ? (props.userDetail?.fName + ' ' + props.userDetail?.lName) : props?.session?.user?.name}</p>
            <p className='nav-text-lg !text-gamma '>{props.userDetail !== null && props.userDetail?.messgae === undefined && props.userDetail?.dName !== null ? (props?.userDetail?.dName) : props?.session?.user?.email}</p>
          </div>
          <Link href="/profile" className='absolute top-0 left-0 right-0 h-full'></Link>
        </div>
        {/* responsive nav bar */}
        <div>
          <nav>
            <ul className=''>
              {
                ResponsivelinkList.map((elem, index) => {
                  return (
                    <li key={index} className='flex flex-col items-center justify-between mb-[36px] last:mb-0 relative' >
                      <div className='flex items-center justify-between w-full dropdownCta' onClick={(e) => { setDropdownHeight(e) }}>
                        <div className='flex items-center gap-[15px]'>
                          <IconsComponent type={elem.svgType} hover={false} active={false} />
                          <Link href={elem.url} className='md-text !text-[16px] dark:text-d-nav-primary text-nav-primary'>{elem.name}</Link>
                        </div>

                        <svg
                          className={`${elem.rotateIcon && 'rotate-[90deg]'}`}
                          width={7}
                          height={12}
                          viewBox="0 0 7 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.303884 9.73692C0.000451519 10.1004 0.0501666 10.6404 0.4136 10.9438C0.777033 11.2472 1.3179 11.1975 1.62047 10.8341L5.90624 6.54831C5.94053 6.50802 5.95681 6.46002 5.98253 6.41545C6.0031 6.38031 6.0271 6.34945 6.04253 6.31088C6.08196 6.21059 6.1051 6.10602 6.1051 5.99973C6.1051 5.89345 6.08196 5.78887 6.04253 5.68858C6.0271 5.65001 6.0031 5.61916 5.98253 5.58401C5.95681 5.53944 5.94053 5.49144 5.90624 5.45115L1.62047 1.16538C1.3179 0.801093 0.777033 0.752236 0.4136 1.05567C0.0501662 1.35824 0.000451161 1.89825 0.303884 2.26254L3.41792 5.14258L4.275 5.99965L3.41585 6.85881L0.303884 9.73692Z"
                            fill="#9295A6"
                          />
                        </svg>


                      </div>
                      {elem?.dropdown && elem.name == 'Trades' &&
                        <div className="duration-300 w-full max-w-full mobileDropdown h-0 overflow-hidden rounded-[12px] dark:bg-omega bg-white px-[15px]">
                          <ul>
                            {props?.spotTrade?.map((item: any, nesIndex: any) => {
                              return (
                                <li key={nesIndex} className="mb-[10px]">
                                  <Link href={`/chart/${item?.tradePair?.symbolOne}`} className='block'>
                                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                                      <Image src={`${item.image}`} width={30} height={30} alt="coins" />
                                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                        <p className="info-14-18 dark:text-white">{item?.tradePair?.symbolOne}/{item?.tradePair?.symbolTwo}</p>
                                        <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.tradePair?.symbolOne}{item?.tradePair?.symbolTwo}</p>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>

                        </div>
                      }
                      {elem?.dropdown && elem.name == 'Derivatives' &&
                        <div className="duration-300 w-full max-w-full mobileDropdown h-[0px] overflow-hidden rounded-[12px] dark:bg-omega bg-white px-[15px]">
                          <ul>
                            {props?.futureTrade?.map((item: any, nesIndex: any) => {
                              return (
                                <li key={nesIndex} className="mb-[10px]">
                                  <Link href={`/future/${item?.futureTradePair?.coin_symbol}${item?.futureTradePair?.usdt_symbol}`} className='block'>
                                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                                      <Image src={`${item.image}`} width={30} height={30} alt="coins" />
                                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                        <p className="info-14-18 dark:text-white">{item?.futureTradePair?.coin_symbol}{item?.futureTradePair?.usdt_symbol}</p>
                                        <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.futureTradePair?.coin_symbol}{item?.futureTradePair?.usdt_symbol}</p>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>

                        </div>
                      }

                    </li>
                  )
                })
              }
              {props.session &&
                <>
                  <li key="Trade" className='flex items-center justify-between mb-[36px] last:mb-0 relative' onClick={() => { props.setShowMenu(false) }}>
                    <div className='flex items-center gap-[15px]'>
                      <IconsComponent type='TradeHistory' hover={false} active={false} />
                      <Link href="/history" className='md-text !text-[16px] dark:text-d-nav-primary text-nav-primary'>Trade History</Link>
                    </div>
                    <svg
                      width={7}
                      height={12}
                      viewBox="0 0 7 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.303884 9.73692C0.000451519 10.1004 0.0501666 10.6404 0.4136 10.9438C0.777033 11.2472 1.3179 11.1975 1.62047 10.8341L5.90624 6.54831C5.94053 6.50802 5.95681 6.46002 5.98253 6.41545C6.0031 6.38031 6.0271 6.34945 6.04253 6.31088C6.08196 6.21059 6.1051 6.10602 6.1051 5.99973C6.1051 5.89345 6.08196 5.78887 6.04253 5.68858C6.0271 5.65001 6.0031 5.61916 5.98253 5.58401C5.95681 5.53944 5.94053 5.49144 5.90624 5.45115L1.62047 1.16538C1.3179 0.801093 0.777033 0.752236 0.4136 1.05567C0.0501662 1.35824 0.000451161 1.89825 0.303884 2.26254L3.41792 5.14258L4.275 5.99965L3.41585 6.85881L0.303884 9.73692Z"
                        fill="#9295A6"
                      />
                    </svg>
                    <Link href="/history" className='absolute top-0 left-0 right-0 h-full'></Link>
                  </li>
                  <li key="Wallet" className='flex items-center justify-between mb-[36px] last:mb-0 relative' onClick={() => { props.setShowMenu(false) }}>
                    <div className='flex items-center gap-[15px]'>
                      <IconsComponent type='TradeHistory' hover={false} active={false} />
                      <Link href="/wallet" className='md-text !text-[16px] dark:text-d-nav-primary text-nav-primary'>Wallet</Link>
                    </div>
                    <svg
                      width={7}
                      height={12}
                      viewBox="0 0 7 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.303884 9.73692C0.000451519 10.1004 0.0501666 10.6404 0.4136 10.9438C0.777033 11.2472 1.3179 11.1975 1.62047 10.8341L5.90624 6.54831C5.94053 6.50802 5.95681 6.46002 5.98253 6.41545C6.0031 6.38031 6.0271 6.34945 6.04253 6.31088C6.08196 6.21059 6.1051 6.10602 6.1051 5.99973C6.1051 5.89345 6.08196 5.78887 6.04253 5.68858C6.0271 5.65001 6.0031 5.61916 5.98253 5.58401C5.95681 5.53944 5.94053 5.49144 5.90624 5.45115L1.62047 1.16538C1.3179 0.801093 0.777033 0.752236 0.4136 1.05567C0.0501662 1.35824 0.000451161 1.89825 0.303884 2.26254L3.41792 5.14258L4.275 5.99965L3.41585 6.85881L0.303884 9.73692Z"
                        fill="#9295A6"
                      />
                    </svg>
                    <Link href="/wallet" className='absolute top-0 left-0 right-0 h-full'></Link>
                  </li>
                  <li key="WatchList" className='flex items-center justify-between mb-[36px] last:mb-0 relative' onClick={() => { props.setShowMenu(false) }}>
                    <div className='flex items-center gap-[15px]'>
                      <IconsComponent type='TradeHistory' hover={false} active={false} />
                      <Link href="/watchlist" className='md-text !text-[16px] dark:text-d-nav-primary text-nav-primary'>WatchList</Link>
                    </div>
                    <svg
                      width={7}
                      height={12}
                      viewBox="0 0 7 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.303884 9.73692C0.000451519 10.1004 0.0501666 10.6404 0.4136 10.9438C0.777033 11.2472 1.3179 11.1975 1.62047 10.8341L5.90624 6.54831C5.94053 6.50802 5.95681 6.46002 5.98253 6.41545C6.0031 6.38031 6.0271 6.34945 6.04253 6.31088C6.08196 6.21059 6.1051 6.10602 6.1051 5.99973C6.1051 5.89345 6.08196 5.78887 6.04253 5.68858C6.0271 5.65001 6.0031 5.61916 5.98253 5.58401C5.95681 5.53944 5.94053 5.49144 5.90624 5.45115L1.62047 1.16538C1.3179 0.801093 0.777033 0.752236 0.4136 1.05567C0.0501662 1.35824 0.000451161 1.89825 0.303884 2.26254L3.41792 5.14258L4.275 5.99965L3.41585 6.85881L0.303884 9.73692Z"
                        fill="#9295A6"
                      />
                    </svg>
                    <Link href="/watchlist" className='absolute top-0 left-0 right-0 h-full'></Link>
                  </li>
                </>

              }
            </ul>
          </nav>
        </div>
        <div className='pt-[20px] mt-[30px] border-t border-[#E9EAF0] dark:border-[#e9eaf00f]'>
          <div className='flex items-center justify-between' onClick={showList}>
            <div className='flex items-center gap-[15px]'>
              <svg
                width={25}
                height={24}
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.8515 18.318C17.6795 17.885 17.4355 17.507 17.2215 17.184C17.1135 17.022 17.0025 16.857 16.9055 16.687C16.5165 16.011 16.6505 15.737 17.2815 14.68L17.3835 14.507C17.8945 13.646 17.9225 12.82 17.9485 12.092C17.9605 11.734 17.9725 11.397 18.0415 11.08C18.2025 10.348 19.7495 10.153 20.7085 10.038C20.8695 10.667 20.9625 11.322 20.9625 12C20.9625 14.569 19.7405 16.853 17.8515 18.318ZM5.92542 15.799C6.56141 15.961 7.25041 16.073 7.95142 16.073C9.03141 16.073 10.1344 15.809 11.0884 15.062C12.8044 13.72 12.8044 12.004 12.8044 10.624C12.8044 9.732 12.8044 8.963 13.1764 8.28C13.3764 7.914 13.8024 7.66 14.2954 7.365C14.5974 7.184 14.9104 6.998 15.2104 6.762C15.8534 6.259 16.3314 5.612 16.6274 4.896C18.0274 5.621 19.1874 6.744 19.9534 8.119C18.5254 8.317 16.4984 8.785 16.0894 10.652C15.9814 11.146 15.9644 11.611 15.9514 12.022C15.9304 12.605 15.9144 13.066 15.6644 13.488L15.5644 13.656C14.9174 14.739 14.1854 15.967 15.1724 17.684C15.2914 17.892 15.4244 18.092 15.5554 18.291C15.8994 18.807 16.0684 19.092 16.0694 19.372C15.1144 19.776 14.0644 20 12.9634 20C9.92642 20 7.28042 18.298 5.92542 15.799ZM12.9625 4C13.5785 4 14.1735 4.076 14.7495 4.208C14.5805 4.58 14.3195 4.919 13.9755 5.188C13.7575 5.36 13.5125 5.503 13.2695 5.648C12.6185 6.036 11.8815 6.476 11.4195 7.322C10.8035 8.452 10.8035 9.606 10.8035 10.624C10.8035 11.979 10.7595 12.78 9.85553 13.487C8.48653 14.56 6.39153 13.961 5.09553 13.416C5.01353 12.955 4.96253 12.483 4.96253 12C4.96253 7.589 8.55153 4 12.9625 4ZM12.9625 2C7.44852 2 2.96252 6.486 2.96252 12C2.96252 17.513 7.44852 22 12.9625 22C18.4765 22 22.9625 17.513 22.9625 12C22.9625 6.486 18.4765 2 12.9625 2Z"
                  fill="#9295A6"
                />
              </svg>
              <button className='md-text !text-[16px] dark:text-d-nav-primary text-nav-primary '>
                English | USD
              </button>
            </div>
            <svg
              className='rotate-[90deg]'
              width={7}
              height={12}
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.303884 9.73692C0.000451519 10.1004 0.0501666 10.6404 0.4136 10.9438C0.777033 11.2472 1.3179 11.1975 1.62047 10.8341L5.90624 6.54831C5.94053 6.50802 5.95681 6.46002 5.98253 6.41545C6.0031 6.38031 6.0271 6.34945 6.04253 6.31088C6.08196 6.21059 6.1051 6.10602 6.1051 5.99973C6.1051 5.89345 6.08196 5.78887 6.04253 5.68858C6.0271 5.65001 6.0031 5.61916 5.98253 5.58401C5.95681 5.53944 5.94053 5.49144 5.90624 5.45115L1.62047 1.16538C1.3179 0.801093 0.777033 0.752236 0.4136 1.05567C0.0501662 1.35824 0.000451161 1.89825 0.303884 2.26254L3.41792 5.14258L4.275 5.99965L3.41585 6.85881L0.303884 9.73692Z"
                fill="#9295A6"
              />
            </svg>

          </div>
          <div ref={showLists} className='h-0 overflow-hidden duration-300  '>
            <div className=' mt-[31px]'>
              <LanguageCurrency />
            </div>
          </div>
        </div>
        {props.session === null ?
          <div className='flex items-center gap-[15px] pt-[20px] mt-[30px] border-t border-[#E9EAF0] dark:border-[#e9eaf00f]'>
            <Link className='solid-button w-full text-center !text-primary dark:!bg-white !bg-grey' href="/login">Sign In</Link>
            <Link className='solid-button w-full text-center' href="/register">Register</Link>
          </div>
          :
          <div className='flex items-center gap-[15px] pt-[20px] mt-[30px] border-t border-[#E9EAF0] dark:border-[#e9eaf00f]'>
          <button className=' bg-primary text-white py-[15px] px-[5px]  w-full rounded-[12px]' onClick={()=>{signOut()}}>
          Sign Out
      </button>
      </div>
        }
        {/* {props?.session &&
         <div className='flex items-center gap-[15px] pt-[20px] mt-[30px] border-t border-[#E9EAF0] dark:border-[#e9eaf00f]'>
          <button className=' bg-primary text-white py-[15px] px-[5px]  w-full rounded-[12px]' onClick={() => { signOut() }}>
            Sign Out
          </button>
          </div>
        } */}
      </div>
      <div className='mt-[40px]'>
        <p className='text-center sec-text text-gamma'>© 2023 dynamic. All rights reserved</p>
        <div className='grid grid-cols-3 place-items-center my-[20px]'>
          <Link href="#" className='pl-[20px] border-l sec-text text-gamma border-gamma'>Privacy</Link>
          <Link href="#" className='pl-[20px] border-l sec-text text-gamma border-gamma'>Terms</Link>
          <Link href="#" className='pl-[20px] border-l sec-text text-gamma border-gamma'>Sitemap</Link>
        </div>
      </div>
      <div className='flex items-center gap-[28px] justify-center'>
        <Link href="#">
          <svg
            width={25}
            height={24}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.6204 5.32003H17.5004V2.14003C16.5901 2.04538 15.6755 1.99865 14.7604 2.00003C12.0404 2.00003 10.1804 3.66003 10.1804 6.70003V9.32003H7.11035V12.88H10.1804V22H13.8604V12.88H16.9204L17.3804 9.32003H13.8604V7.05003C13.8604 6.00003 14.1404 5.32003 15.6204 5.32003Z"
              fill="#9295A6"
            />
          </svg>
        </Link>
        <Link href="#">
          <svg
            width={25}
            height={24}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.84 5.46C17.6027 5.46 17.3707 5.53038 17.1733 5.66224C16.976 5.79409 16.8222 5.98151 16.7313 6.20078C16.6405 6.42005 16.6168 6.66133 16.6631 6.89411C16.7094 7.12689 16.8236 7.34071 16.9915 7.50853C17.1593 7.67635 17.3731 7.79064 17.6059 7.83694C17.8387 7.88324 18.0799 7.85948 18.2992 7.76866C18.5185 7.67783 18.7059 7.52402 18.8378 7.32668C18.9696 7.12935 19.04 6.89734 19.04 6.66C19.04 6.34174 18.9136 6.03652 18.6885 5.81147C18.4635 5.58643 18.1583 5.46 17.84 5.46ZM22.44 7.88C22.4206 7.0503 22.2652 6.2294 21.98 5.45C21.7257 4.78313 21.33 4.17928 20.82 3.68C20.3248 3.16743 19.7196 2.77418 19.05 2.53C18.2727 2.23616 17.4508 2.07721 16.62 2.06C15.56 2 15.22 2 12.5 2C9.78 2 9.44 2 8.38 2.06C7.54915 2.07721 6.72734 2.23616 5.95 2.53C5.28168 2.77665 4.67693 3.16956 4.18 3.68C3.66743 4.17518 3.27418 4.78044 3.03 5.45C2.73616 6.22734 2.57721 7.04915 2.56 7.88C2.5 8.94 2.5 9.28 2.5 12C2.5 14.72 2.5 15.06 2.56 16.12C2.57721 16.9508 2.73616 17.7727 3.03 18.55C3.27418 19.2196 3.66743 19.8248 4.18 20.32C4.67693 20.8304 5.28168 21.2234 5.95 21.47C6.72734 21.7638 7.54915 21.9228 8.38 21.94C9.44 22 9.78 22 12.5 22C15.22 22 15.56 22 16.62 21.94C17.4508 21.9228 18.2727 21.7638 19.05 21.47C19.7196 21.2258 20.3248 20.8326 20.82 20.32C21.3322 19.8226 21.7283 19.2182 21.98 18.55C22.2652 17.7706 22.4206 16.9497 22.44 16.12C22.44 15.06 22.5 14.72 22.5 12C22.5 9.28 22.5 8.94 22.44 7.88ZM20.64 16C20.6327 16.6348 20.5178 17.2637 20.3 17.86C20.1403 18.2952 19.8839 18.6884 19.55 19.01C19.2256 19.3405 18.8332 19.5964 18.4 19.76C17.8037 19.9778 17.1748 20.0927 16.54 20.1C15.54 20.15 15.17 20.16 12.54 20.16C9.91 20.16 9.54 20.16 8.54 20.1C7.88089 20.1123 7.22459 20.0109 6.6 19.8C6.18578 19.6281 5.81136 19.3728 5.5 19.05C5.16809 18.7287 4.91484 18.3352 4.76 17.9C4.51586 17.2952 4.38044 16.6519 4.36 16C4.36 15 4.3 14.63 4.3 12C4.3 9.37 4.3 9 4.36 8C4.36448 7.35106 4.48295 6.70795 4.71 6.1C4.88605 5.67791 5.15627 5.30166 5.5 5C5.80381 4.65617 6.17929 4.3831 6.6 4.2C7.20955 3.98004 7.852 3.86508 8.5 3.86C9.5 3.86 9.87 3.8 12.5 3.8C15.13 3.8 15.5 3.8 16.5 3.86C17.1348 3.86728 17.7637 3.98225 18.36 4.2C18.8144 4.36865 19.2223 4.64285 19.55 5C19.8777 5.30718 20.1338 5.68273 20.3 6.1C20.5223 6.70893 20.6373 7.35178 20.64 8C20.69 9 20.7 9.37 20.7 12C20.7 14.63 20.69 15 20.64 16ZM12.5 6.87C11.4858 6.87198 10.495 7.17453 9.65265 7.73942C8.81035 8.30431 8.15438 9.1062 7.76763 10.0438C7.38089 10.9813 7.28072 12.0125 7.47979 13.0069C7.67886 14.0014 8.16824 14.9145 8.88608 15.631C9.60392 16.3474 10.518 16.835 11.5129 17.0321C12.5077 17.2293 13.5387 17.1271 14.4755 16.7385C15.4123 16.35 16.2129 15.6924 16.7761 14.849C17.3394 14.0056 17.64 13.0142 17.64 12C17.6413 11.3251 17.5092 10.6566 17.2512 10.033C16.9933 9.40931 16.6146 8.84281 16.1369 8.36605C15.6592 7.88929 15.0919 7.51168 14.4678 7.25493C13.8436 6.99818 13.1749 6.86736 12.5 6.87ZM12.5 15.33C11.8414 15.33 11.1976 15.1347 10.65 14.7688C10.1023 14.4029 9.67552 13.8828 9.42348 13.2743C9.17144 12.6659 9.1055 11.9963 9.23398 11.3503C9.36247 10.7044 9.67963 10.111 10.1453 9.64533C10.611 9.17963 11.2044 8.86247 11.8503 8.73398C12.4963 8.6055 13.1659 8.67144 13.7743 8.92348C14.3828 9.17552 14.9029 9.60234 15.2688 10.15C15.6347 10.6976 15.83 11.3414 15.83 12C15.83 12.4373 15.7439 12.8703 15.5765 13.2743C15.4092 13.6784 15.1639 14.0454 14.8547 14.3547C14.5454 14.6639 14.1784 14.9092 13.7743 15.0765C13.3703 15.2439 12.9373 15.33 12.5 15.33Z"
              fill="#9295A6"
            />
          </svg>

        </Link>
        <Link href="#">
          <svg
            width={25}
            height={24}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.5 9.70998C23.5495 8.27864 23.2365 6.858 22.59 5.57998C22.1514 5.05558 21.5427 4.70169 20.87 4.57998C18.0875 4.32751 15.2936 4.22403 12.5 4.26998C9.71667 4.22194 6.93274 4.32208 4.16003 4.56998C3.61185 4.6697 3.10454 4.92683 2.70003 5.30998C1.80003 6.13998 1.70003 7.55998 1.60003 8.75998C1.45494 10.9175 1.45494 13.0824 1.60003 15.24C1.62896 15.9154 1.72952 16.5858 1.90003 17.24C2.0206 17.745 2.26455 18.2123 2.61003 18.6C3.01729 19.0034 3.53641 19.2752 4.10003 19.38C6.25594 19.6461 8.42824 19.7564 10.6 19.71C14.1 19.76 17.17 19.71 20.8 19.43C21.3775 19.3316 21.9112 19.0595 22.33 18.65C22.61 18.3699 22.8191 18.0271 22.94 17.65C23.2977 16.5526 23.4733 15.4041 23.46 14.25C23.5 13.69 23.5 10.31 23.5 9.70998ZM10.24 14.85V8.65998L16.16 11.77C14.5 12.69 12.31 13.73 10.24 14.85Z"
              fill="#9295A6"
            />
          </svg>

        </Link>
        <Link href="#">
          <svg
            width={25}
            height={24}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.5 5.80021C21.7483 6.1263 20.9534 6.34187 20.14 6.44021C20.9982 5.92753 21.6413 5.12099 21.95 4.17021C21.1436 4.65027 20.2608 4.98851 19.34 5.17021C18.7245 4.50278 17.905 4.05851 17.0098 3.90706C16.1147 3.75562 15.1945 3.90557 14.3938 4.3334C13.593 4.76123 12.9569 5.44274 12.5852 6.27105C12.2135 7.09935 12.1273 8.0276 12.34 8.91021C10.7094 8.82774 9.11444 8.40316 7.65865 7.66407C6.20287 6.92498 4.91885 5.8879 3.89 4.62021C3.52914 5.25038 3.33952 5.96403 3.34 6.69021C3.33872 7.36459 3.50422 8.02883 3.82176 8.62377C4.13929 9.21872 4.59902 9.72592 5.16 10.1002C4.50798 10.0825 3.86989 9.90751 3.3 9.59021V9.64021C3.30489 10.5851 3.63599 11.4993 4.23731 12.2282C4.83864 12.957 5.67326 13.4559 6.6 13.6402C6.24326 13.7488 5.87287 13.806 5.5 13.8102C5.24189 13.8072 4.98442 13.7838 4.73 13.7402C4.99391 14.553 5.50462 15.2634 6.19107 15.7724C6.87753 16.2814 7.70558 16.5638 8.56 16.5802C7.1172 17.7155 5.33588 18.3351 3.5 18.3402C3.16574 18.3413 2.83174 18.3213 2.5 18.2802C4.37443 19.4905 6.55881 20.1329 8.79 20.1302C10.3297 20.1462 11.8571 19.8552 13.2831 19.2743C14.7091 18.6934 16.005 17.8341 17.0952 16.7467C18.1854 15.6593 19.048 14.3656 19.6326 12.9411C20.2172 11.5166 20.512 9.98994 20.5 8.45021C20.5 8.28021 20.5 8.10021 20.5 7.92021C21.2847 7.33502 21.9615 6.61763 22.5 5.80021Z"
              fill="#9295A6"
            />
          </svg>
        </Link>
        <Link href="#">
          <svg
            width={25}
            height={24}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.9696 2.00014H4.02957C3.83915 1.9975 3.65007 2.03239 3.47314 2.10282C3.2962 2.17326 3.13487 2.27786 2.99837 2.41065C2.86186 2.54344 2.75285 2.70182 2.67756 2.87675C2.60227 3.05167 2.56218 3.23972 2.55957 3.43014V20.5701C2.56218 20.7606 2.60227 20.9486 2.67756 21.1235C2.75285 21.2985 2.86186 21.4568 2.99837 21.5896C3.13487 21.7224 3.2962 21.827 3.47314 21.8975C3.65007 21.9679 3.83915 22.0028 4.02957 22.0001H20.9696C21.16 22.0028 21.3491 21.9679 21.526 21.8975C21.7029 21.827 21.8643 21.7224 22.0008 21.5896C22.1373 21.4568 22.2463 21.2985 22.3216 21.1235C22.3969 20.9486 22.437 20.7606 22.4396 20.5701V3.43014C22.437 3.23972 22.3969 3.05167 22.3216 2.87675C22.2463 2.70182 22.1373 2.54344 22.0008 2.41065C21.8643 2.27786 21.7029 2.17326 21.526 2.10282C21.3491 2.03239 21.16 1.9975 20.9696 2.00014ZM8.58957 18.7401H5.58957V9.74014H8.58957V18.7401ZM7.08957 8.48014C6.67583 8.48014 6.27904 8.31578 5.98648 8.02323C5.69393 7.73067 5.52957 7.33388 5.52957 6.92014C5.52957 6.5064 5.69393 6.10961 5.98648 5.81705C6.27904 5.5245 6.67583 5.36014 7.08957 5.36014C7.30927 5.33522 7.53175 5.35699 7.74245 5.42402C7.95314 5.49105 8.14731 5.60183 8.31223 5.7491C8.47715 5.89637 8.6091 6.07682 8.69944 6.27862C8.78979 6.48043 8.83649 6.69904 8.83649 6.92014C8.83649 7.14124 8.78979 7.35985 8.69944 7.56166C8.6091 7.76346 8.47715 7.94391 8.31223 8.09118C8.14731 8.23845 7.95314 8.34923 7.74245 8.41626C7.53175 8.48329 7.30927 8.50505 7.08957 8.48014ZM19.4096 18.7401H16.4096V13.9101C16.4096 12.7001 15.9796 11.9101 14.8896 11.9101C14.5522 11.9126 14.2238 12.0184 13.9484 12.2133C13.6731 12.4082 13.4641 12.6828 13.3496 13.0001C13.2713 13.2352 13.2374 13.4827 13.2496 13.7301V18.7301H10.2496C10.2496 18.7301 10.2496 10.5501 10.2496 9.73014H13.2496V11.0001C13.5221 10.5272 13.9185 10.1377 14.396 9.87334C14.8735 9.60902 15.4141 9.47999 15.9596 9.50014C17.9596 9.50014 19.4096 10.7901 19.4096 13.5601V18.7401Z"
              fill="#9295A6"
            />
          </svg>

        </Link>
      </div>
    </div>
  )
}

export default ResponsiveSidebar;