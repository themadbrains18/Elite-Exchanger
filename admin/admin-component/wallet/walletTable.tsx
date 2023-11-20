import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useState } from "react";
import WithdrawTable from "../withdraw/withdrawTable";
import DepositTable from "./depositTable";
import TradeTable from "./tradeTable";
import P2PTable from "./p2pTable";
import AssetTable from "./assetTable";
import ActivityLogsTable from "./activityLogsTable";
import ReferalHistory from "./referalHistory";

interface data {
  session: any;
  type?: string;
}


const WalletTable = (props: data) => {
  const [active, setActive] = useState(1);

  return (
    <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
      <div className="flex items-center justify-between  mb-[26px]">
        <div className="flex items-center gap-[15px]">
          <button
            className={`${
              active === 1 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(1);
            }}
          >
            Deposit
          </button>
          <button
            className={`${
              active === 2 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(2);
            }}
          >
            Withdraw
          </button>
          <button
            className={`${
              active === 3 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(3);
            }}
          >
            Trading
          </button>
          <button
            className={`${
              active === 4 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(4);
            }}
          >
            P2P
          </button>
          <button
            className={`${
              active === 5 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(5);
            }}
          >
            Assets
          </button>
          <button
            className={`${
              active === 6 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(6);
            }}
          >
            Activity logs
          </button>
{
  props?.type==="details" &&
          <button
            className={`${
              active === 7 ? "admin-solid-button" : "admin-outline-button"
            }`}
            onClick={(e) => {
              setActive(7);
            }}
          >
            Referal History
          </button>

}
        </div>
        <div className="flex items-center gap-10">
          <p className="admin-table-data">
            <span className="dark:text-[#ffffffb3]">1&nbsp;</span>Item selected
          </p>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="download" hover={false} active={false} />
          </div>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="deleteIcon" hover={false} active={false} />
          </div>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="SearchIcon" hover={false} active={false} />
          </div>
          <div className="w-[28px] h-[28px] dark:bg-[#1B283F] bg-[#f3f6f9b3] p-[4px] rounded-[5px] cursor-pointer">
            <AdminIcons type="settings" hover={false} active={false} />
          </div>
        </div>
      </div>
      {active === 1 && <DepositTable type={props?.type} />}
      {active === 2 && (
        <>
          <WithdrawTable type={props?.type} name="wallet"/>
        </>
      )}
      {active === 3 && <TradeTable type={props?.type} />}
      {active === 4 && <P2PTable type={props?.type} />}
      {active === 5 && <AssetTable type={props?.type} />}
      {active === 6 && <ActivityLogsTable type={props?.type} />}
      {active === 7 && <ReferalHistory type={props?.type} />}
    </div>
  );
};

export default WalletTable;
