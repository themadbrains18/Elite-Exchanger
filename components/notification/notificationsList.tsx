import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import IconsComponent from "../snippets/icons";

interface propsData {
  notificationData: any;
}

const NotificationsList = (props: propsData) => {
  const [active, setActive] = useState(1);
  const [Ndata, setData] = useState([]);

  useEffect(()=>{
    setData(props.notificationData)
  },[props.notificationData])

  const capitalizeFirstLetter = (inputString: string) =>
    `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;

  function containsImageUrl(str: string) {
    const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))/i;
    return imageUrlPattern.test(str);
  }
  
  const searchNotification = (e: any) => {
    let value = e.target.value.toLowerCase();
    let filterData = props.notificationData.filter((item: any) => {
      return (
        item?.type.toLowerCase().includes(value) ||
        item?.message?.message.toLowerCase().includes(value)
      );
    });
    setData(filterData);
    console.log(Ndata, "===========Ndata");
  };

  return (
    <section className="bg-light-v-1 py-[20px] md:py-[80px] dark:bg-black-v-1">
      <div className="container">
        <div className="p-5 md:p-40 rounded-10 bg-white dark:bg-d-bg-primary">
          <div className="flex justify-between gap-5 mb-[26px] md:mb-40">
            <p className="sec-title">Notification</p>
            <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] py-[13px] px-[10px]">
              <Image
                src="/assets/history/search.svg"
                alt="search"
                width={24}
                height={24}
              />
              <input
                onInput={(e) => {
                  searchNotification(e);
                }}
                type="search"
                placeholder="Search"
                className="nav-text-sm !text-beta outline-none bg-[transparent]"
              />
            </div>
          </div>
          <div className="flex justify-between border-b border-grey-v-3 dark:border-opacity-[15%]">
            <div className="flex gap-5 md:gap-30 trade_history_scroll overflow-auto">
              <button
                className={`pb-20 nav-text-sm md:nav-text-lg border-b-[3px] border-[transparent] whitespace-nowrap ${
                  active === 1 && "border-primary !text-primary"
                }`}
                onClick={() => {
                  setActive(1);
                }}
              >
                All
              </button>
            </div>
          </div>

          <ul className="mt-7">
            {Ndata?.length > 0 &&
              Ndata?.map((item: any, index: number) => {
                let isImage = containsImageUrl(item?.message?.message);
                return (
                  <li key={index} className="pb-3 mb-3">
                    <Link
                      href={item?.url || "#"}
                      className="pb-3 mb-3 dark:border-[#25262a] inline-block w-full border-[#e5e7eb] border-b"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6">
                          <IconsComponent type="MessageIcon" />
                        </div>
                        <p className="admin-table-data !text-base">
                          New Message from{" "}
                          <span className="capitalize">{item?.type}</span>
                        </p>
                      </div>
                      {item?.type == "withdraw" && (
                        <p className="info-14-18 text-sm dark:text-[#a0a1a7] mb-2">
                          {item?.message?.message}
                        </p>
                      )}
                      <p className="info-14-18 text-sm dark:text-[#a0a1a7]">
                        {moment(item?.createdAt).format("YYYY-MM-DD")}
                      </p>
                    </Link>
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
