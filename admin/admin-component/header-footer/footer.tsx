import AdminIcons from '@/admin/admin-snippet/admin-icons'
import React, { useContext, useEffect } from 'react'
import Context from '@/components/contexts/context';

const DashboardFooter = () => {
const  { mode , setMode } = useContext(Context);

  useEffect(()=>{
    let modeSwitch2 = document?.querySelector("#modeSwitch") as HTMLInputElement ;
    let getMode = localStorage.getItem("mode");
    if(getMode === "dark" && modeSwitch2 !==null  ){
      modeSwitch2.checked  = true;
    }else{
      modeSwitch2.checked  = false;
    }
  },[])
  
  const setCookies = (e:any) =>{
    let modeSwitch = document?.querySelector("#modeSwitch") as HTMLInputElement;
    
    if(modeSwitch?.checked  == true){
      localStorage.setItem("mode","dark");
      setMode("dark")
    }else{
      setMode("light")
      localStorage.setItem("mode","light");
    }
}

  

  return (
    <div className='bg-white shadow-[0px_-10px_20px_0px_#38476d08] dark:shadow-[-8px_8px_10px_0px_#90caf90d] dark:bg-grey-v-4 fixed bottom-0 right-0 w-full max-w-[calc(100%-240px)] py-[14.5px] px-[24px]'>
      <div className='flex items-center gap-20 justify-between'>
        <div className='flex items-center justify-between'>
          <p className='admin-body-text dark:!text-[#ffffff80] !text-table-heading'>© 2023 Power Dash. Template by Madbrains..</p>
        </div>
        <div className='flex items-center '> 
          <div className='flex items-center gap-[5px] mr-20'>
            <AdminIcons type='downarrow' hover={false} active={false} />
            <p className='admin-body-text'>English</p>
          </div>
          <div className='flex items-center gap-[15px]'>
            <div className='flex items-center gap-20'>
              <div className={` ${mode == 'dark' && 'hidden'}`}>
                <AdminIcons type='lightmode' hover={false} active={false} />
              </div>
              <div className={` ${mode == 'light' && 'hidden'}`}>
                <AdminIcons type='darkmode' hover={false} active={false} />
              </div>
            </div>
            <div onClick={(e)=>{ setCookies(e); }}>
            <input
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-[#D9D9D9] before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-grey after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-admin-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-admin-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0  dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-[#90CAF9] dark:checked:after:bg-admin-primary  "
              type="checkbox"
              role="switch"
              id="modeSwitch" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DashboardFooter