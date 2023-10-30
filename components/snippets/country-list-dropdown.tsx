import React, { useEffect, useState } from 'react'
import IconsComponent from './icons';
import Image from 'next/image';

interface dataList {
  data: any;
  placeholder:string;
  onCountryChange:any;
}

const CountrylistDropdown = (props:dataList) => {
 
  const [filterCoin, setFilterCoin] = useState(props.data);
  
  const [show,setShow]= useState(false);
  const [active,setActive]= useState();
  const [text,setText]= useState('Choose Country');

  const filterCoinsInList=(e:any)=>{
    let record = props.data.filter((item:any)=>{
      return item.country.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setFilterCoin(record);
  }

  useEffect(() => {

    document.addEventListener('click', (evt: any) => {
      let dropdown = document.querySelector('.coin-dropdown-country');
      let targetEl = evt?.target?.parentNode?.parentElement; // clicked element
      if (evt?.target.nodeName === 'svg') {
        targetEl = evt?.target?.parentNode.parentNode
      }
      if (targetEl.classList.contains('coin-dropdown-country') === false) {
        setShow(false);
      }
    })
  }, [])

  return (
    <>
      <div className='relative max-w-full lg:max-w-[300px] w-full'>
        {/* top dropdown input */}
        <div className='rounded-[5px] py-[13px] px-[15px] dark:bg-black-v-1  bg-bg-secondary '>
            <div className="coin-dropdown-country flex items-center gap-10 cursor-pointer justify-between" onClick={()=>{setShow(!show)}}>
              <div>
                <input type="text" id='paymentMethod' className="sm-text dark:!text-d-nav-secondary  !text-banner-text dark:bg-black-v-1  bg-bg-secondary  max-w-none placeholder:text-disable-clr pr-0 outline-none bg-transparent w-full  cursor-pointer "
              placeholder={`${props.placeholder}`} readOnly value={text}/>
              </div>
              <div className='pl-10 border-l border-[#D9D9D9] dark:border-[#ccced94d] cursor-pointer'>
                <IconsComponent type="downArrow" hover={false} active={false}  />
              </div>
            </div>  
        </div>

        {/* dropdown */}
        <div className={`absolute z-[1] shadow-lg max-h-[250px] overflow-y-auto shadow-[#0000000d] left-0 right-0 dark:bg-black-v-1 bg-white border border-grey-v-1 dark:border-[#ccced94d] rounded-10 p-[15px] duration-300 ${show ? "top-[calc(100%+7px)] opacity-1 visible":"top-[calc(100%+17px)] opacity-0 invisible"}`}>
        <div className='bg-white dark:bg-d-bg-primary rounded-[5px] sticky top-0'>
          <div className='border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-full w-full py-[8px] px-[10px] '>
            <Image src="/assets/history/search.svg" alt='error' width={15} height={15} />
            <input type="search" className='nav-text-sm  !text-beta outline-none bg-[transparent] w-full'  onChange={(e)=>{filterCoinsInList(e)}}/>
          </div>
        </div>
          <ul>
            {/* {props?.data.map((item:any,index:number)=>{
              return(
                <li key={index} onClick={()=>{setActive(item.country); setShow(false); props?.onCountryChange && props?.onCountryChange(item?.country) }}>
                  <p className={`sm-text px-10 py-[7px] rounded-[5px] hover:bg-grey dark:hover:bg-d-bg-primary cursor-pointer dark:!text-d-nav-secondary  !text-banner-text`}>{item.country}</p>
                </li>
              )
            })} */}
              {filterCoin!==undefined && filterCoin.map((item:any,index:number)=>{
                  return(
                    <li key={index}  onClick={()=>{props?.onCountryChange(item.country); setText(item.country); setShow(false)}}  className='cursor-pointer  flex items-center gap-10 p-10 py-[6px] hover:bg-grey dark:hover:bg-d-bg-primary rounded-[5px]'>
                      <p className={`sm-text rounded-[5px] dark:!text-d-nav-secondary   !text-banner-text`}>{item.country}</p>
                    </li>
                  )
                })}
           
          </ul>
        </div>
      </div>
    </>
  )
}

export default CountrylistDropdown;