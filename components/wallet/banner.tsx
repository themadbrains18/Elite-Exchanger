import Image from "next/image";
import React, { useState } from "react";

import IconsComponent from "../snippets/icons";
import {  toast } from 'react-toastify';
import { signOut } from 'next-auth/react'

interface propsData {
  assets: any;
  coinList: any;
  withdrawList: any
}

const Banner = (props: propsData):any => {
  const [show, setShow] = useState(false);

  let dataCoinWallet = props.coinList;

  let totalBalanceUsdt = 0.00;
  let withdrawTotal = 0.00;

  for (const ls of dataCoinWallet) {
    ls.avail_bal = 0.00;
    for (const as of props?.assets) {
      if (as.token_id === ls.id && as.balance > 0) {
        ls.avail_bal = as.balance;
        totalBalanceUsdt = totalBalanceUsdt + (as.balance * ls?.price)
      }
    }
  }

  for (const ls of dataCoinWallet){
    for (const wl of props.withdrawList) {
      if (wl.tokenID === ls.id)
      withdrawTotal = withdrawTotal + (parseFloat(wl.amount) * parseFloat(ls.price));
    }
  }
  
  return (
    <div className="p-20 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
      <div className="flex justify-between flex-wrap gap-[20px]">
        <div>
          <p className="text-[23px] leading-7 font-medium mb-2 md:mb-[10px] dark:text-white">Wallet</p>
          <p className="nav-text-sm  md:leading-17 leading-20 banner-text dark:text-beta">Update 16/02/2022 at 02:30 PM  </p>
        </div>
        {/* <div className="flex gap-5">
          <div className="py-[13px] px-[15px] hidden md:flex gap-[10px] items-center border rounded-5 border-grey-v-1 dark:border-opacity-[15%]">
            <Image src="/assets/profile/edit.svg" width={24} height={24} alt="add" />
            <p className="nav-text-sm text-beta">Edit</p>
          </div>
          <div className="py-[13px] px-[15px] hidden md:flex gap-[10px] items-center border rounded-5 border-grey-v-1 dark:border-opacity-[15%]">
            <Image src="/assets/market/add.svg" width={24} height={24} alt="add" />
            <p className="nav-text-sm text-beta">Add New Wallet</p>
          </div>
        </div> */}
      </div>
      <div className="mt-30 md:mt-50 flex lg:flex-row lg:items-center items-start flex-col flex-wrap gap-[20px] justify-between">
        <div>
          <div className="flex gap-[10px]">
            <Image src='/assets/market/walletpayment.svg' width={24} height={24} alt="payment wallet" />
            <p className="nav-text-sm !text-gamma">Wallet Balance</p>
          </div>
          <div className="mt-30 flex gap-10">
            <p className="md-heading dark:text-white">
              {
                show == true ? <span> ${totalBalanceUsdt.toFixed(4)}</span> : <span>$*********</span>
              }
            </p>
            <div className="p-[5px] bg-primary-100 dark:bg-black-v-1 rounded flex gap-[10px] items-center cursor-pointer" onClick={() => { setShow(!show) }}>
              <p className="sm-text dark:text-white">Hide Price</p>
              {
                show == true ?
                  <Image src='/assets/market/open-eye.svg' width={20} height={20} alt="eye icon" />
                  :
                  <Image src='/assets/market/eye.svg' width={20} height={20} alt="eye icon" />
              }
            </div>
          </div>
        </div>

        <div className="rounded-[5px] bg-primary-100 dark:bg-black-v-1 p-[15px] max-w-[443px] w-full">
          <div className="flex items-center  justify-between gap-5 mb-[27px] flex-wrap">
            <div className="flex items-center gap-10">
              <IconsComponent type="totalDeposit" hover={false} active={false} />
              <p className="sm-text dark:!text-gamma">Total Deposited</p>
            </div>
            <div className="flex items-center gap-10">
              <IconsComponent type="totalDepositBlue" hover={false} active={false} />
              <p className="sm-text dark:!text-white">$32,455.12</p>
            </div>
          </div>
          <div className="flex items-center  justify-between gap-5 flex-wrap">
            <div className="flex items-center gap-10">
              <IconsComponent type="totalWithdraw" hover={false} active={false} />
              <p className="sm-text dark:!text-gamma">Total Withdrawals</p>
            </div>
            <div className="flex items-center gap-10">
              <IconsComponent type="totalWithdrawBlue" hover={false} active={false} />
              <p className="sm-text dark:!text-white">${withdrawTotal}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
