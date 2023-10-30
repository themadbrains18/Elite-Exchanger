import React, { useEffect, useState } from 'react'
import IconsComponent from '../snippets/icons';


interface DynamicId {
    id: number;
    newId: number;
}

const ChoosePaymentMethods = (props:DynamicId) => {
    const [show,setShow] = useState(0);
    // format card number
    const formatter = () => {
        const processor = (i:any) => {
          return (e:any) => {
            if(e.keyCode == 8) return;
            let str = i.value.replace(/[^0-9]+/g,'');
            // data.value = str;
            let set = str.match(/[0-9]{1,4}/g);
            if(set === null) {
              i.value = "";
            } else {
              let sets = "";
              let c = 1;
              set.forEach((num:any) => {
                sets += (num.length == 4 && c != 4) ? num + " " : num;
                c++;
              });
              i.value = sets;
            }
          }
        };
        
        
        let form = document.querySelectorAll(".cardNumber");
        for(let i of form){
          i?.addEventListener("keyup", processor(i) ,false);
        }
    };


    useEffect(()=>{
        formatter();
    },[]);
  return (
    <>
        <div className='flex items-center justify-between '>
            <input id={`custom-${props.newId}-radio${props.id}`} type="radio" value="" name="colored-radio" className="hidden w-5 h-5 max-w-full   bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"  />
            <label onClick={()=>{setShow(0)}} htmlFor={`custom-${props.newId}-radio${props.id}`} 
            className="custom-radio cursor-pointer py-[10px]  relative 
            flex gap-2 items-center pl-[30px] 
              after:dark:bg-omega
              after:bg-white
              after:left-0
              after:w-[20px] 
              after:h-[20px]
              after:rounded-[50%] 
              after:border after:border-beta
              after:absolute

              before:dark:bg-[transparent]
              before:bg-white
              before:left-[5px]
              before:w-[10px] 
              before:h-[10px]
              before:rounded-[50%] 
              before:absolute
              before:z-[1]
                  
                  ">
                <p className={`info-16-18 !text-gamma !text-[14px]`}>Pay Pal</p>

            </label>
            <IconsComponent type='paypalColored' hover={false} active={false} />
        </div>
        <div className={`flex items-center justify-between ${show === 1 &&  'pb-20'} `}>
            <input id={`custom-${props.newId}-radio2${props.id}`} type="radio" value="" name="colored-radio" className="hidden w-5 h-5 max-w-full  bg-red-400 border-[transparent] focus:ring-primary dark:focus:ring-primary dark:ring-offset-primary  dark:bg-[transparent] dark:border-[transparent]"  />
            <label onClick={()=>{setShow(1)}} htmlFor={`custom-${props.newId}-radio2${props.id}`} className="
            custom-radio relative py-[10px]  flex gap-2 items-center pl-[30px]
            cursor-pointer
            after:dark:bg-omega
            after:bg-white
            after:left-0
            after:w-[20px] 
            after:h-[20px]
            after:rounded-[50%] 
            after:border after:border-beta
            after:absolute

            before:dark:bg-[transparent]
            before:bg-white
            before:left-[5px]
            before:w-[10px] 
            before:h-[10px]
            before:rounded-[50%] 
            before:absolute
            before:z-[1]
            ">
            <p className={`info-16-18 !text-gamma !text-[14px]`}>Credit & Debit Card</p>
            </label>
            <div className='flex items-center gap-10'> 
                <IconsComponent type='visaColored' hover={false} active={false} />
                <IconsComponent type='masterCardColored' hover={false} active={false} />
                <IconsComponent type='walletColored' hover={false} active={false} />
            </div>
        </div>

        {/* if Credit & Debit Card radio button is checked */}
        
        <div className={`${show === 1 ? "block":"hidden"} pt-[21px] border-t border-grey-v-1 dark:border-opacity-[15%] `}>

            <div className='mb-[40px]'>
                <p className='sm-text mb-10 dark:text-gamma'>Number</p>    
                <div className='border border-grey-v-1 dark:border-opacity-[15%] p-[15px] rounded-[5px] flex items-center gap-[10px] justify-between cursor-pointer'>
                    <input type='tel'   maxLength={19} minLength={19} className='cardNumber w-full focus:outline-none nav-text-lg dark:bg-d-bg-primary' placeholder='1234 5678 9874 4563'/>
                    <IconsComponent type='visaColored' hover={false} active={false} />
                </div>
            </div>
            <div className='flex items-center gap-30'>
                <div className='mb-[20px]'>
                    <p className='sm-text mb-10 dark:text-gamma'>Valid</p>    
                    <input type='date' className='dateInput border border-grey-v-1 dark:border-opacity-[15%] p-[15px] rounded-[5px] cursor-pointer   w-full focus:outline-none nav-text-lg dark:bg-d-bg-primary' placeholder='$30,255.22' />
                </div>
                <div className='mb-[20px]'>
                    <p className='sm-text mb-10 dark:text-gamma'>CVV</p>    
                    <input type='password' maxLength={3} minLength={3} className='border border-grey-v-1 dark:border-opacity-[15%] p-[15px] rounded-[5px] cursor-pointer   w-full focus:outline-none nav-text-lg dark:bg-d-bg-primary' />
                </div>
            </div>
            <div>
                <p className='sm-text mb-10 dark:text-gamma'>Valid</p>    
                <input type='date' className='dateInput dateInputIcon2 border border-grey-v-1 dark:border-opacity-[15%] p-[15px] rounded-[5px] cursor-pointer   w-full focus:outline-none nav-text-lg dark:bg-d-bg-primary' placeholder='$30,255.22' />
            </div>
            
        </div>
          

    </>
  )
}

export default ChoosePaymentMethods;