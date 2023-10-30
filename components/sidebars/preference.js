import React, { useContext, useState } from 'react'
import Context from '../contexts/context';
import LanguageCurrency from '../snippets/language-currency';

const Preference = (props) => {
const  { mode , setMode } = useContext(Context);
const [show,setShow] = useState(false)
    

   const setCookies = (e) =>{
        let setMode =  e.currentTarget.querySelector("span").innerText;
        let result = setMode.toLowerCase();
        localStorage.setItem("mode",result);
    }
  return (
    <>

        {/* Preference overlay */}
        <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible":"opacity-0 invisible"}`} onClick={()=>{setShow(false)}}></div>
        {/* setting cta */}
        <div className='fixed top-[50%] z-[7] translate-y-[-50%] right-[10px] rounded-[8px] bg-primary-400 max-w-[50px] h-[50px] p-[10px] cursor-pointer' onClick={()=>{setShow(true)}}>
            <svg
                className='max-w-full h-full'
                enableBackground="new 0 0 32 32"
                id="Editable-line"
                version="1.1"
                viewBox="0 0 32 32"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                <circle
                    cx={16}
                    cy={16}
                    fill="none"
                    id="XMLID_224_"
                    r={4}
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={2}
                />
                <path
                    d="  M27.758,10.366l-1-1.732c-0.552-0.957-1.775-1.284-2.732-0.732L23.5,8.206C21.5,9.36,19,7.917,19,5.608V5c0-1.105-0.895-2-2-2h-2  c-1.105,0-2,0.895-2,2v0.608c0,2.309-2.5,3.753-4.5,2.598L7.974,7.902C7.017,7.35,5.794,7.677,5.242,8.634l-1,1.732  c-0.552,0.957-0.225,2.18,0.732,2.732L5.5,13.402c2,1.155,2,4.041,0,5.196l-0.526,0.304c-0.957,0.552-1.284,1.775-0.732,2.732  l1,1.732c0.552,0.957,1.775,1.284,2.732,0.732L8.5,23.794c2-1.155,4.5,0.289,4.5,2.598V27c0,1.105,0.895,2,2,2h2  c1.105,0,2-0.895,2-2v-0.608c0-2.309,2.5-3.753,4.5-2.598l0.526,0.304c0.957,0.552,2.18,0.225,2.732-0.732l1-1.732  c0.552-0.957,0.225-2.18-0.732-2.732L26.5,18.598c-2-1.155-2-4.041,0-5.196l0.526-0.304C27.983,12.546,28.311,11.323,27.758,10.366z  "
                    fill="none"
                    id="XMLID_242_"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={2}
                />
            </svg>
        </div>

        {/* Preference side Bar */}
        <div className={`fixed top-0 ${show ? "right-0":"right-[-100%]"} duration-300 max-w-[320px] w-full p-[15px] bg-white dark:bg-black-v-1 min-h-[100vh] h-full shadow-md z-[9]`}>
            <div className='flex items-center justify-between pb-[15px] border-b border-beta'>
                <p className='nav-text-lg'>Preference Setting</p>
                <svg
                    onClick={()=>{setShow(false)}}
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 60.963 60.842"
                    style={{ enableBackground: "new 0 0 60.963 60.842" }}
                    xmlSpace="preserve"
                    className='max-w-[18px] cursor-pointer w-full'
                    >
                    <path
                        fill={mode === 'dark' ? "#fff":"#000"}
                        d="M59.595,52.861L37.094,30.359L59.473,7.98c1.825-1.826,1.825-4.786,0-6.611
                        c-1.826-1.825-4.785-1.825-6.611,0L30.483,23.748L8.105,1.369c-1.826-1.825-4.785-1.825-6.611,0c-1.826,1.826-1.826,4.786,0,6.611
                        l22.378,22.379L1.369,52.861c-1.826,1.826-1.826,4.785,0,6.611c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                        l22.502-22.502l22.501,22.502c0.913,0.913,2.109,1.369,3.306,1.369s2.393-0.456,3.306-1.369
                        C61.42,57.647,61.42,54.687,59.595,52.861z"
                    />
                </svg>
            </div>
            <div className='mt-[15px]'>
                <p className='nav-text-lg'>Theme</p>
                <div className='flex items-center gap-[5px] mt-[15px]'>
                    <button className={`solid-button !text-[16px] flex items-center gap-[9px] !p-[12px] rounded-[5px]  justify-center !w-full ${mode == 'dark' ? "":"!bg-grey" }`} onClick={(e)=>{ setCookies(e); setMode("dark")}}>
                        <svg
                        className='max-w-[18px] w-auto'
                        id="Layer_1"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 25 25"
                        >
                        <path
                            id="Moon"
                            d="M24.86,15.53a.5.5,0,0,0-.57,0A10.71,10.71,0,0,1,9.57.79.5.5,0,0,0,9,0,12.77,12.77,0,1,0,25,16,.5.5,0,0,0,24.86,15.53Z"
                            fill={mode == 'dark' ? "white  ":"grey"}
                        />
                        </svg>
                        <span className={`block ${mode == 'dark' ? "":"text-nav-primary"}`}>Dark</span>
                    </button> 
                    <button className={`solid-button !text-[16px] flex items-center gap-[9px] !p-[12px] rounded-[5px] justify-center !w-full ${mode == 'light' ? "":" dark:!bg-omega" }`} onClick={(e)=>{setCookies(e); setMode("light")}}>
                        <svg
                            className='max-w-[18px] w-auto'
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            >
                            <circle cx={12} cy={12} r={5} />
                            <line x1={12} y1={1} x2={12} y2={3} />
                            <line x1={12} y1={21} x2={12} y2={23} />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1={1} y1={12} x2={3} y2={12} />
                            <line x1={21} y1={12} x2={23} y2={12} />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        <span className='block'>Light</span>
                    </button>
                </div>
            </div>
            <div className='mt-[30px]'>
                <p className='nav-text-lg'>English | USD</p>
                <div className='mt-[15px]'>
                    <LanguageCurrency />
                </div>
            </div>
        </div>
    </>
  )
}

export default Preference;