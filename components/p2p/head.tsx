import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import BuySellExpress from "./express/buySellExpress";

const Head = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [active, setActive] = useState(1);


  // console.log(session?.user,'p2p head ',status);

  let autherizedTabs = [
    {
      linkText: "Buy",
      linkUrl: "/p2p/buy",
    },
    {
      linkText: "Sell",
      linkUrl: "/p2p/sell",
    },

    {
      linkText: "User Center",
      linkUrl: "/p2p/user-center",
    },
    {
      linkText: "My Order",
      linkUrl: "/p2p/my-orders",
    },
    {
      linkText: "My Advertisement",
      linkUrl: "/p2p/my-advertisement",
    },
    {
      linkText: "Post Advertisement",
      linkUrl: "/p2p/postad",
    },
  ];
  const tabsLinks = [
    {
      linkText: "Buy",
      linkUrl: "/p2p/buy",
    },
    {
      linkText: "Sell",
      linkUrl: "/p2p/sell",
    },
    // {
    //   linkText:"FAQ",
    //   linkUrl:"/p2p/faq"
    // }
  ];

  if (status === "authenticated") {
  }

  return (
    <>
      {/* top heading and brief */}
      <div className="flex items-center justify-between">
        <div>
          <Link href='/p2p/buy'
            className={`${
              router.pathname !=='/p2p/express'
                ? "bg-primary !text-white"
                : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
            } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
            // onClick={() => {
            //   setActive(1);
            // }}
          >
            P2P Process
          </Link>
          <Link href='/p2p/express'
            className={`${
              router.pathname ==='/p2p/express'
                ? "bg-primary !text-white"
                : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
            } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
            // onClick={() => {
            //   setActive(2);
            // }}
          >
            {" "}
            Express
          </Link>

          <p className="sm-text mt-[15px]">
            Lorem Ipsum is simply dummy text of the printing.
          </p>
        </div>
        {/* <div className="border rounded-5 hidden md:flex gap-[10px] border-grey-v-1 dark:border-opacity-[15%] max-w-[370px] w-full py-[13px] px-[10px] ">
          <Image
            alt="search"
            loading="lazy"
            width={24}
            height={24}
            decoding="async"
            data-nimg={1}
            style={{ color: "transparent" }}
            src="/assets/history/search.svg"
          />
          <input
            type="search"
            placeholder="Search"
            className="nav-text-sm !text-beta outline-none bg-[transparent] w-full"
          />
        </div> */}
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto links_wrapper">
      {
        router?.pathname !=='/p2p/express' &&
      
          <div className="flex items-center gap-[10px] md:gap-30 mt-20 md:mt-30 w-max">
            {status === "authenticated" &&
              autherizedTabs.map((elem, ind) => {
                return (
                  <Fragment key={ind}>
                    <Link
                      href={`${elem.linkUrl}`}
                      className={`${
                        router.pathname === elem.linkUrl
                          ? "bg-primary !text-white"
                          : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
                      } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
                    >
                      {elem.linkText}
                    </Link>
                  </Fragment>
                );
              })}
            {status !== "authenticated" &&
              tabsLinks.map((elem, ind) => {
                return (
                  <Fragment key={ind}>
                    <Link
                      href={`${elem.linkUrl}`}
                      className={`${
                        router.pathname === elem.linkUrl
                          ? "bg-primary !text-white"
                          : "dark:text-beta bg-bg-secondary !text-body-primary dark:bg-black-v-1"
                      } !text-[14px] md:!text-[18px] px-[15px] md:px-[20px] py-[5px] md:py-[14px] rounded-[5px]`}
                    >
                      {elem.linkText}
                    </Link>
                  </Fragment>
                );
              })}
          </div>
       }
      </div>
    </>
  );
};

export default Head;
