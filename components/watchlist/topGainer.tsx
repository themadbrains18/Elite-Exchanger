import React, { useState } from 'react'
import IconsComponent from "../snippets/icons";
import Image from "next/image";

const TopGainer = () => {

    const [show,setShow]= useState(1)

    let data = [
        {
          image: "Coin.svg",
          name: "Bitcoin",
          symbol: "BTC",
          status: "high",
          price: "43,975.72",
          change24h: "+4%",
        },
        {
          image: "Coin1.svg",
          name: "Ethereum",
          symbol: "ETH",
          status: "high",
          price: "43,975.72",
          change24h: "+4%",
        },
        {
          image: "Coin2.svg",
          name: "XRP",
          symbol: "XRP",
          status: "high",
          price: "43,975.72",
          change24h: "+4%",
        },
        {
          image: "Coin3.svg",
          name: "Solana",
          symbol: "SOL",
          status: "high",
          price: "43,975.72",
          change24h: "+4%",
        },
        {
          image: "Coin4.svg",
          name: "Tron",
          symbol: "TRX",
          status: "high",
          price: "43,975.72",
          change24h: "+4%",
        },
      ];
    
      return (
        <div className="p-20 md:p-40 rounded-10 mt-30 bg-white dark:bg-d-bg-primary">
          <div className="flex gap-30 border-b  justify-between border-grey-v-1 dark:border-opacity-[15%]">
          <button
                className={` nav-text-sm md:nav-text-lg  whitespace-nowrap after:block after:top-full after:mt-[15px] after:h-[2px] after:w-[0%] after:bg-primary after:transition-all after:ease-linear after:duration-500 ${show === 1 && "border-primary after:w-[100%] after:bottom !text-primary"}`}
                onClick={() => {
                    setShow(1);
                }}
              >
                Top Gainer
              </button>
              <button
               className={` nav-text-sm md:nav-text-lg  whitespace-nowrap after:block after:top-full after:mt-[15px] after:h-[2px] after:w-[0%] after:bg-primary after:transition-all after:ease-linear after:duration-500 ${show === 2 && "border-primary after:w-[100%] after:bottom !text-primary"}`}
                onClick={() => {
                    setShow(2);
                }}
              >
                Top Loser
              </button>
              <button
               className={` nav-text-sm md:nav-text-lg  whitespace-nowrap after:block after:top-full after:mt-[15px] after:h-[2px] after:w-[0%] after:bg-primary after:transition-all after:ease-linear after:duration-500 ${show === 3 && "border-primary after:w-[100%] after:bottom !text-primary"}`}
                onClick={() => {
                    setShow(3);
                }}
              >
                New in Market
              </button>
          </div>
          <div className="overflow-x-auto">
            <table width="100%" className="">
              <thead>
                <tr className="border-b border-grey-v-3 dark:border-opacity-[15%] ">
                  <th className="">
                    <div className="flex ">
                      <p className="text-start info-12 dark:text-gamma">Coin Name</p>
                      <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                    </div>
                  </th>
                  <th className=" py-5">
                    <div className="flex md:justify-start justify-end">
                      <p className="text-start  info-12 dark:text-gamma">Coin Price</p>
                      <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                    </div>
                  </th>
                  <th className=" py-5">
                    <div className="hidden md:flex">
                      <p className="text-start  info-12 dark:text-gamma">24%</p>
                      <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={index} className="hover:dark:bg-black-v-1 hover:bg-[#FEF2F2] cursor-pointer">
                      <td className="">
                        <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                          <Image src={`/assets/history/${item.image}`} width={30} height={30} alt="coins" />
                          <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-1">
                            <p className="info-14-18 dark:text-white">{item.name}</p>
                            <p className="info-12 !text-primary py-0 md:py-[2px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className='md:text-start text-end'>
                        <p className="nav-text-sm dark:text-white ">${item.price}</p>
                      </td>
                      <td>
                        <div className={` items-center gap-[10px] md:flex hidden`}>
                          <p className={`nav-text-sm  ${item.status == "high" ? "!text-[#03A66D]" : "!text-[#DC2626]"}`}>{item.change24h}</p>
                          <IconsComponent type={item.status} active={false} hover={false} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default TopGainer
