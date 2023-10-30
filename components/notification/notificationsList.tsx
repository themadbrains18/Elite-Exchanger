import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface propsData {
  notificationData: any;
}

const NotificationsList = (props: propsData) => {
  const [active, setActive] = useState(1);
  const capitalizeFirstLetter = (inputString: string) =>
    `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;

  return (
    <section className=" bg-light-v-1 py-80 md:py-[120px]  dark:bg-black-v-1">
      <div className="container ">
        <div className="p-5 md:p-40 rounded-10  bg-white dark:bg-d-bg-primary">
          <div className="flex justify-between gap-5 mb-[26px] md:mb-40">
            <p className="sec-title">Trade History</p>
            <Image
              src="/assets/history/dots.svg"
              width={24}
              height={24}
              alt="dots"
              className="cursor-pointer md:hidden block"
            />
            <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] py-[13px] px-[10px] ">
              <Image
                src="/assets/history/search.svg"
                alt="search"
                width={24}
                height={24}
              />
              <input
                type="search"
                placeholder="Search"
                className="nav-text-sm !text-beta outline-none bg-[transparent]"
              />
            </div>
          </div>
          <div className="flex justify-between border-b border-grey-v-3 dark:border-opacity-[15%]">
            <div className="flex gap-5 md:gap-30 trade_history_scroll overflow-auto">
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 1 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(1);
                }}
              >
                All
              </button>
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 2 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(2);
                }}
              >
                System Notification
              </button>
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 3 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(3);
                }}
              >
                Latest Events
              </button>
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 4 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(4);
                }}
              >
                Announcements
              </button>
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 5 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(5);
                }}
              >
                Rewards
              </button>
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 6 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(6);
                }}
              >
                TradingView Alerts
              </button>
              <button
                className={`pb-20  nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 7 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(7);
                }}
              >
                News
              </button>
            </div>
            <div className="hidden lg:flex gap-5">
              <div className="p-[5px] flex items-center gap-[10px] cursor-pointer">
                <Image
                  src="/assets/history/calender.svg"
                  width={24}
                  height={24}
                  alt="calender"
                />
                <p className="nav-text-sm">Month</p>
                <Image
                  src="/assets/profile/downarrow.svg"
                  width={24}
                  height={24}
                  alt="dropdown"
                />
              </div>
              <div className="p-[5px] flex items-center gap-[10px] cursor-pointer">
                <Image
                  src="/assets/history/filter.svg"
                  width={24}
                  height={24}
                  alt="filter"
                />
                <p className="nav-text-sm">Filter</p>
                <Image
                  src="/assets/profile/downarrow.svg"
                  width={24}
                  height={24}
                  alt="dropdown"
                />
              </div>
              <Image
                src="/assets/history/dots.svg"
                width={24}
                height={24}
                alt="dots"
                className="cursor-pointer"
              />
            </div>
          </div>

          <ul>
            {props?.notificationData.length > 0 &&
              props.notificationData?.map((item: any, index: number) => {
                return (
                  <li
                    key={index}
                    className={`block  w-full cursor-pointer mb-[15px] items-center group md:mb-[10px] 
                          pt-6 pb-[15px] border-b border-grey-v-1 `}
                  >
                    <div className="min-w-[22px] lg:mb-[16px]">
                      <p className={`sec-title `}>
                        {capitalizeFirstLetter(item?.type)}
                      </p>
                    </div>
                    <p className={`info-14-18 text-sm dark:text-[#a0a1a7] w-full mb-7`}>
                      {item?.message?.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="admin-table-data">
                        {moment(item?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </p>
                      <div className="flex items-center  gap-2">
                        <p className=" admin-table-data text-black dark:text-white group-hover:text-primary">View More</p>
                        <svg
                          viewBox="0 0 16 16"
                          fill="black"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5   fill-black dark:fill-white group-hover:fill-primary"

                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.0585 8.66797L7.52993 12.1966C7.26958 12.4569 7.26958 12.879 7.52993 13.1394C7.79028 13.3997 8.21239 13.3997 8.47274 13.1394L13.1347 8.47742C13.3977 8.21445 13.3976 7.78812 13.1347 7.52518L8.47274 2.86323C8.21239 2.60288 7.79028 2.60288 7.52993 2.86323C7.26958 3.12358 7.26958 3.54569 7.52993 3.80604L11.0585 7.33464L3.29301 7.33464C2.94783 7.33464 2.66801 7.63311 2.66801 8.0013C2.66801 8.36949 2.94783 8.66797 3.29301 8.66797L11.0585 8.66797Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NotificationsList;
