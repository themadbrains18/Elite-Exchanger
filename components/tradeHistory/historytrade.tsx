import Image from "next/image";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";

import OrderTable from "./orderTable";
import DepositTable from "./depositTable";
import WithdrawTable from "./withdrawTable";
import StakingTable from "./stakingTable";
import FilterSelectMenuWithCoin from "../snippets/filter-select-menu-with-coin";

interface propsData {
  coinList: any,
}
const Historytrade = (props: propsData) => {
  const [active, setActive] = useState(1);

  const [filter, setFilter] = useState("")
  const [firstCurrency, setFirstCurrency] = useState("");
  const [startDate, setStartDate] = useState<any>();
  const [symbol, setSymbol] = useState('')


  
  
  const setCurrencyName = (symbol: string, dropdown: number) => {
    // console.log(symbol,"============symbol");
    
    setSymbol(symbol);
    let token = props?.coinList?.filter((item: any) => {
      return item.symbol === symbol;
    });

    setFirstCurrency(token[0].id);
  };
  const handleStartDate = (date: any) => {
    setStartDate(date);
  };

  const clearAll=()=>{
    setStartDate(null);
    setFirstCurrency('');
    setSymbol('')
  }

  return (
    <>
      <ToastContainer limit={1}/>
      <section className=" bg-light-v-1 py-[20px] md:py-[80px] dark:bg-black-v-1">
        <div className="container ">
          <div className="p-5 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
            <div className="flex justify-between gap-5 mb-[26px] md:mb-40">
              <p className="sec-title">Trade History</p>
              <Image src="/assets/history/dots.svg" loading="lazy" width={24} height={24} alt="dots" className="cursor-pointer md:hidden block" />
              {/* <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] py-[13px] px-[10px] ">
                <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
                <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent]" onChange={(e) => filterData(e)} />
              </div> */}
            </div>
            <div className="flex justify-between border-b border-grey-v-3 dark:border-opacity-[15%]">
              <div className="flex gap-5 md:gap-30 overflow-auto trade_history_scroll">
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 1 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(1);
                    // setItemOffset(0);
                  }}
                >
                  Order History
                </button>
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 2 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(2);
                    // setDepositItemOffset(0);
                  }}
                >
                  Wallet Deposit History
                </button>
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 3 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(3);
                    // setWithdrawItemOffset(0);
                  }}
                >
                  Wallet Withdraw History
                </button>
                {/* <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 4 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(4);
                  }}
                >
                  Convert History
                </button> */}
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 5 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(5);
                  }}
                >
                  Staking History
                </button>
              </div>
              
              <div className="hidden lg:flex gap-5">
                <div className="p-[5px] flex items-center gap-[10px] cursor-pointer">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: any) => handleStartDate(date)}
                    peekNextMonth
                    placeholderText={'Select date'} 
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="sm-text input-cta2 max-w-[200px] w-full border border-grey-v-1 dark:border-[#ccced94d] rounded-[5px] !bg-[transparent] h-[41px]"
                  />
                </div>
                <div className="relative p-[5px] flex items-center gap-[10px] cursor-pointer">
                  {/* <Image src="/assets/history/filter.svg" width={24} height={24} alt="filter" /> */}
                  <FilterSelectMenuWithCoin
                    data={props.coinList}
                    border={true}
                    dropdown={1}
                    value={symbol}
                    setCurrencyName={setCurrencyName}
                  />
                </div>
                <div className="p-[5px] flex items-center gap-[10px] cursor-pointer" onClick={clearAll}><p className="nav-text-sm hover:!text-primary">Clear Filter</p></div>
              </div>
            </div>
            {active === 1 && (
              <OrderTable filter={filter} date={startDate} coin={firstCurrency}/>
            )}
            {active === 2 && (
              <DepositTable filter={filter} date={startDate} coin={symbol}/>
            )}
            {active === 3 && (
              <WithdrawTable filter={filter} date={startDate} coin={symbol}/>
            )}
            {/* {active === 4 && (
         <ConvertTable />
            )} */}
            {active === 5 && (
              <StakingTable />
            )}
          </div>
        </div>


      </section>
    </>

  );
};

export default Historytrade;
