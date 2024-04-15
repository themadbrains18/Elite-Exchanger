import React, { useEffect, useState } from 'react'
import IconsComponent from './icons';
import Image from 'next/image';
// import { useIsClickOut } from './outSideClick';
// import useIsClickOutTwo from './outSideClickTwo';

interface dataList {
  data: any;
  border: boolean;
  setCurrencyName?: Function,
  dropdown: number,
  setCurrency?: Function,
  value?: string;
  filterNetworkListByCoin?:any;
}

const FilterSelectMenuWithCoin = (props: dataList) => {

  const [show, setShow] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [image, setImage] = useState('Coin.svg');
  const [text, setText] = useState((props?.value === null || props?.value === undefined) ? 'Select' : props?.value);
  const [filterCoin, setFilterCoin] = useState(props.data);
  // const [open, setOpen] = useState(false)
  // const [openSecond, setOpenSecond] = useState(false)
  // const [eleCallBack] =  useIsClickOut(setOpen)
  // const [eleCallbackTwo] = useIsClickOutTwo(setOpenSecond);

  const filterCoinsInList = (e: any) => {
    
    let record = props.data.filter((item: any) => {
      return item.symbol.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setFilterCoin(record);
  }

  useEffect(() => {

    document.addEventListener('click', (evt: any) => {
      if (props?.dropdown) {
        let dropdown = document.querySelector('.coin-dropdown1');
        let dropdown2 = document.querySelector('.coin-dropdown2');
        let targetEl = evt?.target?.parentNode?.parentElement; // clicked element
        if (evt?.target.nodeName === 'svg') {
          targetEl = evt?.target?.parentNode
        }
        if (targetEl !== dropdown) {
          setShow(false);
        }
        if (targetEl !== dropdown2) {
          setShowSecond(false);
        }
      }
      
    })
  }, [props?.dropdown])

  let drop1Image = (props.dropdown === 1 || props.dropdown === 2) && props?.value === 'INR' ? 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/inr.png' : '';
  let drop2Image = (props.dropdown === 1 || props.dropdown === 2) && props?.value === 'USDT' ? 'https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/32/usdt.png' : '';
  
  return (

    <>
      <div className='max-w-full  w-full' >
        {props.dropdown === 1 &&
          <>
            <div onClick={(e) => {setShow(!show) }}>
              <div className={` ${props.border == true && 'border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[8px] pl-[15px] pr-[5px]'} `} >
                <div className=" cursor-pointer max-w-full w-full" >
                  <div className={`${`coin-dropdown` + props?.dropdown} pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] cursor-pointer flex justify-between items-center`} >
                    <li className='flex items-center gap-[5px] rounded-[5px] mr-[15px] w-full max-w-full'>
                      <Image src={`${(image === 'Coin.svg' && (props?.value === null || props?.value === undefined)) ? `/assets/history/Coin.svg` : drop1Image !== '' ? drop1Image : drop2Image !==''?drop2Image :image}`} alt="error" width={20} height={20} className={`${text === 'XRP' || text === 'ETH'?'bg-white rounded-full':''}`}/>
                      <p className={`sm-text rounded-[5px] w-full max-w-full  cursor-pointer !text-banner-text ${props.dropdown == 1 ? ' one' : ' two'}`}>{text}</p>
                    </li>
                    <IconsComponent type="downArrow" hover={false} active={false} rotate={show}/>
                  </div>
                </div>
              </div>

              {/* dropdown */}
              <div className={`absolute max-h-[250px] overflow-y-auto z-[1] shadow-lg shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] pt-[1px] duration-300 ${show ? "top-[calc(100%+7px)] opacity-1 visible" : "top-[calc(100%+17px)] opacity-0 invisible"}`}>
                <div className='bg-white dark:bg-d-bg-primary rounded-[5px] sticky top-0'>
                  <div className='border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-full w-full py-[8px] px-[10px] ' onClick={(e)=>{e.stopPropagation()}}>
                    <Image src="/assets/history/search.svg" alt='error' width={15} height={15} />
                    <input type="search" className='nav-text-sm !text-beta outline-none bg-white dark:bg-d-bg-primary  w-full' onChange={(e) =>{ filterCoinsInList(e); }} />
                  </div>  
                </div>
                <ul>
                  {filterCoin !== undefined && filterCoin.map((item: any, index: number) => {
                    return (
                      <li key={index} onClick={() => { setImage(item.image); setText(item.symbol); setShow(false); props?.setCurrencyName && props?.setCurrencyName(item.symbol, props.dropdown); props?.setCurrency && props.setCurrency(item, props.dropdown);  props.filterNetworkListByCoin && props.filterNetworkListByCoin(item) }} className='cursor-pointer  flex items-center gap-10 p-10 py-[6px] hover:bg-grey dark:hover:bg-d-bg-primary rounded-[5px]'>
                        <Image src={`${item.image}`} alt="error" width={20} height={20} className={`${item.symbol === 'XRP' || item.symbol === 'ETH'?'bg-white rounded-full':''}`}/>
                        <p className={`sm-text rounded-[5px] dark:!text-d-nav-secondary   !text-banner-text`}>{item.symbol}</p>
                      </li>
                    )
                  })}

                </ul>
              </div>
            </div>

          </>
        }

        {props.dropdown === 2 &&
          <>
            <div onClick={(e) => { setShowSecond(!showSecond) }}>
              <div className={`${props.border == true && 'border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] py-[8px] pl-[15px] pr-[5px]'} `} >
                <div className=" cursor-pointer max-w-full w-full">
                  <div className={`${`coin-dropdown` + props?.dropdown} pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] cursor-pointer flex justify-between items-center`} >
                    <li className='flex items-center gap-[5px] rounded-[5px] mr-[15px]'>
                      <Image src={`${(image === 'Coin.svg' && (props?.value === null || props?.value === undefined)) ? `/assets/history/Coin.svg` : drop1Image !== '' ? drop1Image : drop2Image !==''?drop2Image :image}`} alt="error" width={20} height={20} />
                      <p className={`sm-text rounded-[5px]  cursor-pointer !text-banner-text ${props.dropdown == 2 ? ' two' : ' one'}`}>{text}</p>
                    </li>
                    <IconsComponent type="downArrow" hover={false} active={false} />
                  </div>
                </div>
              </div>

              {/* dropdown */}
              <div className={`absolute max-h-[250px] overflow-y-auto z-[2] shadow-lg shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] duration-300 ${showSecond == true ? "!top-[calc(100%+7px)] !opacity-1 !visible" : "top-[calc(100%+17px)] opacity-0 invisible"}`}>
                <div className='bg-white dark:bg-d-bg-primary rounded-[5px] sticky top-0'>
                  <div className='border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-full w-full py-[8px] px-[10px] '  onClick={(e)=>{e.stopPropagation()}}>
                    <Image src="/assets/history/search.svg" alt='error' width={15} height={15} />
                    <input type="search" className='nav-text-sm !text-beta outline-none bg-[transparent] w-full' onChange={(e) =>{filterCoinsInList(e)}}/>
                  </div>
                </div>
                <ul>
                  {filterCoin !== undefined && filterCoin.map((item: any, index: number) => {
                    return (
                      <li key={index} onClick={() => { setImage(item.image); setText(item.symbol); setShowSecond(false); props?.setCurrencyName && props?.setCurrencyName(item.symbol, props.dropdown); props?.setCurrency && props.setCurrency(item, props.dropdown) }} className='cursor-pointer  flex items-center gap-10 p-10 py-[6px] hover:bg-grey dark:hover:bg-d-bg-primary rounded-[5px]'>
                        <Image src={`${item.image}`} alt="error" width={20} height={20}  />
                        <p className={`sm-text rounded-[5px] dark:!text-d-nav-secondary   !text-banner-text`}>{item.symbol}</p>
                      </li>
                    )
                  })}

                </ul>
              </div>
            </div>
          </>
        }

      </div>
    </>
  )
}

export default FilterSelectMenuWithCoin;