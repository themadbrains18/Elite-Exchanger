import Image from "next/image";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderTable from "./orderTable";
import DepositTable from "./depositTable";
import WithdrawTable from "./withdrawTable";
import ConvertTable from "./convertTable";
import StakingTable from "./stakingTable";


const Historytrade = () => {
  const [active, setActive] = useState(1);

  const [filter, setFilter] = useState("")


  const filterData = async (e: any) => {
    setFilter(e.target.value)
  }

  return (
    <>
      <ToastContainer />
      <section className=" bg-light-v-1 py-[20px] md:py-[80px] dark:bg-black-v-1">
        <div className="container ">
          <div className="p-5 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
            <div className="flex justify-between gap-5 mb-[26px] md:mb-40">
              <p className="sec-title">Trade History</p>
              <Image src="/assets/history/dots.svg" width={24} height={24} alt="dots" className="cursor-pointer md:hidden block" />
              <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] py-[13px] px-[10px] ">
                <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
                <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent]" onChange={(e) => filterData(e)} />
              </div>
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
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 4 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(4);
                  }}
                >
                  Convert History
                </button>
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
                  <Image src="/assets/history/calender.svg" width={24} height={24} alt="calender" />
                  <p className="nav-text-sm">Month</p>
                  <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="dropdown" />
                </div>
                <div className="p-[5px] flex items-center gap-[10px] cursor-pointer">
                  <Image src="/assets/history/filter.svg" width={24} height={24} alt="filter" />
                  <p className="nav-text-sm">Filter</p>
                  <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="dropdown" />
                </div>
                <Image src="/assets/history/dots.svg" width={24} height={24} alt="dots" className="cursor-pointer" />
              </div>
            </div>
            {active === 1 && (
             <OrderTable filter={filter}/>
            )}
            {active === 2 && (
           <DepositTable filter={filter}/>
            )}
            {active === 3 && (
            <WithdrawTable filter={filter}/>
            )}
            {active === 4 && (
         <ConvertTable />
            )}
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
