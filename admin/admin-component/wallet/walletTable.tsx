import AdminIcons from "../../admin-snippet/admin-icons";
import Image from "next/image";
import React, { useState } from "react";

interface data {
  orders: any;
  withdraw: any;
  marketOrders: any;
  deposit: any;
  session: any;
  assets: any;
  activity:any;
  referalList?:any;
}

function formatDate(date: Date) {
  const options: {} = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

const WalletTable = (props: data) => {
  const [active, setActive] = useState(1);

  return (
    <div className=" mt-[24px] py-6 px-5  rounded-10 bg-white dark:bg-grey-v-4">
      <div className="flex items-center justify-between  mb-[26px]">
        <div className="flex items-center gap-[15px]">
          <button
            className={`${active === 1 ? "admin-solid-button" : "admin-outline-button"
              }`}
            onClick={(e) => {
              setActive(1);
            }}
          >
            Deposit
          </button>
          <button
            className={`${active === 2 ? "admin-solid-button" : "admin-outline-button"
              }`}
            onClick={(e) => {
              setActive(2);
            }}
          >
            Withdraw
          </button>
          <button
            className={`${active === 3 ? "admin-solid-button" : "admin-outline-button"
              }`}
            onClick={(e) => {
              setActive(3);
            }}
          >
            Trading
          </button>
          <button
            className={`${active === 4 ? "admin-solid-button" : "admin-outline-button"
              }`}
            onClick={(e) => {
              setActive(4);
            }}
          >
            P2P
          </button>
          <button
            className={`${active === 5 ? "admin-solid-button" : "admin-outline-button"
              }`}
            onClick={(e) => {
              setActive(5);
            }}
          >
            Assets
          </button>
          <button
            className={`${active === 6 ? "admin-solid-button" : "admin-outline-button"
              }`}
            onClick={(e) => {
              setActive(6);
            }}
          >
            Activity logs
          </button>
          {
            props?.referalList &&
          <button
            className={`${active === 7 ? "admin-solid-button" : "admin-outline-button"
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
      {active === 1 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Coin
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>TxID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Network</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p>Amount</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Wallet Address
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {props?.deposit !== null && props?.deposit?.length > 0 &&
                props?.deposit?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        {/* <Image
                        src={`/assets/admin/${item?.coin}`}
                        width={32}
                        height={32}
                        alt="avtar"
                      /> */}
                        <div>
                          <p>{item?.coinName}</p>
                          <p className="admin-table-heading">{item?.token}</p>
                        </div>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data ">
                        <p className="max-w-[100px] w-full overflow-hidden text-ellipsis">{item?.tx_hash}</p></td>
                      <td className="admin-table-data">{item?.network}</td>
                      <td className="admin-table-data">${item?.amount}</td>
                      <td className="admin-table-data">{item?.address}</td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.successful === "1"
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                                :
                                "dark:bg-[#90CAF9] bg-[#3699FF] "
                                // : "dark:bg-[#F44336] bg-[#F64E60]"
                              }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${item?.successful === "1"
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              :
                               "dark:text-[#90CAF9] text-[#3699FF] "
                               
                              }`}
                          >
                            {item?.successful==="1"?"Approved":"Pending"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {(props?.deposit === null || props?.deposit.length === 0) &&
                <tr>
                  <td colSpan={9}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
      {active === 2 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Coin
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>TxID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Network</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p>Amount</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Wallet Address
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
                {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {props?.withdraw !== null && props?.withdraw?.length > 0 &&
                props?.withdraw?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        {/* <Image
                        src={`/assets/admin/${item?.coin}`}
                        width={32}
                        height={32}
                        alt="avtar"
                      /> */}
                        <div>
                          <p>{item?.tokenName}</p>
                          <p className="admin-table-heading">{item?.symbol}</p>
                        </div>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.tx_hash}</td>
                      <td className="admin-table-data">
                        {item?.network?.fullname}
                      </td>
                      <td className="admin-table-data">${item?.amount}</td>
                      <td className="admin-table-data">
                        {item?.withdraw_wallet}
                      </td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === "success"
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : item?.status === "pending"
                                ? "dark:bg-[#90CAF9] bg-[#3699FF] "
                                : "dark:bg-[#F44336] bg-[#F64E60]"
                              }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === "success"
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : item?.status === "pending"
                                ? "dark:text-[#90CAF9] text-[#3699FF] "
                                : "dark:text-[#F44336] text-[#F64E60]"
                              }`}
                          >
                            {item?.status === "success"
                              ? "Approved"
                              : item?.status === "pending"
                                ? "Pending"
                                : "Rejected"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {(props?.withdraw === null || props?.withdraw.length === 0) &&
                <tr>
                  <td colSpan={9}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
      {active === 3 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Coin
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>

                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Market Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Order Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p> Amount</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>

                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
                {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {props?.marketOrders !== null && props?.marketOrders?.length > 0 &&
                props?.marketOrders?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        <Image
                          src={`${item?.token !== null ? item?.token?.image : item?.global_token?.image}`}
                          width={32}
                          height={32}
                          alt="avtar"
                        />
                        <div>
                          <p>{item?.token !== null ? item?.token?.fullName : item?.global_token?.fullName}</p>
                          <p className="admin-table-heading">
                            {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}
                          </p>
                        </div>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.market_type}</td>
                      <td className="admin-table-data">{item?.order_type}</td>
                      <td className="admin-table-data">
                        ${item?.token_amount}
                      </td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === "Approved"
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : item?.status === "Pending"
                                ? "dark:bg-[#90CAF9] bg-[#3699FF] "
                                : "dark:bg-[#F44336] bg-[#F64E60]"
                              }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === "Approved"
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : item?.status === "Pending"
                                ? "dark:text-[#90CAF9] text-[#3699FF] "
                                : "dark:text-[#F44336] text-[#F64E60]"
                              }`}
                          >
                            {item?.status}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {(props?.marketOrders === null || props?.marketOrders.length === 0)  &&
                <tr>
                  <td colSpan={8}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
      {active === 4 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Coin
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Seller User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Buyer User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Price</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Quantity</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p>Spend Amount</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Recieve Amount
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Payment Method
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Type
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Status
                </th>
                {/* <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {props?.orders !== null && props?.orders?.length > 0 &&
                props?.orders?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        <Image
                          src={`${item?.token !== null ? item?.token?.image : item?.global_token?.image}`}
                          width={32}
                          height={32}
                          alt="avtar"
                        />
                        <div>
                          <p>{item?.token !== null ? item?.token?.fullName : item?.global_token?.fullName}</p>
                          <p className="admin-table-heading">
                            {item?.token !== null ? item?.token?.symbol : item?.global_token?.symbol}
                          </p>
                        </div>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.sell_user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.buy_user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.price}</td>
                      <td className="admin-table-data">{item?.quantity}</td>
                      <td className="admin-table-data">
                        {item?.spend_amount} {item?.spend_currency}
                      </td>
                      <td className="admin-table-data">
                        {item?.receive_amount} {item?.receive_currency}
                      </td>
                      <td className="admin-table-data">{item?.p_method}</td>
                      <td className="admin-table-data">{item?.type}</td>
                      <td className="admin-table-data">
                        <div className="flex gap-[5px] items-center">
                          <div
                            className={`w-[7px] h-[7px] mr-[5px] rounded-full ${item?.status === "Approved"
                              ? "dark:bg-[#66BB6A] bg-[#0BB783]"
                              : item?.status === "Pending"
                                ? "dark:bg-[#90CAF9] bg-[#3699FF] "
                                : "dark:bg-[#F44336] bg-[#F64E60]"
                              }`}
                          ></div>
                          <p
                            className={`text-[13px] font-public-sans font-normal leading-5 ${item?.status === "Approved"
                              ? "dark:text-[#66BB6A] text-[#0BB783]"
                              : item?.status === "Pending"
                                ? "dark:text-[#90CAF9] text-[#3699FF] "
                                : "dark:text-[#F44336] text-[#F64E60]"
                              }`}
                          >
                            {item?.status}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              { (props?.orders === null || props?.orders.length === 0) &&
                <tr>
                  <td colSpan={12}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
      {active === 5 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  Coin
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Date</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Account Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Wallet Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading flex items-center gap-[5px]">
                  <div className="flex items-center gap-[5px]">
                    <p>Balance</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              {props?.assets !== null && props?.assets?.length > 0 &&
                props?.assets?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                      <td className=" py-[14px] flex gap-[10px] items-center admin-table-data">
                        <Image
                          src={`${item?.token !== null ? item?.token?.image : item.global_token.image}`}
                          width={32}
                          height={32}
                          alt="avtar"
                        />
                        <div>
                          <p>{item?.token !== null ? item?.token?.fullName : item.global_token.fullName}</p>
                          <p className="admin-table-heading">
                            {item?.token !== null ? item?.token?.symbol : item.global_token.symbol}
                          </p>
                        </div>
                      </td>
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.account_type}</td>
                      <td className="admin-table-data">{item?.walletTtype}</td>
                      <td className="admin-table-data">
                        {item?.balance}
                      </td>
                    </tr>
                  );
                })}

              {(props?.assets === null || props?.assets.length === 0) &&
                <tr>
                  <td colSpan={7}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
      {active === 6 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block
                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
             
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Created At</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Login Time</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Last Login</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Browser</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Device Type</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>IP Address</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Location</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>

              </tr>
            </thead>
            <tbody>
              {props?.activity !== null && props?.activity?.length > 0 &&
                props?.activity?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                    
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.user_id.split("").splice(0, 5)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.loginTime}</td>
                      <td className="admin-table-data">{item?.lastLogin}</td>
                      <td className="admin-table-data">
                        {item?.browser}
                      </td>
                      <td className="admin-table-data">
                        {item?.deviceType}
                      </td>
                      <td className="admin-table-data">
                        {item?.ip}
                      </td>
                      <td className="admin-table-data">
                        {item?.location}{","}{item?.region}
                      </td>
                    </tr>
                  );
                })}

              {(props?.activity === null || props?.activity?.length === 0) &&
                <tr>
                  <td colSpan={7}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
      {active === 7 && (
        <div className="max-h-[600px] h-full overflow-y-auto all-user-table overscroll-auto	">
          <table width="100%">
            <thead className="sticky top-0 dark:bg-grey-v-4 bg-white mb-[10px] z-[1]">
              <tr>
                <th className="p-[10px]  text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <input id="mainCheckbox" type="checkbox" className="hidden" />
                  <label
                    htmlFor="mainCheckbox"
                    className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block
                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                  ></label>
                </th>
             
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Referal User ID</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Created At</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading">
                  <div className="flex items-center gap-[5px]">
                    <p>Username</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
                <th className="p-[10px] px-0 text-start dark:!text-[#ffffffb3] admin-table-heading ">
                  <div className="flex items-center gap-[5px]">
                    <p>Invite Id</p>
                    <Image
                      src="/assets/history/uparrow.svg"
                      className="rotate-[180deg] "
                      width={15}
                      height={15}
                      alt="uparrow"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {props?.referalList !== null && props?.referalList?.length > 0 &&
                props?.referalList?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className=" border-b-[0.5px] border-[#ECF0F3] dark:border-[#ffffff1a] hover:bg-[#3699ff14] rounded-10 dark:hover:bg-[#90caf929]"
                    >
                      <td className="px-10 py-[14px] admin-table-data">
                        <input
                          id={`checbox-${index}-item`}
                          type="checkbox"
                          className="hidden"
                        />
                        <label
                          htmlFor={`checbox-${index}-item`}
                          className="
                          relative
                          
                          after:w-20
                          after:h-20
                          after:border-[2px]
                          after:border-[#B5B5C3]
                          after:rounded-[4px]
                          after:block

                          before:w-[12px]
                          before:h-[6px]
                          before:border-l-[2px]
                          before:border-b-[2px]
                          border:dark:border-[#212121]
                          border:border-[#fff]
                          before:absolute
                          before:left-[4px]
                          before:top-[6px]
                          before:rotate-[-45deg]
                          before:hidden
                        "
                        ></label>
                      </td>
                    
                      <td className="admin-table-data !text-admin-primary">
                        #{item?.id.split("").splice(0, 9)}
                      </td>
                      <td className="admin-table-data">
                        {formatDate(item?.createdAt)}
                      </td>
                      <td className="admin-table-data">{item?.email !== null ?item?.email  :item?.number }</td>
                      <td className="admin-table-data">{item?.refeer_code}</td>
                     
                    </tr>
                  );
                })}

              {(props?.activity === null || props?.activity.length === 0) &&
                <tr>
                  <td colSpan={7}>
                    <div className={` py-[50px] flex flex-col items-center justify-center text-[#000000]`}>
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
      )}
    </div>
  );
};

export default WalletTable;
