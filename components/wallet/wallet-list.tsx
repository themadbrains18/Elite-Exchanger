import React, { useContext, useRef, useState } from "react";
import IconsComponent from "../snippets/icons";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import ReactPaginate from "react-paginate";
import Context from "../contexts/context";
import Deposit from "../snippets/deposit";
import Withdraw from "../snippets/withdraw";
import StakingModel from "../snippets/stake/staking";
import moment from 'moment';

interface propsData {
  coinList: any,
  networks: any,
  session: any,
  withdrawList: any,
  assets: any,
  refreshData: any,
  userConvertList?: any
}

const WalletList = (props: propsData): any => {
  const { mode } = useContext(Context);
  const [coinItemOffset, setCoinItemOffset] = useState(0);
  const [futureItemOffset, setFutureItemOffset] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [active1, setActive1] = useState(1);
  const [show1, setShow1] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(Object);
  const [selectedCoinBalance, setSelectedCoinBalance] = useState(0.00);
  // const [height, setHeight] = useState(false);+
  const router = useRouter();
  const height = useRef(0);

  const setHeight = (e: any) => {
    let parent = e.currentTarget.closest(".iconParent");
    let parentHeight = parent.nextElementSibling.scrollHeight;
    parent.classList.toggle("show");
    if (parent.classList.contains("show")) {
      parent.nextElementSibling.setAttribute("style", `height:${parentHeight}px`);
    } else {
      parent.nextElementSibling.removeAttribute("style");
    }
  }

  function formatDate(date: any) {
    const options: {} = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options)
  }

  let walletDepositHistory = [
    {
      name: "Deposited",
      amount: "$10,000",
      dateTime: "Feb 02, 2022",
      status: "Successful"
    },
    {
      name: "Deposited",
      amount: "$10,000",
      dateTime: "Feb 02, 2022",
      status: "Successful"
    },
    {
      name: "Deposited",
      amount: "$10,000",
      dateTime: "Feb 02, 2022",
      status: "Successful"
    },
    {
      name: "Deposited",
      amount: "$10,000",
      dateTime: "Feb 02, 2022",
      status: "Successful"
    },
    {
      name: "Deposited",
      amount: "$10,000",
      dateTime: "Feb 02, 2022",
      status: "Successful"
    }

  ];

  let dataWithdraw = props?.withdrawList;
  let dataCoinWallet = props.coinList;
  let itemsCoinsPerPage = 10;

  //==========================================================
  // =========== Filter Spot Assets ====================  
  //==========================================================
  let spotAssets = props?.assets.filter((item: any) => {
    return item.walletTtype === 'main_wallet'
  });

  //==========================================================
  //============ Filter Future Assets ==================
  //==========================================================
  let futureAssets = props?.assets.filter((item: any) => {
    return item.walletTtype === 'future_wallet'
  });

  //==========================================================
  //=============Spot wallet pagging start==================
  //==========================================================
  const coinendOffset = coinItemOffset + itemsCoinsPerPage;
  const spotWalletItems = spotAssets.slice(coinItemOffset, coinendOffset);
  const coinpageCount = Math.ceil(spotAssets.length / itemsCoinsPerPage);

  const handleCoinsPageClick = async (event: any) => {
    const newOffset = (event.selected * itemsCoinsPerPage) % spotAssets.length;
    setCoinItemOffset(newOffset);
  };

  //==========================================================
  //=============Future wallet pagging start==================
  //==========================================================
  const futureOffset = futureItemOffset + itemsCoinsPerPage;
  const futureWalletItems = futureAssets.slice(futureItemOffset, futureOffset);
  const futurepageCount = Math.ceil(futureAssets.length / itemsCoinsPerPage);

  const handleFuturePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsCoinsPerPage) % futureAssets.length;
    setFutureItemOffset(newOffset);
  };

  //==========================================================
  //============ Deposit List item pagging ===============
  //==========================================================
  let itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = walletDepositHistory.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(walletDepositHistory.length / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % walletDepositHistory.length;
    setItemOffset(newOffset);
  };

  //==========================================================
  //=========== Withdraw List item pagging ================
  //==========================================================
  let itemsWithdrawPerPage = 10;
  const withdrawendOffset = itemOffset + itemsPerPage;
  const currentWithdrawItems = dataWithdraw && dataWithdraw.length > 0 ? dataWithdraw.slice(itemOffset, withdrawendOffset) : [];
  const pageWithdrawCount = Math.ceil(dataWithdraw.length / itemsPerPage);

  const handleWithDrawPageClick = async (event: any) => {
    const newOffset = (event.selected * itemsWithdrawPerPage) % dataWithdraw && dataWithdraw.length > 0 ? dataWithdraw.length : 0;
    setItemOffset(newOffset);
  }


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
            <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[331px] w-full py-[13px] px-[10px] ">
              <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
              <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent] w-full" />
            </div>
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
                Convert Record
              </button>
            </div>
            <div className="hidden md:flex items-center gap-[15px]">

              <div className="p-[5px] flex gap-[10px] items-center">
                <IconsComponent type="calender" hover={false} active={false} />
                <p className="nav-text-sm">Month</p>
                <Image src="/assets/profile/downarrow.svg" width={24} height={24} alt="arrow" />
              </div>
              <button className="cursor-pointer">
                <IconsComponent type="dots" hover={false} active={false} />
              </button>

            </div>
          </div>
          {
            active1 === 1 &&
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
                        <div className="flex">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5 max-[1023px]:hidden ">
                        <div className=" ">
                          <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {spotWalletItems && spotWalletItems.length > 0 && spotWalletItems?.map((item: any, index: number) => {
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
                      if (item.token !== null && item?.token?.tradePair !== null) {
                        tradeCusrsor = true;
                      }
                      if (item.global_token !== null && item?.global_token?.tradePair !== null) {
                        tradeCusrsor = true;
                      }
                      return (
                        <tr key={index} className="rounded-5 group ">
                          <td className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                              <Image src={`${item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={30} height={30} alt="coins" />
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.balance.toFixed(5)}</p>
                          </td>
                          <td className="lg:text-start text-end">
                            <p className="info-14-18 dark:text-white">${item.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5)}</p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">${(item.token !== null ? item?.token?.price * item?.balance : item?.global_token?.price * item?.balance).toFixed(2)}</p>
                          </td>
                          <td className="max-[1023px]:hidden ">
                            <div className="flex items-center gap-[10px]">
                              <button onClick={() => { setShow1(1) }} className="max-w-[50%] w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Deposit</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                              <button onClick={() => {
                                setSelectedCoinBalance(item?.balance);
                                setShow1(2);
                                setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                              }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Withdraw</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>

                              <button className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
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

                    {spotWalletItems && spotWalletItems.length === 0 &&
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
                    {spotWalletItems && spotWalletItems.length > 0 && spotWalletItems?.map((item: any, index: number) => {
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
                      if (item.token !== null && item?.token?.tradePair !== null) {
                        tradeCusrsor = true;
                      }
                      if (item.global_token !== null && item?.global_token?.tradePair !== null) {
                        tradeCusrsor = true;
                      }
                      return (
                        <div key={index} className="rounded-5 group grid grid-cols-3  gap-x-[10px]  items-center">
                          <div className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                              <Image src={`${item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={28} height={28} alt="coins" className="max-w-[20px] md:max-w-[30px] w-full" />
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.balance.toFixed(2)}</p>
                          </div>
                          <div className="iconParent lg:text-start text-end flex items-center justify-between">
                            <p className="info-14-18 dark:text-white">${item.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5)}</p>
                            <div onClick={(e) => { setHeight(e) }}>
                              <IconsComponent type="downArrow" hover={false} active={false} />
                            </div>
                          </div>
                          <div className={`fullWidthContent`}>
                            <div className="flex items-center gap-[10px] justify-center pb-[10px]">
                              <button onClick={() => { setShow1(1) }} className="max-w-[50%] w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Deposit</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                              <button onClick={() => {
                                setSelectedCoinBalance(item?.balance);
                                setShow1(2);
                                setSelectedCoin(item.token !== null ? item?.token : item?.global_token);
                              }} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Withdraw</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                              <button className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
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
                    {spotWalletItems && spotWalletItems.length === 0 &&
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
                <p className="info-12 md:footer-text !text-gamma">{spotAssets?.length} assets</p>
                <ReactPaginate className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`} breakLabel="..." nextLabel=">" onPageChange={handleCoinsPageClick} pageRangeDisplayed={10} marginPagesDisplayed={2} pageCount={coinpageCount} previousLabel="<" renderOnZeroPageCount={null} />
              </div>
            </>
          }

          {
            active1 === 2 &&
            <>
              <div className="overflow-x-auto">
                <table width="100%" className="lg:min-w-[1000px] w-full">
                  <thead>
                    <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                      <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                        <div className="flex ">
                          <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className=" py-5">
                        <div className="flex  lg:justify-start justify-end ">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="max-[1023px]:hidden py-5">
                        <div className="flex">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Date / Time</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5">
                        <div className="flex justify-end">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems && currentItems.length > 0 && currentItems?.map((item, index) => {
                      return (
                        <tr key={index} className="rounded-5 group dark:hover:bg-black-v-1 hover:bg-[#FEF2F2] cursor-pointer">
                          <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px]  w-full">
                              {/* <Image src={`/assets/history/${item.image}`} width={30} height={30} alt="coins" /> */}
                              <IconsComponent type="deposited" hover={false} active={false} />
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{item?.name}</p>
                                <p className="info-14-18 !text-[10px] lg:hidden">{item?.dateTime}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="info-14-18 dark:text-white  lg:text-start text-end">{item?.amount}</p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">{item?.dateTime}</p>
                          </td>
                          <td className=" text-end">
                            <p className={`info-14-18  ${item?.status == "Successful" ? "text-buy" : "text-cancel"}`}>{item?.status}</p>
                          </td>
                        </tr>
                      );
                    })}

                    {currentItems.length === 0 &&
                      <tr>
                        <td colSpan={4}>
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
              </div>
              <div className="flex pt-[25px] items-center justify-between">
                <p className="info-12 md:footer-text !text-gamma">52 assets</p>
                <ReactPaginate className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`} breakLabel="..." nextLabel=">" onPageChange={handlePageClick} pageRangeDisplayed={5} marginPagesDisplayed={2} pageCount={pageCount} previousLabel="<" renderOnZeroPageCount={null} />
              </div>
            </>
          }

          {
            active1 === 3 &&
            <>
              <div className="overflow-x-auto">
                <table width="100%" className="lg:min-w-[1000px] w-full">
                  <thead>
                    <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                      <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                        <div className="flex ">
                          <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Token</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className=" py-5">
                        <div className="flex  lg:justify-start justify-end ">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="max-[1023px]:hidden py-5">
                        <div className="flex">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Date / Time</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5">
                        <div className="flex justify-end">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWithdrawItems && currentWithdrawItems.length > 0 && currentWithdrawItems?.map((item: any, index: number) => {
                      return (
                        <tr key={index} className="rounded-5 group dark:hover:bg-black-v-1 hover:bg-[#FEF2F2] cursor-pointer">
                          <td className="group-hover:bg-[#FEF2F2] dark:group-hover:bg-black-v-1  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px]  w-full">
                              {/* <Image src={`/assets/history/${item.image}`} width={30} height={30} alt="coins" /> */}
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{item.symbol}</p>
                                <p className="info-14-18 !text-[10px] lg:hidden">{formatDate(item?.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="info-14-18 dark:text-white  lg:text-start text-end">{item?.amount}</p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">{formatDate(item?.createdAt)}</p>
                          </td>
                          <td className=" text-end">
                            <p className={`info-14-18  ${item?.status == "success" ? "text-buy" : item?.status == "pending" ? "text-primary" : "text-cancel"}`}>{item?.status == "success" ? "Success" : item?.status == "pending" ? "Pending" : "Rejected"}</p>
                          </td>
                        </tr>
                      );
                    })}

                    {currentWithdrawItems.length === 0 &&
                      <tr>
                        <td colSpan={4}>
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
              </div>
              <div className="flex pt-[25px] items-center justify-between">
                <p className="info-12 md:footer-text !text-gamma">{dataWithdraw?.length} assets</p>
                <ReactPaginate className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`} breakLabel="..." nextLabel=">" onPageChange={handleWithDrawPageClick} pageRangeDisplayed={5} marginPagesDisplayed={2} pageCount={pageWithdrawCount} previousLabel="<" renderOnZeroPageCount={null} />
              </div>
            </>
          }

          {
            active1 === 4 &&
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
                        <div className="flex">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5 max-[1023px]:hidden ">
                        <div className=" ">
                          <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureWalletItems && futureWalletItems.length > 0 && futureWalletItems?.map((item: any, index: number) => {
                      // ================================
                      // Trade button enable or disable
                      // ================================
                      let tradeCusrsor = false;
                      if (item.token !== null && item?.token?.futureTradePair !== null) {
                        tradeCusrsor = true;
                      }
                      if (item.global_token !== null && item?.global_token?.futureTradePair !== null) {
                        tradeCusrsor = true;
                      }
                      return (
                        <tr key={index} className="rounded-5 group ">
                          <td className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                              <Image src={`${item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={30} height={30} alt="coins" />
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.balance.toFixed(5)}</p>
                          </td>
                          <td className="lg:text-start text-end">
                            <p className="info-14-18 dark:text-white">${item.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5)}</p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">${(item.token !== null ? item?.token?.price * item?.balance : item?.global_token?.price * item?.balance).toFixed(2)}</p>
                          </td>
                          <td className="max-[1023px]:hidden ">
                            <div className="flex items-center gap-[20px]">

                              <button className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Transfer</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>

                              <button onClick={() => router.push(`/future/${item?.token !== null ? item?.token?.futureTradePair?.coin_symbol : item?.global_token?.futureTradePair?.coin_symbol}${item?.token !== null ? item?.token?.futureTradePair?.usdt_symbol : item?.global_token?.futureTradePair?.usdt_symbol}`)} disabled={!tradeCusrsor} className={` max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  ${tradeCusrsor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                <span className="text-primary block">Trade</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );

                    })}

                    {futureWalletItems && futureWalletItems.length === 0 &&
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
                    {futureWalletItems && futureWalletItems.length > 0 && futureWalletItems?.map((item: any, index: number) => {
                      // ================================
                      // Trade button enable or disable
                      // ================================
                      let tradeCusrsor = false;
                      if (item.token !== null && item?.token?.futureTradePair !== null) {
                        tradeCusrsor = true;
                      }
                      if (item.global_token !== null && item?.global_token?.futureTradePair !== null) {
                        tradeCusrsor = true;
                      }
                      return (
                        <div key={index} className="rounded-5 group grid grid-cols-3  gap-x-[10px]  items-center">
                          <div className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                              <Image src={`${item.token !== null ? item?.token?.image : item?.global_token?.image}`} width={28} height={28} alt="coins" className="max-w-[20px] md:max-w-[30px] w-full" />
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{item.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.balance.toFixed(2)}</p>
                          </div>
                          <div className="iconParent lg:text-start text-end flex items-center justify-between">
                            <p className="info-14-18 dark:text-white">${item.token !== null ? item?.token?.price.toFixed(5) : item?.global_token?.price.toFixed(5)}</p>
                            <div onClick={(e) => { setHeight(e) }}>
                              <IconsComponent type="downArrow" hover={false} active={false} />
                            </div>
                          </div>
                          <div className={`fullWidthContent`}>
                            <div className="flex items-center gap-[10px] justify-center pb-[10px]">

                              <button className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Transfer</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                              <button onClick={() => router.push(`/future/${item?.token !== null ? item?.token?.futureTradePair?.coin_symbol : item?.global_token?.futureTradePair?.coin_symbol}${item?.token !== null ? item?.token?.futureTradePair?.usdt_symbol : item?.global_token?.futureTradePair?.usdt_symbol}`)} disabled={!tradeCusrsor} className={` max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  ${tradeCusrsor === true ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                <span className="text-primary block">Trade</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                              
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {futureWalletItems && futureWalletItems.length === 0 &&
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
                <p className="info-12 md:footer-text !text-gamma">{futureAssets?.length} assets</p>
                <ReactPaginate className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`} breakLabel="..." nextLabel=">" onPageChange={handleFuturePageClick} pageRangeDisplayed={10} marginPagesDisplayed={2} pageCount={futurepageCount} previousLabel="<" renderOnZeroPageCount={null} />
              </div>
            </>
          }
          {
            active1 === 5 &&
            <>
              <div className="overflow-x-auto">
                {/* This is for desktop version */}
                <table width="100%" className="lg:min-w-[1000px] w-full max-[1023px]:hidden">
                  <thead>
                    <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                      <th className="lg:sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                        <div className="flex ">
                          <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Conversion Time</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className=" py-5">
                        <div className="flex  lg:justify-start justify-center ">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Converted</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5">
                        <div className="flex lg:justify-start justify-end">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Received</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5 max-[1023px]:hidden ">
                        <div className="flex">
                          <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Fees</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                      <th className="py-5 max-[1023px]:hidden ">
                        <div className="flex ">
                          <p className="text-center  nav-text-sm md:nav-text-lg dark:text-gamma">Conversion rate</p>
                          <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.userConvertList && props.userConvertList.length > 0 && props.userConvertList?.map((item: any, index: number) => {
                      return (
                        <tr key={index} className="rounded-5 group ">
                          <td className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                              {/* <Image src={`${item.createdAt}`} width={30} height={30} alt="coins" /> */}
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.converted}</p>
                          </td>
                          <td className="lg:text-start text-end">
                            <p className="info-14-18 dark:text-white">{item?.received}</p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">Zero Transaction fees</p>
                          </td>
                          <td className="max-[1023px]:hidden">
                            <p className="info-14-18 dark:text-white">{item?.conversion_rate}</p>
                          </td>
                          {/* <td className="max-[1023px]:hidden ">
                            <div className="flex items-center gap-[20px]">
                              <button onClick={() => { setShow1(1) }} className="max-w-[50%] w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Deposit</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                              <button onClick={() => router.push(`/chart/${item.symbol}`)} className=" max-w-[50%] w-full justify-center px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
                                <span className="text-primary block">Trade</span>
                                <IconsComponent type="openInNewTab" hover={false} active={false} />
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      );

                    })}

                    {props.userConvertList.length === 0 &&
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
                      <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">time</p>
                      <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                    </div>

                    <div className="flex items-center lg:justify-start justify-center ">
                      <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Converted</p>
                      <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                    </div>

                    <div className="flex items-center lg:justify-start justify-end">
                      <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Received</p>
                      <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                    </div>

                  </div>

                  {/* table content */}
                  <div className="">
                    {props.userConvertList && props.userConvertList.length > 0 && props.userConvertList?.map((item: any, index: number) => {
                      return (
                        <div key={index} className="rounded-5 group grid grid-cols-3  gap-x-[10px]  items-center">
                          <div className="  lg:sticky left-0 bg-white dark:bg-d-bg-primary">
                            <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] max-w-[150px] w-full">
                              <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                <p className="info-14-18 dark:text-white">{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="info-14-18 dark:text-white  lg:text-start text-center">{item?.converted}</p>
                          </div>
                          <div className="iconParent lg:text-start text-end flex items-center justify-between">
                            <p className="info-14-18 dark:text-white">{item?.received}</p>

                          </div>
                        </div>
                      );
                    })}
                    {props.userConvertList && props.userConvertList.length === 0 &&
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
                <p className="info-12 md:footer-text !text-gamma">{props.userConvertList?.length} assets</p>
                <ReactPaginate className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`} breakLabel="..." nextLabel=">" onPageChange={handleCoinsPageClick} pageRangeDisplayed={10} marginPagesDisplayed={2} pageCount={coinpageCount} previousLabel="<" renderOnZeroPageCount={null} />
              </div>
            </>
          }
        </div>
      </section>
      {
        show1 === 1 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <Deposit setShow1={setShow1} networks={props.networks} session={props.session} />
        </>
      }
      {
        show1 === 2 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <Withdraw setShow1={setShow1} refreshData={props.refreshData} networks={props.networks} session={props.session} token={selectedCoin} selectedCoinBalance={selectedCoinBalance} />
        </>
      }
      {
        show1 === 3 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <StakingModel setShow1={setShow1} refreshData={props.refreshData} session={props.session} token={selectedCoin} selectedCoinBalance={selectedCoinBalance} />
        </>
      }
    </>
  );
};

export default WalletList;
