import React, { useState } from 'react'

const LanguageCurrency = () => {

    const [show , setShow] = useState(1)
    // const [activeLang , setActiveLang] = useState(1)


    const languageList = [
        {
            "lang":"English"
        },
        {
            "lang":"Japanese"
        },
        {
            "lang":"Afrikaans"
        },
        {
            "lang":"Dutch"
        },
        {
            "lang":"French"
        },
        {
            "lang":"German"
        },
        {
            "lang":"Chinese (Traditional)"
        },
        {
            "lang":"Croatian"
        },
        {
            "lang":"Greek"
        },
        {
            "lang":"Irish"
        },
        {
            "lang":"Portuguese"
        }
    ]
    const CurrencyList = [
        {
            "currency":"USD - $"
        },
        {
            "currency":"ARS - ARS$"
        },
        {
            "currency":"AUD - A$"
        },
        {
            "currency":"BRL - R$"
        },
        {
            "currency":"BGN - лв"
        },
        {
            "currency":"BOB - $b"
        },
        {
            "currency":"USD - $"
        },
        {
            "currency":"ARS - ARS$"
        },
        {
            "currency":"AUD - A$"
        }
    ]

    let setActiveLang = (e:any)=>{
        let listWrapper = document.querySelectorAll(".listWrapper li")
        for(let i of listWrapper){
            i.classList.remove("bg-primary")
            i.classList.remove("!text-white")
        }
        let active = e.currentTarget;
        active.classList.add("bg-primary");
        active.classList.add("!text-white");
    }
  return (
    <div className='p-[10px] bg-off-white dark:bg-black-v-1 rounded-[5px]'>
        <div className='flex items-center gap-[25px] border-b border-[#E9EAF0] dark:border-[#e9eaf00f]'>
            <button className={`md-text !text-[16px] dark:text-d-nav-primary text-nav-primary pb-[15px] border-b-[2px] ${show == 1 ? "!text-primary border-primary":"border-[transparent]"}`} onClick={()=>{setShow(1)}}>
                Language
            </button>
            <button className={`md-text !text-[16px] dark:text-d-nav-primary text-nav-primary pb-[15px] border-b-[2px] ${show == 2 ? "!text-primary border-primary":"border-[transparent]"}`}  onClick={()=>{setShow(2)}}>
                Currency
            </button>
        </div>
        <div>
            {
                show == 1 &&
                <div className='mt-[15px]'>
                    <ul className='max-h-[210px] overflow-y-auto listWrapper'>
                        {
                            languageList.map((ele,ind)=>{
                                return(
                                    <li key={ind} className={`cursor-pointer px-[10px] py-[9px] sec-text text-body-primary dark:text-d-body-primary rounded-[5px] `} onClick={(e)=>{setActiveLang(e)}}>{ ele.lang }</li>
                                )
                            })
                        }
                    </ul>
                </div>
            }
            {
                show == 2 &&
                <div className='mt-[15px]'>
                    <ul className='max-h-[210px] overflow-y-auto listWrapper'>
                        {
                            CurrencyList.map((ele,ind)=>{
                                return(
                                    <li key={ind} className='cursor-pointer px-[10px] rounded-[5px] py-[9px] sec-text text-body-primary dark:text-d-body-primary' onClick={(e)=>{setActiveLang(e)}}>{ ele.currency }</li>
                                )
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    </div>
  )
}

export default LanguageCurrency;