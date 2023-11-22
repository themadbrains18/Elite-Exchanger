import Image from 'next/image';
import React from 'react'

const OpenOrderTable = () => {
    const currentItems = [
        {
            time:"19:48:43",
            date:"2022-02-23",
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            type:"Limit",
            side:"Open Long",
            price:"-",
            Amount:'Close position',
            filled:"0.0 USDT",
            reduceonly:"Yes",
            postOnly:"No",
            triggerCondition:"Mark Price >= 40,000.0",
            tpsl:"--"
        },
        {
            time:"19:48:43",
            date:"2022-02-23",
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            type:"Limit",
            side:"Open Long",
            price:"-",
            Amount:'Close position',
            filled:"0.0 USDT",
            reduceonly:"Yes",
            postOnly:"No",
            triggerCondition:"Mark Price >= 40,000.0",
            tpsl:"--"
        },
        {
            time:"19:48:43",
            date:"2022-02-23",
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            type:"Limit",
            side:"Open Long",
            price:"-",
            Amount:'Close position',
            filled:"0.0 USDT",
            reduceonly:"Yes",
            postOnly:"No",
            triggerCondition:"Mark Price >= 40,000.0",
            tpsl:"--"
        },
        {
            time:"19:48:43",
            date:"2022-02-23",
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            type:"Limit",
            side:"Open Long",
            price:"-",
            Amount:'Close position',
            filled:"0.0 USDT",
            reduceonly:"Yes",
            postOnly:"No",
            triggerCondition:"Mark Price >= 40,000.0",
            tpsl:"--"
        },
    ]
  return (
    <>
         <div className="overflow-x-auto hide-scroller h-[234px]">
              <table width="100%" className="min-w-[1200px] w-full">
                <thead>
                    <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Time</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Symbol</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Type</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Side</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Price</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Amount</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Filled</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Reduce Only</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Post Only</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">Trigger Conditions</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                        <th className="py-[10px]">
                            <div className="flex ">
                                <p className="text-start top-label dark:text-gamma">TP/SL</p>
                                <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                  currentItems?.map((item: any, index: number) => {
                    return(
                        <tr key={index}>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.date}</p>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.time}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <div>
                                    <p className="info-14 !text-[12px] dark:text-white">{item.symbol1}</p>
                                    <p className="top-label">{item.symbol2}</p>
                                </div>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.type}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.side}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.price}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.Amount}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.filled}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.reduceonly}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.postOnly}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.triggerCondition}</p>
                            </td>
                            <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                                <p className="top-label !font-[600] dark:!text-white !text-black">{item.tpsl}</p>
                            </td>
                        </tr>
                    )
                  })
                }
                </tbody>
              </table>
        </div>
    </>
  )
}

export default OpenOrderTable;