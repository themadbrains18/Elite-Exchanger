import Image from "next/image";
import React, { useContext, useState } from "react";
import ReactPaginate from 'react-paginate';
import Context from "../contexts/context";
import moment from 'moment';
import Link from "next/link";
import { AES } from "crypto-js";
import { signOut, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmPopup from "@/pages/profile/confirm-popup";
import Verification from "../snippets/verification";

import ConfirmationModel from "../snippets/confirmation";

interface propsData {
  tradeHistory?: any;
  withdraws?: any;
  deposits?: any;
  convertHistory?: any;
  stakingHistory?: any;
  refreshStakingData?: any;
}
const Historytrade = (props: propsData) => {
  const [active, setActive] = useState(1);
  const { mode } = useContext(Context)
  const [itemOffset, setItemOffset] = useState(0);
  const [withdrawitemOffset, setWithdrawItemOffset] = useState(0);
  const [deposititemOffset, setDepositItemOffset] = useState(0);
  const { data: session, status } = useSession();
  const [enable, setEnable] = useState(0);
  const [formData, setFormData] = useState();
  const [show, setShow] = useState(false);
  const [stakeId, setStakeId] = useState('');
  const [finalBtnenable, setFinalBtnenable] = useState(false);

  const [selectedStake, setSelectedStake] = useState(Object);

  let itemsPerPage = 10;

  // =================================
  // Trade History Data
  // =================================
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = (props.tradeHistory && props.tradeHistory.length > 0) ? props.tradeHistory.slice(itemOffset, endOffset) : [];
  const pageCount = Math.ceil((props.tradeHistory && props.tradeHistory.length > 0 && props.tradeHistory.length) / itemsPerPage);

  const handlePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % (props.tradeHistory && props.tradeHistory.length > 0 ? props.tradeHistory.length : 0);
    setItemOffset(newOffset);
  };

  // =================================
  // Withdraw History Data
  // =================================
  const withdrawendOffset = withdrawitemOffset + itemsPerPage;
  const withdrawCurrentItems = (props.withdraws && props.withdraws.length > 0) ? props.withdraws.slice(withdrawitemOffset, withdrawendOffset) : [];
  const withdrawPageCount = Math.ceil((props.withdraws && props.withdraws.length > 0 && props.withdraws.length) / itemsPerPage);

  const handleWithdraePageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % (props.withdraws && props.withdraws.length > 0 ? props.withdraws.length : 0);
    setWithdrawItemOffset(newOffset);
  };

  // =================================
  // Deposit History Data
  // =================================
  const depositendOffset = deposititemOffset + itemsPerPage;
  const depositCurrentItems = (props.deposits && props.deposits.length > 0) ? props.deposits.slice(depositendOffset, depositendOffset) : [];
  const depositPageCount = Math.ceil((props.deposits && props.deposits.length > 0 && props.deposits.length) / itemsPerPage);

  const handleDepositPageClick = async (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % (props.deposits && props.deposits.length > 0 ? props.deposits.length : 0);
    setDepositItemOffset(newOffset);
  };

  const redeemReleased = async (item: any) => {

    let username = session?.user.email !== 'null' ? session?.user.email : session?.user?.number;
    let obj = {
      id: item?.id,
      step: 1,
      username: username,
      otp: 'string'
    }

    setStakeId(item?.id);

    const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
    let record = encodeURIComponent(ciphertext.toString());

    let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/history`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": session?.user?.access_token
      },
      body: JSON.stringify(record)
    })

    let res = await responseData.json();
    if (res.data.result) {
      // toast.success(res.data.result);
      setEnable(1);
      setShow(true);

    }
    else {
      toast.error(res?.data?.message);
    }
  }

  const snedOtpToUser = async () => {
    try {
      let username = session?.user.email !== 'null' ? session?.user.email : session?.user?.number;

      let obj = {
        id: stakeId,
        step: 2,
        username: username,
        otp: 'string'
      }
      const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record = encodeURIComponent(ciphertext.toString());

      let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/history`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(record)
      })

      let res = await responseData.json();

      if (res.data.result) {
        toast.success(res.data.result);
        setTimeout(() => {
          setEnable(2);
        }, 2000)
      }
      else {
        toast.error(res?.data?.message);
      }
    } catch (error) {

    }
  }

  const finalOtpVerification = async (otp: any) => {
    try {
      let username =
        session?.user.email !== "null"
          ? session?.user.email
          : session?.user?.number;

      let obj = {
        id: stakeId,
        step: 3,
        username: username,
        otp: otp
      }

      setFinalBtnenable(true);
      const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record = encodeURIComponent(ciphertext.toString());

      let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/history`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(record)
      })

      let res = await responseData.json();

      if (res.data.result) {
        toast.success(res?.data?.message);
        setTimeout(() => {
          setFinalBtnenable(false);
          props.refreshStakingData();
          setEnable(0);
          setShow(false);
        }, 2000)

      }
      else {
        toast.error(res?.data?.message);
        setFinalBtnenable(false);
      }
    } catch (error) {

    }
  }

  const actionPerform = async () => {
    try {
      let username =
        session?.user.email !== "null"
          ? session?.user.email
          : session?.user?.number;

      let obj = {
        id: selectedStake?.id,
        username: username
      }

      const ciphertext = AES.encrypt(JSON.stringify(obj), `${process.env.NEXT_PUBLIC_SECRET_PASSPHRASE}`).toString();
      let record = encodeURIComponent(ciphertext.toString());

      let responseData = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/unstake`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": session?.user?.access_token
        },
        body: JSON.stringify(record)
      })

      let res = await responseData.json();

      if (res.data.result) {
        toast.success(res?.data?.message);
        setEnable(0);
        setTimeout(() => {
          props.refreshStakingData();
        }, 2000)

      }
      else {
        toast.error(res?.data?.message);
        setFinalBtnenable(false);
      }
    } catch (error) {

    }
  }

  return (
    <>
      <ToastContainer />
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show && active!==5 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
      <section className=" bg-light-v-1 py-80 md:py-[120px]  dark:bg-black-v-1">
        <div className="container ">
          <div className="p-5 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
            <div className="flex justify-between gap-5 mb-[26px] md:mb-40">
              <p className="sec-title">Trade History</p>
              <Image src="/assets/history/dots.svg" width={24} height={24} alt="dots" className="cursor-pointer md:hidden block" />
              <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] py-[13px] px-[10px] ">
                <Image src="/assets/history/search.svg" alt="search" width={24} height={24} />
                <input type="search" placeholder="Search" className="nav-text-sm !text-beta outline-none bg-[transparent]" />
              </div>
            </div>
            <div className="flex justify-between border-b border-grey-v-3 dark:border-opacity-[15%]">
              <div className="flex gap-5 md:gap-30 overflow-auto trade_history_scroll">
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 1 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(1);
                  }}
                >
                  Order History
                </button>
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 2 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(2);
                  }}
                >
                  Wallet Deposit History
                </button>
                <button
                  className={`pb-[15px] md:pb-30 nav-text-sm md:nav-text-lg border-b-2 border-[transparent] whitespace-nowrap ${active === 3 && "border-primary !text-primary"}`}
                  onClick={() => {
                    setActive(3);
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
              <>
                <div className="overflow-x-auto">
                  <table width="100%" className="md:min-w-[1200px]">
                    <thead>
                      <tr className="border-b border-t border-grey-v-3 dark:border-opacity-[15%]">
                        <th className="sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                          <div className="flex ">
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Side</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className=" md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Type</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Bid</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Total Qty.</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-end  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems && currentItems.length > 0 && currentItems?.map((item: any, index: number) => {
                        return (
                          <tr key={index}  >
                            <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                              <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <Image src={`${item?.token !== null ? item?.token.image : item.global_token.image}`} width={30} height={30} alt="coins" />
                                <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                  <p className="info-14-18 dark:text-white">{item?.token !== null ? item?.token?.fullName : item?.global_token?.fullName}</p>
                                  <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-5 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <div className={`p-0 md:p-[5px] rounded-5 bg-[transparent] ${item.order_type === "sell" ? "md:bg-sell" : "md:bg-buy"} `}>
                                  {item.order_type === "buy" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                                        className="fill-buy md:fill-white"
                                      />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.7558 5.55687C14.43 5.23104 13.9033 5.23104 13.5775 5.55687L6.66667 12.4677V7.81271C6.66667 7.35271 6.29417 6.97938 5.83333 6.97938C5.3725 6.97938 5 7.35271 5 7.81271V14.4794C5 14.9394 5.3725 15.3127 5.83333 15.3127H12.5C12.9608 15.3127 13.3333 14.9394 13.3333 14.4794C13.3333 14.0194 12.9608 13.646 12.5 13.646H7.845L14.7558 6.73521C15.0817 6.40937 15.0817 5.88271 14.7558 5.55687"
                                        className="fill-sell md:fill-white"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="hidden md:block">
                                  <p className="info-14-18 dark:text-white">{item.order_type}</p>
                                  <p className="info-10">18 Feb,2022</p>
                                </div>
                                <div className="block md:hidden">
                                  <p className="info-14-18 dark:text-white">{item.market_type}</p>
                                  <p className="info-10">{item.token_amount}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white  md:block hidden">{item.market_type}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">${item?.token !== null ? item?.token?.price.toFixed(4) : item?.global_token?.price.toFixed(4)}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.limit_usdt}%</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">${item.volume_usdt.toFixed(2)}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">${item.token_amount}</p>
                            </td>
                            <td>
                              <p className={`info-14-18  ${item.status === true ? "text-buy" : item.isCanceled === true ? "text-cancel" : "text-gamma"}`}>{item?.status === false ? item?.isCanceled === true ? 'Canceled' : 'Pending' : 'Success'}</p>
                            </td>
                          </tr>
                        );
                      })}

                      {currentItems.length === 0 &&
                        <tr>
                          <td colSpan={8}>
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
                <div className="flex pt-[25px] items-center justify-end">

                  <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null} />
                </div>
              </>
            )}
            {active === 2 && (
              <>
                <div className="overflow-x-auto">
                  <table width="100%" className="md:min-w-[1200px]">
                    <thead>
                      <tr className="border-b border-grey-v-3 dark:border-opacity-[15%]">
                        <th className="sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                          <div className="flex ">
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Side</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Type</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Price</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Filled</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Total Qty.</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-end  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {depositCurrentItems && depositCurrentItems.length > 0 && depositCurrentItems?.map((item: any, index: any) => {
                        return (
                          <tr key={index} >
                            <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                              <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <Image src={`/assets/history/${item.image}`} width={30} height={30} alt="coins" />
                                <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                  <p className="info-14-18 dark:text-white">{item.name}</p>
                                  <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-5 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <div className={`p-0 md:p-[5px] rounded-5 bg-[transparent] ${item.side === "Sell" ? "md:bg-sell" : "md:bg-buy"} `}>
                                  {item.side === "Buy" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                                        className="fill-buy md:fill-white"
                                      />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.7558 5.55687C14.43 5.23104 13.9033 5.23104 13.5775 5.55687L6.66667 12.4677V7.81271C6.66667 7.35271 6.29417 6.97938 5.83333 6.97938C5.3725 6.97938 5 7.35271 5 7.81271V14.4794C5 14.9394 5.3725 15.3127 5.83333 15.3127H12.5C12.9608 15.3127 13.3333 14.9394 13.3333 14.4794C13.3333 14.0194 12.9608 13.646 12.5 13.646H7.845L14.7558 6.73521C15.0817 6.40937 15.0817 5.88271 14.7558 5.55687"
                                        className="fill-sell md:fill-white"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="hidden md:block">
                                  <p className="info-14-18 dark:text-white">{item.side}</p>
                                  <p className="info-10">18 Feb,2022</p>
                                </div>
                                <div className="block md:hidden">
                                  <p className="info-14-18 dark:text-white">{item.type}</p>
                                  <p className="info-10">{item.amount}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white  md:block hidden">{item.type}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">${item.price}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.filled}%</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">${item.amount}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">${item.quantity}</p>
                            </td>
                            <td>
                              <p className={`info-14-18  ${item.status === "Completed" ? "text-buy" : item.status === "Canceled" ? "text-cancel" : "text-gamma"}`}>{item.status}</p>
                            </td>
                          </tr>
                        );
                      })}
                      {depositCurrentItems && depositCurrentItems.length === 0 &&
                        <tr>
                          <td colSpan={7}>
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
                  <p className="info-12 md:footer-text !text-gamma">{depositCurrentItems.length} assets</p>

                  <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handleDepositPageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={depositPageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null} />
                </div>
              </>
            )}
            {active === 3 && (
              <>
                <div className="overflow-x-auto">
                  <table width="100%" className="md:min-w-[1200px]">
                    <thead>
                      <tr className="border-b border-grey-v-3 dark:border-opacity-[15%]">
                        <th className="sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                          <div className="flex ">
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Pair</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Side</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Address</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Qty</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Fee</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Network</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Tx_Hash</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>

                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-end  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawCurrentItems && withdrawCurrentItems.length > 0 && withdrawCurrentItems?.map((item: any, index: any) => {
                        return (
                          <tr key={index}>
                            <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                              <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <Image src={`${item?.token?.image}`} width={30} height={30} alt="coins" />
                                <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                  <p className="info-14-18 dark:text-white">{item?.token?.fullName}</p>
                                  <p className="info-10-14 !text-primary py-0 md:py-[3px] px-0 md:px-[10px] bg-[transparent] md:bg-grey-v-2 md:dark:bg-black-v-1 rounded-5">{item?.token?.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-5 py-[10px] md:py-[15px] px-0 md:px-[5px] md:block hidden">
                                <div className={`p-0 md:p-[5px] rounded-5 bg-[transparent] md:bg-buy `}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M14.9944 6.18667C14.9944 5.72917 14.6244 5.35667 14.166 5.35417L7.50521 5.3125H7.50021C7.04188 5.3125 6.67021 5.6825 6.66688 6.14083C6.66354 6.60083 7.03438 6.97667 7.49521 6.97917L12.1269 7.00833L5.24438 13.89C4.91854 14.2158 4.91854 14.7433 5.24438 15.0683C5.40688 15.2317 5.62021 15.3125 5.83354 15.3125C6.04688 15.3125 6.26021 15.2317 6.42271 15.0683L13.3294 8.16167L13.3335 12.8133C13.3335 13.2733 13.7069 13.6458 14.1669 13.6458H14.1677C14.6277 13.6458 15.0002 13.2717 15.0002 12.8117L14.9944 6.18667Z"
                                      className="fill-buy md:fill-white"
                                    />
                                  </svg>
                                </div>
                                <div className="hidden md:block">
                                  <p className="info-14-18 dark:text-white">Withdraw</p>
                                  <p className="info-10">{moment(item?.createdAt).format('DD-MM-YYYY')}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white  md:block hidden">{item?.withdraw_wallet.substring(0, 7) + '...'}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white">{item?.amount}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.fee}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item?.network?.fullname}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">
                                {item.tx_hash !== null &&
                                  <Link target="_blank" href={`${item?.network?.BlockExplorerURL}/tx/${item?.tx_hash}`}>{item.tx_hash && item.tx_hash !== null && item.tx_hash.substring(0, 7) + '..'}</Link>
                                }
                              </p>
                            </td>
                            <td>
                              <p className={`info-14-18  ${item?.status === "Completed" ? "text-buy" : item?.status === "Canceled" ? "text-cancel" : "text-gamma"}`}>{item?.status}</p>
                            </td>
                          </tr>
                        );
                      })}

                      {withdrawCurrentItems && withdrawCurrentItems.length === 0 &&
                        <tr>
                          <td colSpan={7}>
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
                <div className="flex pt-[25px] sticky left-0 items-center justify-end">

                  <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handleWithdraePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={withdrawPageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null} />
                </div>
              </>
            )}
            {active === 4 && (
              <>
                <div className="overflow-x-auto">
                  <table width="100%" className="md:min-w-[1200px]">
                    <thead>
                      <tr className="border-b border-grey-v-3 dark:border-opacity-[15%]">
                        <th className="sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                          <div className="flex ">
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Type</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Date</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className=" md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Fee</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Balance</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {props.convertHistory && props.convertHistory.length > 0 && props.convertHistory?.map((item: any, index: any) => {
                        return (
                          <tr key={index}>
                            <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                              <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <Image src={`${item?.token !== null ? item?.token?.image : item?.global_token?.image}`} width={30} height={30} alt="coins" />
                                <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                  <p className="info-14-18 dark:text-white">{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white  md:block ">{item?.type}</p>
                            </td>
                            <td>
                              <p className={`info-14-18 dark:text-white  md:block hidden`}>{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </td>
                            <td>
                              <p className={`info-14-18 ${item?.type === 'Gain' ? '!text-dark-green' : '!text-red-dark'} md:block `}>{item?.amount}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.fees}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item?.balance}</p>
                            </td>

                          </tr>
                        );
                      })}

                      {props.convertHistory && props.convertHistory.length === 0 &&
                        <tr>
                          <td colSpan={7}>
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
                <div className="flex pt-[25px] sticky left-0 items-center justify-end">

                  <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handleWithdraePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={withdrawPageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null} />
                </div>
              </>
            )}
            {active === 5 && (
              <>
                <div className="overflow-x-auto">
                  <table width="100%" className="md:min-w-[1200px]">
                    <thead>
                      <tr className="border-b border-grey-v-3 dark:border-opacity-[15%]">
                        <th className="sticky left-0 bg-white dark:bg-d-bg-primary py-5">
                          <div className="flex ">
                            <p className="text-start nav-text-sm md:nav-text-lg dark:text-gamma">Coin</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Amount</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Apr</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Time Log</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Time Format</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className="hidden md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Status</p>
                            <Image src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>
                        <th className=" py-5">
                          <div className=" md:flex">
                            <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Action</p>
                            <Image className="md:block hidden" src="/assets/history/uparrow.svg" width={15} height={15} alt="uparrow" />
                          </div>
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {props.stakingHistory && props.stakingHistory.length > 0 && props.stakingHistory?.map((item: any, index: any) => {
                        return (
                          <tr key={index}>
                            <td className="sticky left-0 bg-white dark:bg-d-bg-primary">
                              <div className="flex gap-2 py-[10px] md:py-[15px] px-0 md:px-[5px] ">
                                <Image src={`${item?.token !== null ? item?.token?.image : item?.global_token?.image}`} width={30} height={30} alt="coins" />
                                <div className="flex items-start md:items-center justify-center md:flex-row flex-col gap-0 md:gap-[10px]">
                                  <p className="info-14-18 dark:text-white">{item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white  md:block">{item?.amount}</p>
                            </td>
                            <td>
                              <p className={`info-14-18 dark:text-white  md:block hidden`}>{item?.apr}</p>
                            </td>
                            <td>
                              <p className={`info-14-18 dark:text-white md:block hidden`}>{item?.time_log}</p>
                            </td>
                            <td>
                              <p className="info-14-18 dark:text-white md:block hidden">{item.time_format}</p>
                            </td>
                            <td>
                              <p className={`info-14-18 ${item?.status === false ? '!text-red-dark' : '!text-dark-green'} md:block hidden`}>{item?.status === false ? 'Pending' : 'Success'}</p>
                            </td>
                            <td>
                              <div className="inline-flex items-center gap-10">
                                {item.redeem === false && item?.unstacking === false &&
                                  <>
                                    <button className={`admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap ${item.status === false ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-pointer'}`} onClick={(e) => { item?.status === true ? redeemReleased(item) : '' }}>
                                      Redeem
                                    </button>
                                    <button className={`admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap cursor-pointer`} onClick={(e) => { item?.status === false ? (setEnable(3), setSelectedStake(item), setShow(true)) : '' }}>
                                      Unstaking
                                    </button>
                                  </>
                                }
                                {item.redeem === true &&

                                  <button
                                    className={`admin-outline-button dark:text-[#66BB6A] text-[#0BB783] !border-[#0bb78380] dark:!border-[#66bb6a1f] !px-[10px] !py-[4px] whitespace-nowrap	cursor-not-allowed`}
                                  >
                                    Released
                                  </button>
                                }

                                {item.unstacking === true &&

                                  <button
                                    className={`admin-outline-button dark:text-[#66BB6A] !text-red-dark !border-[#0bb78380] dark:!border-[#66bb6a1f] !px-[10px] !py-[4px] whitespace-nowrap	cursor-not-allowed`}
                                  >
                                    Unstaked
                                  </button>
                                }

                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {props.stakingHistory && props.stakingHistory.length === 0 &&
                        <tr>
                          <td colSpan={7}>
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
                <div className="flex pt-[25px] sticky left-0 items-center justify-end">

                  <ReactPaginate
                    className={`history_pagination ${mode === "dark" ? "paginate_dark" : ""}`}
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handleWithdraePageClick}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    pageCount={withdrawPageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null} />
                </div>
              </>
            )}
          </div>
        </div>

        {enable === 1 && (
          <ConfirmPopup
            setEnable={setEnable}
            type="number"
            data={formData}
            session={session}
            snedOtpToUser={snedOtpToUser}
          />
        )}

        {enable === 2 && (
          <Verification
            setEnable={setEnable}
            setShow={setShow}
            type="number"
            data={formData}
            session={session}
            finalOtpVerification={finalOtpVerification}
            finalBtnenable={finalBtnenable}
          />
        )}

        {enable === 3 &&
          <ConfirmationModel setActive={setEnable} setShow={setShow} show={show} actionPerform={actionPerform} title="Unstaking" message="Are you sure you want to unstake this token" />
        }
      </section>
    </>

  );
};

export default Historytrade;
