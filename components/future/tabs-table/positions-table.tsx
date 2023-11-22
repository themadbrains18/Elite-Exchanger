import IconsComponent from '@/components/snippets/icons';
import Image from 'next/image';
import React from 'react'

const PositionsTable = () => {
    const currentItems = [
        {
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            symbol3X:"5x",
            Size:"119.71 USDT",
            Eprice:"39,904.30",
            Mprice:"39,905.10",
            Lqprice:"--",
            MarginRatio:"0.10%",
            Margin:"23.94 USDT",
            MarginType:"Cross",
            PnlRoe:"-0.01 USDT",
            PnlRoePer:"(--0.02%)",
            ClosePositions1:"39,855.0",
            ClosePositions2:"0.003",
            Tpsl:"40,000 / 38,000"
        },
        {
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            symbol3X:"5x",
            Size:"119.71 USDT",
            Eprice:"39,904.30",
            Mprice:"39,905.10",
            Lqprice:"--",
            MarginRatio:"0.10%",
            Margin:"23.94 USDT",
            MarginType:"Cross",
            PnlRoe:"-0.01 USDT",
            PnlRoePer:"(--0.02%)",
            ClosePositions1:"39,855.0",
            ClosePositions2:"0.003",
            Tpsl:"40,000 / 38,000"
        },
        {
            symbol1:"BTCUSDT",
            symbol2:"Perpetual",
            symbol3X:"5x",
            Size:"119.71 USDT",
            Eprice:"39,904.30",
            Mprice:"39,905.10",
            Lqprice:"--",
            MarginRatio:"0.10%",
            Margin:"23.94 USDT",
            MarginType:"Cross",
            PnlRoe:"-0.01 USDT",
            PnlRoePer:"(--0.02%)",
            ClosePositions1:"39,855.0",
            ClosePositions2:"0.003",
            Tpsl:"40,000 / 38,000"
        }
    ]
  return (
    <>
        <div className="overflow-x-auto hide-scroller h-[234px]">
              <table width="100%" className="min-w-[1200px] w-full">
                <thead>
                  <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">

                    <th className="py-[10px]">
                      <div className="flex ">
                        <p className="text-start top-label dark:text-gamma">Symbol</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className="py-[10px]">
                      <div className="flex">
                        <p className="  top-label dark:text-gamma">Size</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="text-start  top-label dark:text-gamma">Entry Price</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="text-start  top-label dark:text-gamma">Market Price</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="text-start  top-label dark:text-gamma">Liq.Price</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="text-start  top-label dark:text-gamma">Margin Ratio </p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="  top-label dark:text-gamma">Margin</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="  top-label dark:text-gamma">PNL(ROE %)</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="  top-label dark:!text-[#cccc56] !font-[600]">Close All Positions</p>
                        {/* <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" /> */}
                      </div>
                    </th>
                    <th className=" py-[10px]">
                      <div className="flex">
                        <p className="  top-label dark:text-gamma">TP/SL for Positions</p>
                        <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                  currentItems?.map((item: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                          <div className='pl-[5px] pt-[5px] border-l-[5px] border-[#03A66D] flex gap-[8px] items-center'>
                            <div>
                              <p className="info-14 !text-[12px] dark:text-white">{item.symbol1}</p>
                              <p className="top-label">{item.symbol2}</p>
                            </div>
                            <p className="bg-[#13c2c21f] px-[5px] text-[#13c2c2] text-[12px]">{item.symbol3X}</p>
                          </div>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <p className="top-label !font-[600] !text-buy">{item.Size}</p>
                        </td>
                         <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.Eprice}</p>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.Mprice}</p>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.Lqprice}</p>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.MarginRatio}</p>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.Margin}</p>
                            <p className="top-label !font-[600] dark:!text-white !text-black">{item.MarginType}</p>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                            <div className='flex items-center gap-[5px]'>
                                <div>
                                    <p className="top-label !font-[600] !text-sell">{item.PnlRoe}</p>
                                    <p className="top-label !font-[600] !text-sell">{item.PnlRoePer}</p>
                                </div>
                                <IconsComponent type='sendIcon' />
                            </div>
                        </td> 
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                           <div className='flex items-center'>
                                <p className='top-label dark:!text-[#cccc56] !font-[600] pr-[20px]'>Market</p>
                                <div className='flex items-center gap-[20px]'>
                                    <p className='top-label dark:!text-[#cccc56] !font-[600] pl-[20px] border-l border-grey-v-3 dark:border-opacity-[15%]'>Limit</p>
                                    <div className='flex items-center gap-[5px]'>
                                        <p className='top-label !font-[600] p-[4px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer'>{item.ClosePositions1}</p>
                                        <p className='top-label !font-[600] p-[4px] dark:bg-[#373d4e] bg-[#e5ecf0] rounded-[4px] cursor-pointer'>{item.ClosePositions2}</p>
                                    </div>
                                </div>
                           </div>
                        </td>
                        <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <div className='flex items-center gap-[5px]'>
                                <div>
                                    <p className="top-label !font-[600] ">{item.Tpsl}</p>
                                </div>
                                <div className='cursor-pointer'>
                                    <IconsComponent type='editIcon' />
                                </div>
                            </div>
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

export default PositionsTable;