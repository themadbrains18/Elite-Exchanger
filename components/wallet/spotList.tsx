import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactPaginate from 'react-paginate';
import IconsComponent from '../snippets/icons';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Deposit from '../snippets/deposit';
import Withdraw from '../snippets/withdraw';
import StakingModel from '../snippets/stake/staking';
import TransferModal from '../future/popups/transfer-modal';
import WithdrawAuthenticationModelPopup from './withdrawAuthentication';
import { currencyFormatter } from '../snippets/market/buySellCard';
import { useWebSocket } from '@/libs/WebSocketContext';
import { truncateNumber } from '@/libs/subdomain';

interface propsData {
  networks: any;
  filter: string;
  refreshData?: Function
}

const SpotList = (props: propsData): any => {
  const [currentItems, setCurrentItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [total, setTotal] = useState(0)
  const { mode } = useContext(Context)
  const { status, data: session } = useSession();
  const [show1, setShow1] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(Object);
  const [withdrawActive, setWithdrawActive] = useState(false);
  const [depositActive, setDepositActive] = useState(false);
  const [withdrawShow, setWithdrawShow] = useState(false);
  const [selectedCoinBalance, setSelectedCoinBalance] = useState(0.00);
  const [popupMode, setPopupMode] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(false);
  const [imgSrc2, setImgSrc2] = useState(false);


  let itemsPerPage = 10;
  const wbsocket = useWebSocket();

  const socketListenerRef = useRef<(event: MessageEvent) => void>();
  useEffect(() => {
    const handleSocketMessage = (event: any) => {
      const data = JSON.parse(event.data).data;
      let eventDataType = JSON.parse(event.data).type;

      if (eventDataType === "convert") {
        if (session) {
          getSpotData();
        }
      }
    };
    if (wbsocket && wbsocket.readyState === WebSocket.OPEN) {
      if (socketListenerRef.current) {
        wbsocket.removeEventListener('message', socketListenerRef.current);
      }
      socketListenerRef.current = handleSocketMessage;
      wbsocket.addEventListener('message', handleSocketMessage);
    }
    return () => {
      if (wbsocket) {
        wbsocket.removeEventListener('message', handleSocketMessage);
      }
    };
  }, [wbsocket]);

  useEffect(() => {
    getSpotData()
  }, [itemOffset, props?.filter, popupMode])


  async function getSpotData() {
    let spotHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/assets/type?type=main_wallet&itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
      method: "GET",
      headers: {
        "Authorization": session?.user?.access_token
      },
    }).then(response => response.json());


    setTotal(spotHistory?.data?.totalLength)
    if (props?.filter !== "") {
      let data = spotHistory?.data?.data.filter((item: any) => {
        return item?.token !== null ? item?.token?.symbol.toLowerCase().includes(props?.filter.toLowerCase()) : item?.global_token?.symbol.toLowerCase().includes(props?.filter.toLowerCase());
      })
      setCurrentItems(data);
    }
    else {
      setCurrentItems(spotHistory?.data?.data);

    }

  }
  const setHeight = (e: any) => {
    let parent = e.currentTarget.closest(".iconParent");
    let parentHeight = parent.nextElementSibling.scrollHeight;
    parent.classList.toggle("show");
    if (parent.classList.contains("show")) {
      parent.nextElementSibling.setAttribute("style", `height:${parentHeight}px; overflow-x:auto`);
    } else {
      parent.nextElementSibling.removeAttribute("style");
    }
  }


  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % total;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="overflow-x-auto">
        {/* This is for desktop version */}
        <table width="100%" className="lg:min-w-[1000px] w-full max-[1023px]:hidden">
          <thead>
            <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
              <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                <div className="flex ">
                  <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className=" py-5">
                <div className="flex  lg:justify-start justify-center ">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Avbl. Balance</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
              <th className="py-5">
                <div className="flex lg:justify-start justify-end">
                  <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>

              <th className="py-5 max-[1023px]:hidden ">
                <div className=" flex lg:justify-start justify-end">
                  <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                  <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: number) => {
              // ===================================
              // Stacking button enable or disable
              // ===================================
              let cursor = false;
              if (item?.token !== null && item?.token?.token_stakes?.length > 0 && item?.token?.token_stakes[0]?.status === true) {
                cursor = true;
              }
              if (item?.global_token !== null && item?.global_token?.token_stakes?.length > 0 && item?.global_token?.token_stakes[0]?.status === true) {
                cursor = true;
              }
              // ================================
              // Trade button enable or disable
              // ================================
              let tradeCusrsor = false;
              if (item.token !== null && item?.token?.tradepair !== null) {
                tradeCusrsor = true;
              }
              if (item.global_token !== null && item?.global_token?.tradepair !== null) {
                tradeCusrsor = true;
              }
              return (
                <tr key={index} className="rounded-5 group ">
                  <td className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                      <Image src={`${imgSrc2 ? '/assets/history/Coin.svg' : item.token !== null ? item?.token?.image : item?.global_token?.image}`} className={`${item?.symbol === "XRP" && "bg-white rounded-full "}`} width={30} height={30} alt="coins" onError={() => setImgSrc2(true)} />
                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                        <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                        {/* <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p> */}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="info-14-18 dark:text-white  lg:text-start text-center">{currencyFormatter(truncateNumber(item?.balance, 6))}</p>
                  </td>
                  <td className="lg:text-start text-end">
                    <p className="info-14-18 dark:text-white">${item.token !== null ? currencyFormatter(truncateNumber(item?.token?.price, 6)) : currencyFormatter(truncateNumber(item?.global_token?.price, 6))}</p>
                  </td>

                  <td className="max-[1023px]:hidden ">
                    <div className="flex items-center gap-[10px]">
                      <button onClick={() => {
                         if (session?.user?.kyc !== 'approve') {
                          setDepositActive(true);
                          setWithdrawShow(true);
                        }
                        else{
                          setShow1(1); setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                        }

                      }} className="max-w-[50%] w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                        <span className="text-primary block">Deposit</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                      <button onClick={() => {
                        if (session?.user.TwoFA === false || (session?.user?.email === '' || session?.user?.email === null) || session?.user?.TwoFA === false) {
                          setWithdrawActive(true);
                          setWithdrawShow(true);
                        }
                        else {

                          const expire = new Date(`${session?.user?.pwdupdatedAt}`).getTime();
                          const updateDate = Date.now();
                          let expireDate = Math.floor(expire / 1000);
                          let currentDate = Math.floor(updateDate / 1000);
                  

                          if (isNaN(expireDate) || currentDate >= expireDate) {
                            setSelectedCoinBalance(item?.balance);
                            setShow1(2);
                            setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                          }
                          else {
                            toast.warning('You cannot do any action next 24 hours');
                          }
                        }

                      }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                        <span className="text-primary block">Withdraw</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>

                      <button onClick={() => {
                        setSelectedCoinBalance(item?.balance);
                        setPopupMode(3);
                        setShow1(4);
                        setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                      }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                        <span className="text-primary block">Transfer</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>

                      <button onClick={() => {
                        setSelectedCoin(item?.token !== null ? item?.token : item?.global_token);
                        setSelectedCoinBalance(item?.balance);
                        setShow1(3);

                      }} disabled={!cursor} className={` max-w-[100%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center rounded-[5px] sec-text !text-[14px]  ${cursor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                        <span className="text-primary block">Staking</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>

                      <button onClick={() => router.push(`/chart/${item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}`)} disabled={!tradeCusrsor} className={`max-w-[100%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center rounded-[5px] sec-text !text-[14px]  ${tradeCusrsor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                        <span className="text-primary block">Trade</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                    </div>
                  </td>
                </tr>
              );

            })}

            {currentItems && currentItems?.length === 0 &&
              <tr>
                <td colSpan={5}>
                  <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                    <Image
                      src="/assets/refer/empty.svg"
                      alt="emplty table"
                      width={107}
                      height={104}
                    />
                    <p > No Record Found </p>
                  </div>

                </td>
              </tr>
            }
          </tbody>
        </table>

        {/* This is for responsive Version */}
        <div className="lg:hidden">
          {/* table head */}
          <div className="grid grid-cols-3 gap-[10px] border-b border-t border-grey-v-3 dark:border-opacity-[15%]">

            <div className="flex items-center py-5">
              <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
              <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
            </div>

            <div className="flex items-center lg:justify-start justify-center ">
              <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Balance</p>
              <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
            </div>

            <div className="flex items-center lg:justify-start justify-end">
              <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price</p>
              <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
            </div>

          </div>

          {/* table content */}
          <div className="">
            {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: number) => {
              // ===================================
              // Stacking button enable or disable
              // ===================================
              let cursor = false;
              if (item?.token !== null && item?.token?.token_stakes?.length > 0 && item?.token?.token_stakes[0]?.status === true) {
                cursor = true;
              }
              if (item?.global_token !== null && item?.global_token?.token_stakes?.length > 0 && item?.global_token?.token_stakes[0]?.status === true) {
                cursor = true;
              }
              // ================================
              // Trade button enable or disable
              // ================================
              let tradeCusrsor = false;
              if (item.token !== null && item?.token?.tradepair !== null) {
                tradeCusrsor = true;
              }
              if (item.global_token !== null && item?.global_token?.tradepair !== null) {
                tradeCusrsor = true;
              }
              return (
                <div key={index} className="rounded-5 group grid grid-cols-3  gap-x-[10px]  items-center">
                  <div className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                    <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                      <Image src={`${imgSrc ? '/assets/history/Coin.svg' : item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={28} height={28} alt="coins" className={`${(item?.token?.symbol || item?.global_token?.symbol) === "XRP" && "bg-white rounded-full"} max-w-[20px] md:max-w-[30px] w-full`} onError={() => setImgSrc(true)} />
                      <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                        <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                        <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="info-14-18 dark:text-white  lg:text-start text-center">{currencyFormatter(item?.balance.toFixed(2))}</p>
                  </div>
                  <div className="iconParent lg:text-start text-end flex items-center justify-between">
                    <p className="info-14-18 dark:text-white">${item.token !== null ? currencyFormatter(item?.token?.price.toFixed(5)) : currencyFormatter(item?.global_token?.price.toFixed(5))}</p>
                    <div onClick={(e) => { setHeight(e) }}>
                      <IconsComponent type="downArrow" hover={false} active={false} />
                    </div>
                  </div>
                  <div className={`fullWidthContent overflow-x-auto`}>
                    <div className="flex items-center gap-[10px] justify-center pb-[10px] w-max overflow-x-auto">
                      <button onClick={() => { setShow1(1) }} className="max-w-[50%] w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                        <span className="text-primary block">Deposit</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                      <button onClick={() => {
                        const expire = new Date(`${session?.user?.pwdupdatedAt}`).getTime();
                        const updateDate = Date.now();

                        let expireDate = Math.floor(expire / 1000);
                        let currentDate = Math.floor(updateDate / 1000);
                        if (currentDate >= expireDate) {
                          setSelectedCoinBalance(item?.balance);
                          setShow1(2);
                          setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                        }
                        else {
                          toast.warning('You cannot do any action next 24 hours');
                        }

                      }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                        <span className="text-primary block">Withdraw</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                      <button onClick={() => {
                        setSelectedCoinBalance(item?.balance);
                        setPopupMode(3);
                        setShow1(4);
                        setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                      }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                        <span className="text-primary block">Transfer</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                      <button onClick={() => {
                        setSelectedCoin(item?.token !== null ? item?.token : item?.global_token);
                        setSelectedCoinBalance(item?.balance);
                        setShow1(3);
                      }} disabled={!cursor} className={` max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center rounded-[5px] sec-text !text-[14px]  ${cursor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                        <span className="text-primary block">Staking</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                      <button onClick={() => router.push(`/chart/${item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}`)} disabled={!tradeCusrsor}
                        className={`max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center rounded-[5px] sec-text !text-[14px]  ${tradeCusrsor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                        <span className="text-primary block">Trade</span>
                        <IconsComponent type="openInNewTab" hover={false} active={false} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {currentItems && currentItems?.length === 0 &&
              <div className={` py-[50px] flex flex-col items-center justify-center ${mode === "dark" ? 'text-[#ffffff]' : 'text-[#000000]'}`}>
                <Image
                  src="/assets/refer/empty.svg"
                  alt="emplty table"
                  width={107}
                  height={104}
                />
                <p > No Record Found </p>
              </div>
            }
          </div>
        </div>
      </div>

      <div className="flex pt-[25px] items-center justify-between">
        <p className="info-12 md:footer-text !text-gamma">{total} assets</p>
        <ReactPaginate
          className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""
            }`}
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          forcePage={currentPage}
        />
      </div>

      {
        show1 === 1 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <Deposit setShow1={setShow1} networks={props.networks} session={session} token={selectedCoin} />
        </>
      }
      {
        show1 === 2 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>

          <Withdraw setShow1={setShow1} networks={props.networks} session={session} token={selectedCoin} selectedCoinBalance={selectedCoinBalance} refreshData={props?.refreshData} />

        </>
      }
      {
        show1 === 3 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <StakingModel setShow1={setShow1} session={session} token={selectedCoin} selectedCoinBalance={selectedCoinBalance} refreshData={props?.refreshData} />
        </>
      }
      {
        show1 === 4 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <TransferModal setOverlay={setShow1} setPopupMode={setPopupMode} popupMode={popupMode} token={selectedCoin} assets={currentItems} wallet_type="main_wallet" />
        </>
      }
      {withdrawActive === true &&
        <WithdrawAuthenticationModelPopup setActive={setWithdrawActive} setShow={setWithdrawShow} show={withdrawShow} title="Withdrawal Security Settings" type="withdraw"/>
      }
      {depositActive === true &&
        <WithdrawAuthenticationModelPopup setActive={setDepositActive} setShow={setWithdrawShow} show={withdrawShow} title="Deposit Security Settings" type="deposit"/>
      }
    </>
  )
}

export default SpotList
