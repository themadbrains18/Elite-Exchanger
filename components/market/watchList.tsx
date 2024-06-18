import React from "react";
import IconsComponent from "../snippets/icons";
import Image from "next/image";
import { useRouter } from "next/router";

interface propsData {
  coinList: any
}
const WatchList = (props: propsData) => {
  let data = props.coinList;
  const router = useRouter()

  return (
    <div className="p-20 md:p-40 rounded-10 mt-30 bg-white dark:bg-d-bg-primary">
      <div className="flex border-b pb-[10px] justify-between border-grey-v-1 dark:border-opacity-[15%]">
        <p className="sec-text">Watchlist</p>

        <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="arrow" className="-rotate-90" />
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
                <div className="flex">
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
            {data?.map((item: any, index: any) => {
              return (
                <tr key={index} className="dark:hover:bg-black-v-1 hover:bg-[#FEF2F2] cursor-pointer" onClick={() => router.push(`/chart/${item.symbol}`)}>
                  <td className="">
                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                      <Image src={`${item.image}`} width={30} height={30} alt="coins" />
                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-1">
                        {/* <p className="info-14-18 dark:text-white">{item.name}</p> */}
                        <p className="info-12 !text-primary py-0 md:py-[2px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="nav-text-sm dark:text-white ">${new Intl.NumberFormat().format(item.price.toFixed(3))}</p>
                  </td>
                  <td>
                    <div className={` items-center gap-[10px] md:flex hidden`}>
                      <p className={`nav-text-sm  ${item.status == "high" ? "!text-[#03A66D]" : "!text-[#DC2626]"}`}>{item.totalSupply && item.totalSupply.toLocaleString('en-US')}</p>
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
  )
};

export default WatchList;
