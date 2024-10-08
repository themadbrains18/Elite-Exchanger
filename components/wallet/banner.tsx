import Image from "next/image";
import React, { useState } from "react";

import IconsComponent from "../snippets/icons";
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react'
import Deposit from "../snippets/deposit";
import { currencyFormatter } from "../snippets/market/buySellCard";
import { truncateNumber } from "@/libs/subdomain";
import WithdrawAuthenticationModelPopup from "./withdrawAuthentication";

interface propsData {
  assets: any;
  coinList: any;
  withdrawList: any;
  depositList: any;
  networks: any
  session: any
}

const Banner = (props: propsData): any => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(0);
  const [depositActive, setDepositActive] = useState(false);
  const { data: session } = useSession();

  let dataCoinWallet = props.coinList;
  const star = '*'


  return (
    <>
      <div className="p-20 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
        <div className="flex justify-between flex-wrap gap-[20px]">
          <div>
            <p className="text-[23px] leading-7 font-medium mb-2 md:mb-[10px] dark:text-white">Wallet</p>
          </div>
          <div>

            <button onClick={() => {
              if (session?.user?.kyc !== 'approve') {
                setDepositActive(true);
              }
              else {
                setShow1(1)
              }
            }} className=" w-full px-[10px] py-[6.5px] bg-primary-100 dark:bg-black-v-1 justify-center flex items-center gap-[6px] rounded-[5px] sec-text !text-[14px]  cursor-pointer">
              <span className="text-primary block">Deposit</span>
              <IconsComponent type="openInNewTab" hover={false} active={false} />
            </button>
          </div>
        </div>
        <div className="mt-30 md:mt-50 flex lg:flex-row lg:items-center items-start flex-col flex-wrap gap-[20px] justify-between">
          <div>
            <div className="flex gap-[10px] items-center">
              <Image src='/assets/market/walletpayment.svg' width={24} height={24} alt="payment wallet" />
              <p className="nav-text-sm !text-gamma">Wallet Balance</p>
            </div>
            <div className="mt-30 flex gap-10">
              <p className="md-heading text-black dark:text-white">
                {
                  show == true ? <span> ${props.assets != 0 ? currencyFormatter(truncateNumber(props?.assets, 8)) : '0.00'}</span> : <span>$ {props.assets != 0 ? star.repeat(props.assets.toFixed(6)?.length) : star.repeat(4)}</span>
                }
              </p>
              <div className="p-[5px] rounded flex gap-[10px] items-center cursor-pointer" onClick={() => { setShow(!show) }}>
                {/* <p className="sm-text dark:text-white">Hide Price</p> */}
                {
                  show == true ?
                    <Image src='/assets/market/open-eye.svg' width={25} height={25} alt="eye icon" />
                    :
                    <Image src='/assets/market/eye.svg' width={25} height={25} alt="eye icon" />
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
                <p className="sm-text dark:!text-white">${currencyFormatter(truncateNumber(props?.depositList, 8))}</p>
              </div>
            </div>
            <div className="flex items-center  justify-between gap-5 flex-wrap">
              <div className="flex items-center gap-10">
                <IconsComponent type="totalWithdraw" hover={false} active={false} />
                <p className="sm-text dark:!text-gamma">Total Withdrawals</p>
              </div>
              <div className="flex items-center gap-10">
                <IconsComponent type="totalWithdrawBlue" hover={false} active={false} />
                <p className="sm-text dark:!text-white">${currencyFormatter(truncateNumber(props?.withdrawList, 8))}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        show1 === 1 &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>
          <Deposit setShow1={setShow1} networks={props.networks} session={props.session} coinList={dataCoinWallet} hideDefault={true} />
        </>
      }
      {depositActive === true &&
        <>
          <div className={`bg-black  z-[9] duration-300 fixed top-0 left-0 h-full w-full ${show1 ? "opacity-80 visible" : "opacity-0 invisible"}`} ></div>

          <WithdrawAuthenticationModelPopup setActive={setDepositActive} setShow={setShow1} title="Deposit Security Settings" type="deposit" />
        </>
      }
    </>
  );
};

export default Banner;
