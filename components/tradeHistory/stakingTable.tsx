import moment from 'moment';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Context from '../contexts/context';
import { useSession } from 'next-auth/react';
import { AES } from 'crypto-js';
import { toast } from 'react-toastify';

import ConfirmPopup from "@/pages/customer/profile/confirm-popup";
import Verification from "../snippets/verification";

import ConfirmationModel from "../snippets/confirmation";
import { currencyFormatter } from '../snippets/market/buySellCard';

const StakingTable = () => {
    const { data: session, status } = useSession();
    const [currentItems, setCurrentItems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [total,setTotal] = useState(0)
    const [sendOtpRes, setSendOtpRes] = useState<any>(); 
    const [stakeId, setStakeId] = useState('');
    const [finalBtnenable, setFinalBtnenable] = useState(false);
    const [enable, setEnable] = useState(0);
    const [formData, setFormData] = useState();
    const [show, setShow] = useState(false);
    const [confirmation, setConfirmation] = useState(false)
  
    const [selectedStake, setSelectedStake] = useState(Object);
    const { mode } = useContext(Context)
  
    let itemsPerPage = 10;
  
    useEffect(()=>{    
      getStakingData()
  
    },[itemOffset])
  
  
    async function getStakingData(){
      let tradeHistory = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staking/history?itemOffset=${itemOffset}&itemsPerPage=${itemsPerPage}`, {
        method: "GET",
        headers: {
          "Authorization": session?.user?.access_token
        },
      }).then(response => response.json());
  
      setTotal(tradeHistory?.data?.total)
      setCurrentItems(tradeHistory?.data?.data);
    }
  
    const pageCount = Math.ceil(total / itemsPerPage);
  
      const handlePageClick = async (event: any) => {
          const newOffset = (event.selected * itemsPerPage) % total;
          setItemOffset(newOffset);
      };

      
  const redeemReleased = async (item: any) => {

    try {

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
        toast.success(res?.data?.result);
        setSendOtpRes(res?.data?.otp);
        setEnable(1);
        setShow(true);

      }
      else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log("error in trade history", error);

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
        toast.success(res?.data?.message, {
          position: 'top-center'
        });
        setTimeout(() => {
          setFinalBtnenable(false);
          getStakingData()
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
        toast.success(res?.data?.message, {
          position: 'top-center'
        });
        setEnable(0);
        setTimeout(() => {
          getStakingData()
        }, 2000)

      }
      else {
        toast.error(res?.data?.message, {
          position: 'top-center'
        });
        setFinalBtnenable(false);
      }
    } catch (error) {

    }
  }

  return (
    <>
      <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>

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
                <p className="text-start  nav-text-sm md:nav-text-lg dark:text-gamma">Created Time</p>
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
          {currentItems && currentItems?.length > 0 && currentItems?.map((item: any, index: any) => {
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
                  <p className="info-14-18 dark:text-white  md:block">{currencyFormatter(item?.amount)}</p>
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
                  <p className={`info-14-18 ${item?.status === false ? '!text-red-dark' : '!text-dark-green'} md:block hidden`}>{moment(item?.createdAt).format('YYYY-MM-DD HH:mm:ss A')}</p>
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
                        <button className={`admin-outline-button !px-[10px] !py-[4px] whitespace-nowrap cursor-pointer`} onClick={(e) => { item?.status === false ? (setConfirmation(true), setSelectedStake(item), setShow(true)) : '' }}>
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

          { currentItems?.length === 0 &&
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
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null} />
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
            type="email"
            data={formData}
            session={session}
            finalOtpVerification={finalOtpVerification}
            finalBtnenable={finalBtnenable}
            snedOtpToUser={snedOtpToUser}
            sendOtpRes={sendOtpRes}
          />
        )}

        {confirmation &&
          <ConfirmationModel setActive={setConfirmation} setShow={setShow} show={show} actionPerform={actionPerform} title="Unstaking" message="Are you sure you want to unstake this token" />
        }
  </>
  )
}

export default StakingTable
