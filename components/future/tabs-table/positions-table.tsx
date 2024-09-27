import IconsComponent from '@/components/snippets/icons';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ProfitLossModal from '../popups/profit-loss-model';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModel from '@/components/snippets/confirmation';
import AES from 'crypto-js/aes';
import { useWebSocket } from '@/libs/WebSocketContext';
import { currencyFormatter } from '@/components/snippets/market/buySellCard';
import ConfirmationClouserModel from '@/components/snippets/confirm-clouser';
import { truncateNumber } from '@/libs/subdomain';
import { useRouter } from 'next/router';

interface propsData {
  positions?: any;
  currentToken?: any;
}

const PositionsTable = (props: propsData) => {
  const [modelPopup, setModelPopup] = useState(0);
  const [modelOverlay, setModelOverlay] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(Object);
  const { status, data: session } = useSession();
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [positionId, setPositionId] = useState('');
  let [positionData, setPositionData] = useState();
  const wbsocket = useWebSocket();

  const closePositionOrder = async (id: string) => {
    props?.positions.map((item: any, index: number) => {
      if (item.id == id) {
        setPositionData(item);
        // console.log("test done");
      }
    });

    setActive(true);
    setShow(true);
  }

  const actionPerform = async () => {
    let obj = { "id": positionId };
    const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`);
    let record = encodeURIComponent(ciphertext.toString());

    let closeReponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/closeposition`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": session?.user?.access_token
      },
      body: JSON.stringify(record)
    }).then(response => response.json());

    if (closeReponse?.data?.status !== 200) {
      toast.error(closeReponse?.data?.message);
    }
    else {
      if (wbsocket) {
        let position = {
          ws_type: 'position'
        }
        wbsocket.send(JSON.stringify(position));
      }

      toast.success(closeReponse?.data?.message);
      setActive(false);
      setShow(false);
      setPositionId('');
    }
  }

  const closeAllPosition = async () => {
    try {
      let obj = { "userid": session?.user?.user_id };
      let closeReponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/future/closeallposition`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(obj)
      }).then(response => response.json());

      if (closeReponse?.data?.status === 200) {
        if (wbsocket) {
          let position = {
            ws_type: 'position'
          }
          wbsocket.send(JSON.stringify(position));
        }
        toast.success('closed all position successfully!!.');
        setActive(false);
        setShow(false);
        setPositionId('');
      }

    } catch (error) {
      console.log(error, "=error in close position");
    }
  }

  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <div className="overflow-x-auto h-[234px]">
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
                  <p className="  top-label dark:text-gamma">Qty</p>
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
                  <p className="  top-label dark:text-gamma">Margin</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-[10px]">
                <div className="flex">
                  <p className="  top-label dark:text-gamma">Unrealized PnL</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-[10px]">
                <div className="flex">
                  <p className="  top-label dark:text-gamma">Realized PnL</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-[10px]">
                <div className="flex">
                  <p className="  top-label dark:!text-[#cccc56] !font-[600]" onClick={() => { props?.positions && props?.positions.length > 0 ? closeAllPosition : '' }}>Close All Positions</p>
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
                session && props?.positions && props?.positions.length > 0 && props?.positions?.filter((item: any) => item?.symbol === slug).map((item: any, index: number) => {
                  let tpsl = '--';
                  {
                    console.log(item.direction,"item.direction");
                    
                    item?.futureOpenOrders !== null && item?.futureOpenOrders?.map((oo: any) => {
                      if (tpsl === '--' && oo?.type === 'take profit market') {
                        tpsl = oo?.trigger;
                      }
                      else if (oo?.type === 'stop market') {
                        tpsl = tpsl + '/' + oo?.trigger;
                      }
                    })
                  }
                  return (
                    <tr key={index}>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <div className={`pl-[5px] pt-[5px] border-l-[5px] ${(item?.direction === 'long') ? 'border-[#03A66D]' : 'border-[#f74646]'} flex gap-[8px] items-center`}>
                          <div>
                            <p className="info-14 !text-[12px] dark:text-white">{item.symbol}</p>
                            <p className={`top-label ${item?.direction === 'long' ? '!text-buy' : '!text-sell'}`}>{item?.leverage_type} {item.leverage}x</p>
                          </div>
                        </div>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <p className={`top-label !font-[600] ${item?.qty < 0 ? '!text-sell' : '!text-buy'}`}>{item?.direction !== 'long' ? '-' : ''}{item?.qty}</p>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <p className={`top-label !font-[600] dark:!text-white !text-black`}>{item?.size}</p>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <p className="top-label !font-[600] dark:!text-white !text-black">{currencyFormatter(truncateNumber(item?.entry_price, 6))}</p>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <p className="top-label !font-[600] dark:!text-white !text-black">{item?.token !== null ? currencyFormatter(truncateNumber(item?.token?.price, 6)) : currencyFormatter(truncateNumber(item?.global_token?.price, 5))}</p>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <p className="top-label !text-[#f7a600] !font-[600]">{currencyFormatter(truncateNumber(item?.liq_price, 6))}</p>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <p className="top-label !font-[600] dark:!text-white !text-black">{truncateNumber(item?.margin, 6)}</p>
                        <p className="top-label !font-[600] dark:!text-white !text-black">  </p>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <div className='flex items-center gap-[5px]'>
                          <div>
                            <p className={`top-label !font-[600] ${item?.pnl > 0 ? '!text-buy' : '!text-sell'}`}>{truncateNumber(item?.pnl,8)} USDT</p>
                          </div>
                        </div>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <div className='flex items-center gap-[5px]'>
                          <div >
                            <p className={`top-label !font-[600] !text-sell`}>-{truncateNumber(item?.realized_pnl,8)} USDT</p>
                          </div>
                        </div>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%] cursor-pointer'>
                        <div className='flex items-center'>
                          <p className='top-label dark:!text-[#cccc56] !font-[600] pr-[20px]' onClick={() => { closePositionOrder(item?.id); setPositionId(item?.id); }}>Close Position</p>

                        </div>
                      </td>
                      <td className='border-b border-t border-grey-v-3 dark:border-opacity-[15%]'>
                        <div className='flex items-center gap-[5px]'>
                          <div>
                            {item?.profitlosses && item?.profitlosses.length > 0 &&
                              <div className="top-label !font-[600] flex ">
                                <p className='!text-buy'>{item?.profitlosses[0]?.trigger_profit}</p>/<p className='!text-sell'>{item?.profitlosses[0]?.trigger_loss}</p>
                              </div>
                            }
                            {item?.profitlosses && item?.profitlosses.length === 0 &&
                              <div className="top-label !font-[600] flex ">--</div>
                            }
                          </div>
                          <div className='cursor-pointer' onClick={() => { setModelPopup(1); setModelOverlay(true); setSelectedPosition(item) }}>
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
      {/* overlay */}
      <div className={`bg-black z-[9] duration-300 fixed top-0 left-0 h-full w-full opacity-0 invisible ${modelOverlay && '!opacity-[70%] !visible'}`}></div>
      <ProfitLossModal setModelOverlay={setModelOverlay} setModelPopup={setModelPopup} modelPopup={modelPopup} modelOverlay={modelOverlay} currentToken={props?.currentToken} entryPrice={selectedPosition?.entry_price} leverage={selectedPosition?.leverage} sizeValue={selectedPosition?.size} show={selectedPosition?.direction} actionType="position" position={selectedPosition} />
      {active === true &&
        <ConfirmationClouserModel setActive={setActive} positionData={positionData} setShow={setShow} title='Confirm Position Closure' message='' actionPerform={actionPerform} show={show} />
      }

    </>
  )
}

export default PositionsTable;