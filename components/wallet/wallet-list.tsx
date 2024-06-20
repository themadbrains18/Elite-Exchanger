import React, { useEffect, useState } from "react";
import IconsComponent from "../snippets/icons";
import Image from "next/image";
import SpotList from "./spotList";
import FutureList from "./futureList";
import DepositList from "./depositList";
import WithdrawList from "./withdrawList";
import ConvertList from "./convertList";
import { useSession } from "next-auth/react";

interface propsData {
  coinList: any,
  networks: any,
  session: any,
  refreshData?:Function

}

const WalletList = (props: propsData): any => {

  const [active1, setActive1] = useState(1);
  const [filter, setFilter] = useState('');

  const { data: session } = useSession();

  const filterData = async (e: any) => {
    if (session?.user.email !== e.target.value){
      setFilter(e.target.value);
    }
  };


  return (
    <>
      <section className="mt-30">
        <div className="p-[15px] md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <div className="flex items-center justify-between w-full md:w-fit">
              <p className="sec-title">Transaction History</p>
              <button className="md:hidden cursor-pointer">
                <IconsComponent type="dots" hover={false} active={false} />
              </button>
            </div>
            <form autoComplete="off">
            <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px] w-full py-[13px] px-[10px] ">
              <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
              <input  type="search" placeholder="Search" autoComplete="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" onChange={filterData} />
            </div>
            </form>
          </div>

          <div className="flex items-center gap-[25px] justify-between mt-[51px]">
            <div className="flex  gap-[25px]  w-max trade_history_scroll overflow-auto">
              <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] ${active1 === 1 && "!text-primary border-primary"}`} onClick={() => { setActive1(1); }}>
                Spot Wallet
              </button>
              <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px] ${active1 === 4 && "!text-primary border-primary"}`} onClick={() => { setActive1(4) }}>
                Future Wallet
              </button>
              <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px]  ${active1 === 2 && "!text-primary border-primary"}`} onClick={() => setActive1(2)}>
                Deposit History
              </button>
              <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px]  ${active1 === 3 && "!text-primary border-primary"}`} onClick={() => setActive1(3)}>
                Withdraw History
              </button>
              <button className={`sec-text text-center text-gamma border-b-2 border-[transparent] pb-[25px]  ${active1 === 5 && "!text-primary border-primary"}`} onClick={() => setActive1(5)}>
                Convert History
              </button>
            </div>

          </div>
          {
            active1 === 1 &&
            <>
              <SpotList networks={props.networks} filter={filter} refreshData={props?.refreshData}/>
            </>
          }

          {
            active1 === 2 &&
            <DepositList filter={filter} />
          }

          {
            active1 === 3 &&
            <WithdrawList filter={filter} />
          }

          {
            active1 === 4 &&
            <FutureList filter={filter} />
          }
          {
            active1 === 5 &&
            <ConvertList filter={filter}/>
          }
        </div>
      </section>


    </>
  );
};

export default WalletList;
